import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'outline';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#f0f5f1] text-[#5b7f63] dark:bg-[#1a2420] dark:text-[#94ba9a]',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      outline: 'border border-[#7C9A82] text-[#5B7F63] dark:border-[#5b7f63] dark:text-[#94ba9a]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
