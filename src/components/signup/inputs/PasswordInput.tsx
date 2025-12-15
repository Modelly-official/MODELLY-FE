"use client";

import { useState } from "react";
import ShowIcon from "@/public/icons/signup/show.svg";
import HideIcon from "@/public/icons/signup/hide.svg";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error: string | null;
  successMessage?: string;
  errorMessage?: string;
  hintMessage?: string;
  maxLength?: number;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "비밀번호를 입력해주세요",
  error,
  successMessage,
  errorMessage,
  hintMessage,
  maxLength = 20,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-900 text-body-1-medium">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full border ${error === "error" ? "border-error" : "border-gray-400"} rounded-xl px-4 py-3 pr-12 text-body-2-medium text-gray-900 placeholder:text-gray-600 focus:outline-none`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
        />
        {value && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ShowIcon /> : <HideIcon />}
          </button>
        )}
      </div>
      {error === null && hintMessage && (
        <p className="pl-1.5 text-caption-1 text-gray-600">{hintMessage}</p>
      )}
      {error === "error" && errorMessage && (
        <p className="pl-1.5 text-caption-1 text-error">{errorMessage}</p>
      )}
      {error === "success" && successMessage && (
        <p className="pl-1.5 text-caption-1 text-blue-700">{successMessage}</p>
      )}
    </div>
  );
};

export default PasswordInput;
