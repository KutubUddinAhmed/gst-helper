import React from "react";

export function useIsMobileOrTablet(breakpoint = 1024): boolean {
  const [isMobileOrTablet, setIsMobileOrTablet] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const updateMatch = () => setIsMobileOrTablet(mediaQuery.matches);
    updateMatch();

    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [breakpoint]);

  return isMobileOrTablet;
}
