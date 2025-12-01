import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
//definerar metadata för sidan, alltså titel och beskrivning kommer att synas i fliken 
export const metadata: Metadata = {
  title: "Arbetsprov",
  description: "Login system",
};
//root layout komponent som wrappas runt hela appen. 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
