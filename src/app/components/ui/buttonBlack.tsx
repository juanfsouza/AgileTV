export function Button({
  children,
  variant,
  onClick,
}: {
  children: React.ReactNode;
  variant?: string;
  onClick: () => void;
}) {
  const variantClass =
    variant === "outline" ? "border border-gray-500 text-white" : "bg-black text-white";

  return (
    <button
      className={`${variantClass} mt-2 text-sm w-80 h-10 border border-gray-500 py-2 rounded-md`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
