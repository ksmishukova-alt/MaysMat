import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "МышМат",
  description: "Учимся думать — геймифицированная платформа по логике и олимпиадной математике",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
