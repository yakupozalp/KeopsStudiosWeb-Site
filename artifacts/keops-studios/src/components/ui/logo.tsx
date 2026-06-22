import { useTheme } from "@/lib/theme-provider";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  const { theme } = useTheme();

  return (
    <img
      src={theme === "dark" ? "/logo-dark-mode.png" : "/logo-light-mode.png"}
      alt="Keops Studios"
      className={className}
    />
  );
}
