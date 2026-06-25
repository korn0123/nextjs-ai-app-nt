import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "ระบบจัดการร้านค้า",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="font-sans">
      <body>
        <div className="min-h-screen bg-muted/30">
          <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-base font-semibold">Admin Dashboard</h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
