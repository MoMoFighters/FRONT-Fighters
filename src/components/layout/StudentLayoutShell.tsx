"use client";

import { usePathname } from "next/navigation";

const IMAGE_BACKGROUND_PATHS = [
    "/student",
    "/student/study",
    "/student/art",
    "/student/cook",
    "/student/fitness",
    "/student/beauty",
];

export default function StudentLayoutShell({
    header,
    footer,
    children,
}: Readonly<{
    header: React.ReactNode;
    footer: React.ReactNode;
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const isImageBackgroundPage =
        IMAGE_BACKGROUND_PATHS.includes(pathname);

    if (isImageBackgroundPage) {
        return (
            <div className="flex h-screen flex-col overflow-hidden bg-white">
                {header}

                <main className="min-h-0 flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {header}

            <main className="flex-1 overflow-y-auto bg-white">
                {children}
            </main>

            {footer}
        </div>
    );
}