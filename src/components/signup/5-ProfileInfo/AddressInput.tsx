'use client';

import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import LocationIcon from '@/public/icons/signup/location.svg';

interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
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
    let fullAddress = data.address;
    let extraAddress = '';

    // 도로명 주소인 경우 추가 정보 포함하도록 (법정동, 건물명), 예: "서울 마포구 와우산로 94 (상수동, 홍익대학교)"
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    onAddressSearch(fullAddress);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-900 text-body-1-medium">매장 주소</label>
      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-400 rounded-xl px-4 py-3 pr-10 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none cursor-pointer"
          placeholder="매장 주소를 입력해주세요"
          value={address}
          readOnly
          onClick={() => setIsOpen(true)}
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          <LocationIcon />
        </button>
      </div>
      <input
        type="text"
        className="border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none"
        placeholder="상세주소"
        value={detailAddress}
        onChange={(e) => onDetailAddressChange(e.target.value)}
        maxLength={50}
      />
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-[90%] max-w-[500px] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">주소 검색</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl curosor-pointer"
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
