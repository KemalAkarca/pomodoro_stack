// app/layout.tsx
import "./globals.css"; // BU SATIRI EN ÜSTE EKLE (Tasarımın geri gelmesi için şart)
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}