import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-[var(--color-sage-500)] text-white hover:bg-[var(--color-sage-600)] hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-[var(--color-sage-500)]',
      secondary: 'bg-[var(--color-terra-400)] text-white hover:bg-[var(--color-terra-500)] hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-[var(--color-terra-400)]',
      outline: 'border-2 border-[var(--color-sage-500)] text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)] hover:bg-[var(--color-sage-50)] dark:hover:bg-[var(--color-sage-900)] focus-visible:ring-[var(--color-sage-500)]',
      ghost: 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)] hover:bg-[var(--color-sage-50)] dark:hover:bg-[var(--color-sage-900)] focus-visible:ring-[var(--color-sage-500)]',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#128C7E] hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-[#25D366]',
      cta: 'bg-[#E8734A] text-white hover:bg-[#D4603A] hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-[#E8734A]',
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

export { Button };
