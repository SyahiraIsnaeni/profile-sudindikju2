import * as React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
      destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-700',
      link: 'text-blue-600 underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-11 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-12 rounded-md px-8 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className || ''}`}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };