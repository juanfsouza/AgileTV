export function Input({
  type,
  id,
  placeholder,
  value,
  onChange,
  onFocus,
}: {
  type: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}) {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      className="text-white bg-black border rounded-md p-2 my-2 focus:bg-black focus:outline-none transition-all"
      style={{
        WebkitTextFillColor: "white",
        WebkitBoxShadow: "0 0 0px 1000px black inset",
      }}
    />
  );
}
