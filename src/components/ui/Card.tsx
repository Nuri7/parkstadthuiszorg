import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-[#243029] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(124,154,130,0.1)] border border-[#ede7db] dark:border-[#086370] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(124,154,130,0.16)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export { Card };
