export function Label({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) {
    return (
      <label htmlFor={htmlFor} className="text-sm text-white">{children}</label>
    );
  }