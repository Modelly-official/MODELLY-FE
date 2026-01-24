'use client';

import { formatDistrict } from './locationFormat';

const NAVER_GEOCODER_SCRIPT_ID = 'naver-maps-geocoder-submodule';

function getGeocoderScriptSrc(): string | null {
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID;
  if (!clientId) return null;
  return `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
}

function ensureNaverGeocoder(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.naver?.maps?.Service?.reverseGeocode) return Promise.resolve();

  const scriptSrc = getGeocoderScriptSrc();
  if (!scriptSrc) return Promise.reject(new Error('Naver map client id is missing.'));

  const existing =
    (document.getElementById(NAVER_GEOCODER_SCRIPT_ID) as HTMLScriptElement | null) ??
    (document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null);

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Naver geocoder script.')));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = NAVER_GEOCODER_SCRIPT_ID;
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Naver geocoder script.'));
    document.head.appendChild(script);
  });
}

async function waitForGeocoderService(maxRetries = 10, delayMs = 100): Promise<boolean> {
  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    if (window.naver?.maps?.Service?.reverseGeocode) return true;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

function extractDistrictLabel(response: any): string | null {
  const byRegion = response?.v2?.results?.[0];
  if (byRegion?.region) {
    const area2 = byRegion.region.area2?.name;
    const area3 = byRegion.region.area3?.name;
    const area4 = byRegion.region.area4?.name;
    if (area2 && area3) return `${area2} ${area3}`;
    if (area2 && area4) return `${area2} ${area4}`;
    if (area2) return area2;
  }

  const addressText = response?.v2?.address?.jibunAddress ?? response?.v2?.address?.roadAddress;
  if (addressText) return formatDistrict(addressText);

  const legacyText =
    response?.result?.items?.[0]?.address ?? response?.result?.items?.[0]?.jibunAddress ?? null;
  if (legacyText) return formatDistrict(legacyText);

  return null;
}

export async function reverseGeocodeToDistrict(latitude: number, longitude: number): Promise<string | null> {
  await ensureNaverGeocoder();

  const isReady = await waitForGeocoderService();
  if (!isReady) return null;

  const naverMaps = window.naver?.maps as any;

  return new Promise((resolve) => {
    const orderType = naverMaps.Service?.OrderType;
    const orders = orderType ? [orderType.ADDR, orderType.ROAD_ADDR].join(',') : 'addr,roadaddr';
    const coordType = naverMaps.Service?.CoordType?.WGS84 ?? 'WGS84';

    naverMaps.Service.reverseGeocode(
      {
        coords: new naverMaps.LatLng(latitude, longitude),
        coordType,
        orders,
      },
      (status: string, response: any) => {
        const okStatus = naverMaps.Service?.Status?.OK ?? 'OK';
        if (status !== okStatus) {
          resolve(null);
          return;
        }

        resolve(extractDistrictLabel(response));
      }
    );
  });
}
