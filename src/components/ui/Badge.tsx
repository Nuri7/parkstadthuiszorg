import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'outline';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#e5f2f4] text-[#5b7f63] dark:bg-[#02191c] dark:text-[#5cb0bd]',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      outline: 'border border-[#7C9A82] text-[#5B7F63] dark:border-[#5b7f63] dark:text-[#5cb0bd]',
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
