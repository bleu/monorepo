"use client";

import { Nunito_Sans as SansFont } from "next/font/google";
import { useServerInsertedHTML } from "next/navigation";

const sans = SansFont({
  subsets: ["latin"],
  variable: "--font-family-sans",
  fallback: ["system-ui", "Helvetica Neue", "Helvetica", "Arial"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

function Fonts() {
  useServerInsertedHTML(() => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-family-sans: ${sans.style.fontFamily}, '-apple-system', 'BlinkMacSystemFont',
              'system-ui', 'Segoe UI', 'Roboto', 'Ubuntu', 'sans-serif';
          }
        `,
        }}
      />
    );
  });

  return null;
}

export default Fonts;
