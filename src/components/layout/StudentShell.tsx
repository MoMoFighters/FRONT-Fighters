'use client';

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import AUthHeader from "./AuthHeader";

const NO_LAYOUT_PATHS = [
    "/student",
    "/student/study",
    "/student/art",
    "/student/cook",
    "/student/fitness",
    "/student/beauty",
];

export default function StudentShell({
    children,
    sidebar,
    header
}: Readonly<{
    children: React.ReactNode;
    sidebar: React.ReactNode;
    header: React.ReactNode;
}>) {
    const pathname = usePathname();

    const isNoLayoutPage =
        NO_LAYOUT_PATHS.includes(pathname);

    return (
        <>
            {!isNoLayoutPage && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    {header}
                </div>
            )}

            {isNoLayoutPage && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    {header}
                </div>
            )}

            {!isNoLayoutPage && (
                <div className="fixed left-0 top-12 bottom-0 z-40 w-60">
                    {sidebar}
                </div>
            )}

            <main
                className={
                    isNoLayoutPage
                        ? "h-full overflow-hidden bg-slate-50"
                        : "ml-48 mt-12 h-[calc(100vh-3rem)] bg-slate-50 overflow-y-auto"
                }
            >
                {isNoLayoutPage ? (
                    children
                ) : (
                    <div className="min-h-full flex flex-col">
                        <div className="flex-1">
                            {children}
                        </div>

                        <Footer />
                    </div>
                )}
            </main>
        </>
    );
}