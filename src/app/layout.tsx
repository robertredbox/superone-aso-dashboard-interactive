import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata = {
  title: "SuperOne ASO Dashboard - Interactive",
  description: "Year-to-Date ASO Dashboard for SuperOne Fan Battle iOS App with interactive elements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
