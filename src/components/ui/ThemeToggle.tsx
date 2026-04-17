import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-[#5b7f63] dark:text-[#94ba9a] hover:bg-[#f0f5f1] dark:hover:bg-[#1a2420] focus:outline-none focus:ring-2 focus:ring-[#7c9a82] transition-colors"
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
