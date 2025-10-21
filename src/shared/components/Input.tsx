interface InputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded text-[var(--color-text-primary)] focus:outline-none transition-colors duration-200"
      style={{
        backgroundColor: "var(--input-bg-strong)",
        border: "1px solid var(--input-border)",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.borderColor = "var(--input-border-focus)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "var(--input-border)")
      }
    />
  );
}
