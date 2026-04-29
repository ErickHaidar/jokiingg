import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "jokiin.gg | Elite Gaming Services",
  description: "Jasa joki Genshin, Wuwa, HSR, Arknights. Rawat akun terpercaya tanpa cheat & bot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0A0A0A] text-white antialiased`}>
        {children}
        
        <footer className="border-t border-white/10 bg-[#0A0A0A] pt-16 pb-8 mt-20">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="text-2xl font-bold tracking-wider mb-4">
                jokiin<span className="text-blue-500">.gg</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                Elite Gaming Services. Quiet, dark, and sophisticated manual account progression. 
                Kami menjamin 100% keamanan akun tanpa eksploitasi pihak ketiga.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-500 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Payment Methods: DANA, GOPAY, BCA, MANDIRI</li>
                <li>Operational Hours: 07.00 - 22.00 WIB</li>
                <li><a href="https://ig.me/m/jokiin.gg" target="_blank" className="hover:text-blue-500 transition">Contact Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} jokiin.gg - Elite Gaming Services. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="bg-white/5 px-3 py-1 rounded border border-white/5">DANA</span>
              <span className="bg-white/5 px-3 py-1 rounded border border-white/5">GOPAY</span>
              <span className="bg-white/5 px-3 py-1 rounded border border-white/5">BANK TRANSFER</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}