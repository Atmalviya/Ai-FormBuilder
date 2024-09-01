import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ai Form Generator",
  description: "Generate your form in seconds",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider >
      <html lang="en" data-theme="light">
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html> 
    </ClerkProvider >
  );
}
