import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();
  return (
    <button
    onClick={toggleTheme}
    className="p-2 rounded-lg shadow-neumorphic dark:shadow-dark-neumorphic 
               hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset"
  >
    {theme === "dark" ? (
      <FiSun className="text-yellow-400" size={24} />
    ) : (
      <FiMoon className="text-gray-600" size={24} />
    )}
  </button>
  )
}
