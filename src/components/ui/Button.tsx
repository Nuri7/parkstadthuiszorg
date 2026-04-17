import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-[#B8623E] text-white hover:bg-[#9C4F30] hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-[#B8623E]',
      secondary: 'bg-[#7C9A82] text-white hover:bg-[#5B7F63] hover:shadow-lg focus-visible:ring-[#7C9A82]',
      outline: 'border-2 border-[#7C9A82] text-[#5B7F63] dark:text-[#94ba9a] hover:bg-[#7C9A82] hover:text-white focus-visible:ring-[#7C9A82]',
      ghost: 'text-[#5B7F63] dark:text-[#94ba9a] hover:bg-[#f0f5f1] dark:hover:bg-[#1a2420] focus-visible:ring-[#7C9A82]',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, cn };
