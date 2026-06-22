import { useTheme } from "@/lib/theme-provider";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  const { theme } = useTheme();

  return (
    <img
      src="/logo-white.png"
      alt="Keops Studios"
      className={className}
      style={theme === "light" ? { filter: "invert(1)" } : undefined}
    />
  );
}
