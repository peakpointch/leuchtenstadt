import React from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "main" | "large";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-dark-900",
  secondary: "bg-brand-500 text-white hover:bg-dark-900",
  tertiary: "bg-gray-200 text-brand-900 hover:bg-gray-300",
};

const sizes: Record<ButtonSize, string> = {
  main: "px-8 py-3",
  large: "px-10 py-5",
};

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${sizes[size || "main"]} ${
        variants[variant || "primary"]
      } rounded-sm cursor-pointer transition-all duration-300`}
    >
      {children}
    </button>
  );
};

export default Button;
