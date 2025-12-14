"use client";

import LocationIcon from "@/public/icons/signup/location.svg";

interface AddressInputProps {
  address: string;
  detailAddress: string;
  onAddressSearch: () => void;
  onDetailAddressChange: (value: string) => void;
}

export default function AddressInput({
  address,
  detailAddress,
  onAddressSearch,
  onDetailAddressChange,
}: AddressInputProps) {
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
          onClick={onAddressSearch}
        />
        <button
          type="button"
          onClick={onAddressSearch}
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
    </div>
  );
}
