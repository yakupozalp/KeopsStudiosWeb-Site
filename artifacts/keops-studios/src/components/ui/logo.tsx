import { useTheme } from "@/lib/theme-provider";
import darkLogoPath from "@assets/1778786004199~2_1782114277260.jpg";
import lightLogoPath from "@assets/1778786046037~2_1782114277241.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  const { theme } = useTheme();

  return (
    <img
      src={theme === "dark" ? darkLogoPath : lightLogoPath}
      alt="Keops Studios"
      className={className}
    />
  );
}
