import { useState } from "react";
import { usernameSchema, passwordSchema } from "@/src/schemas/signupSchema";

export function useUsernameValidation(initialValue: string) {
  const [username, setUsername] = useState(initialValue);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleChange = (value: string) => {
    const filtered = value.replace(/[^a-z0-9]/g, "");
    setUsername(filtered);
    setIsAvailable(null);
    return filtered;
  };

  const checkAvailability = async () => {
    const result = usernameSchema.safeParse(username);
    if (!result.success) {
      setIsAvailable(false);
      return false;
    }
    // TODO: API 호출
    setIsAvailable(true);
    return true;
  };

  return {
    username,
    isAvailable,
    handleChange,
    checkAvailability,
    reset: () => {
      setUsername("");
      setIsAvailable(null);
    },
  };
}

export function usePasswordValidation() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const validatePassword = (pwd: string): "success" | "error" | null => {
    if (!pwd) return null;
    const result = passwordSchema.safeParse(pwd);
    return result.success ? "success" : "error";
  };

  const validateConfirm = (confirm: string): "success" | "error" | null => {
    if (!confirm) return null;
    return confirm === password ? "success" : "error";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(validatePassword(value));
    if (passwordConfirm) {
      setConfirmError(validateConfirm(passwordConfirm));
    }
    return value;
  };

  const handleConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    setConfirmError(validateConfirm(value));
    return value;
  };

  return {
    password,
    passwordConfirm,
    error,
    confirmError,
    handlePasswordChange,
    handleConfirmChange,
    isValid: password && error === "success" && passwordConfirm && confirmError === "success",
  };
}
