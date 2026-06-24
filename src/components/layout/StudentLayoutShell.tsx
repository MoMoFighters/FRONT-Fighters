"use client";

import { useParams, usePathname } from "next/navigation";

const IMAGE_BACKGROUND_PATHS = [
    "/student",
    "/student/study",
    "/student/art",
    "/student/cook",
    "/student/fitness",
    "/student/beauty",
    "/student/users"
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
    const params = useParams();

    const isImageBackgroundPage =
        IMAGE_BACKGROUND_PATHS.includes(pathname);

    if (isImageBackgroundPage || params.userId) {
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

            <main className="flex-1 bg-white">
                {children}
            </main>

            {footer}
        </div>
    );
}
