import { useTheme } from "@/lib/theme-provider";
import { useGetSiteContent } from "@workspace/api-client-react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  const { theme } = useTheme();
  const { data: content } = useGetSiteContent();

  const isDark = theme === "dark";

  const src = isDark
    ? (content?.logoDarkUrl || "/logo-dark-mode.png")
    : (content?.logoLightUrl || "/logo-light-mode.png");

  return (
    <img
      src={src}
      alt="Keops Studios"
      className={className}
    />
  );
}
