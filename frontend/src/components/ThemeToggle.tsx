import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ iconSize = "h-5 w-5" }) {
    const { theme, setTheme } = useTheme();

    const isDark =
        theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        setTheme(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun className={iconSize} /> : <Moon className={iconSize} />}{" "}
        </button>
    );
}
