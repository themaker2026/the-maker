import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

export const metadata = {
  title: "The Maker — Premium Brass Handicrafts",
  description:
    "Exporting handcrafted brass bells, key rings, and handicraft items worldwide. Quality craftsmanship, global reach.",
  keywords:
    "brass handicrafts, brass bells, key rings, handmade exports, Indian handicrafts",
  openGraph: {
    title: "The Maker — Premium Brass Handicrafts",
    description:
      "Exporting handcrafted brass bells, key rings, and handicraft items worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
