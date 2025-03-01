import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-black text-white shadow-lg rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="font-bold text-xl">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="my-4">{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-between">{children}</div>;
}

export function CardFooterCenter({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center mt-4">{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}
