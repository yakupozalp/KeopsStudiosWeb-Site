import { useTheme } from "@/lib/theme-provider";
import darkLogoPath from "@assets/1778786004199_2-removebg-preview_1782115336811.png";
import lightLogoPath from "@assets/1778786046037_2-removebg-preview_1782115332387.png";

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
