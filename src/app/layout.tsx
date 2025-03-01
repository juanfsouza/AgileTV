import { Nunito } from "next/font/google";
import QueryClientWrapper from "@/src/app/components/QueryClientWrapper";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata = {
  title: "AgileTV",
  description: "Series & Filmes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}> {/* Aplicando a fonte Nunito */}
        <QueryClientWrapper>{children}</QueryClientWrapper>
      </body>
    </html>
  );
}
