import { type JSX } from "react";

export function Input({
  className,
  type,
  placeholder,
  value,
  onChange
}: {
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | null;
}): JSX.Element {
  return (
    <input
      className={`p-2 border rounded-lg ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}