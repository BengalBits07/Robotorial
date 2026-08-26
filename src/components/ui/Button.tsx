import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] glow';
  
  const variantStyles = {
    primary: 'bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-white focus:ring-[rgb(var(--primary))]/50',
    secondary: 'bg-[rgb(var(--secondary))] hover:bg-[rgb(var(--secondary))]/90 text-white focus:ring-[rgb(var(--secondary))]/50',
    outline: 'border border-[rgb(var(--primary))] bg-transparent text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/10 focus:ring-[rgb(var(--primary))]/50',
    ghost: 'bg-transparent hover:bg-white/10 text-[rgb(var(--foreground))] focus:ring-white/50',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
