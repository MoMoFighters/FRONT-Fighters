'use client';

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import GuestHeader from "./GuestHeader";

interface GuestLayoutShellProps {
    children: React.ReactNode;
}

export default function GuestLayoutShell({
    children,
}: GuestLayoutShellProps) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");

    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-white">
                {children}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <GuestHeader />
            <main className="h-full flex-1 bg-white pt-14">
                {children}
            </main>
            <Footer />
        </div>
    );
}
