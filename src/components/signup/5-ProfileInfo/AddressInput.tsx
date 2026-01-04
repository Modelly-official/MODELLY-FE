'use client';

import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import LocationIcon from '@/public/icons/signup/location.svg';

interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  jibunAddress: string;
  autoJibunAddress: string;
}

interface AddressInputProps {
  address: string;
  detailAddress: string;
  onAddressSearch: (address: string) => void;
  onDetailAddressChange: (value: string) => void;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  address,
  detailAddress,
  onAddressSearch,
  onDetailAddressChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data: DaumPostcodeData) => {
    // 항상 지번 주소 사용
    const fullAddress = data.jibunAddress || data.autoJibunAddress;

    onAddressSearch(fullAddress);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-1-medium text-gray-900">매장 주소</label>
      <div className="relative">
        <input
          type="text"
          className="text-body-2-medium py-3.5-10 w-full cursor-pointer rounded-xl border border-gray-400 px-4 text-gray-900 placeholder:text-gray-600 focus:outline-none"
          placeholder="매장 주소를 입력해주세요"
          value={address}
          readOnly
          onClick={() => setIsOpen(true)}
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
        >
          <LocationIcon />
        </button>
      </div>
      <input
        type="text"
        className="text-body-2-medium rounded-xl border border-gray-400 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none"
        placeholder="상세주소"
        value={detailAddress}
        onChange={(e) => onDetailAddressChange(e.target.value)}
        maxLength={50}
      />
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-[500px] rounded-lg bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">주소 검색</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-2xl text-gray-600 hover:text-gray-900"
              >
                ×
              </button>
            </div>
            <DaumPostcode onComplete={handleComplete} />
          </div>
        </div>
      )}
    </div>
  );
};
