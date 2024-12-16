import Sidebar from "@/components/dashboard/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DOLLAR SEO CLUB",
  description: "Optimise One Keyword For One Dollar — No Limits, No Rules, No Minimum Contracts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow overflow-y-auto">
        <Sidebar />
        <main className="flex-grow pt-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}