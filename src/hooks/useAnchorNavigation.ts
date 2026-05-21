"use client";

import { usePathname } from 'next/navigation';

/**
 * Shared hook for smooth-scrolling anchor navigation.
 * Handles both same-page hash links and cross-page navigation.
 */
export function useAnchorNavigation() {
  const pathname = usePathname();
  const location = { pathname }; // mocked for smooth transition

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#') && location.pathname === '/') {
      e.preventDefault();
      const id = path.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', path);
      }
    } else if (path === '/' && location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  return { handleNavClick, location };
}
