import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-[#5b7f63] dark:text-[#5cb0bd] hover:bg-[#e5f2f4] dark:hover:bg-[#02191c] focus:outline-none focus:ring-2 focus:ring-[#7c9a82] transition-colors"
      aria-label="Schakel donkere modus in/uit"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
