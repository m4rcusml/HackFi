import "./globals.css";

export const metadata = {
  title: "HackFi Mockado",
  description: "Frontend mockado para interagir com os contratos do HackFi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
