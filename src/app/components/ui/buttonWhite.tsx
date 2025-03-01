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
    variant === "outline" ? "border border-gray-500 text-white" : "bg-white text-black";

  return (
    <button
      className={`${variantClass} mt-2 text-sm h-10 w-80 rounded-md`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
