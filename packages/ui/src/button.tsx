import type { JSX, ReactNode } from "react";


export function Button({
  children, 
  className,
  onClick
} : {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}): JSX.Element {
  return (
    <button
      className = {`p-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded ${className}`}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {children}
    </button>
  );
}