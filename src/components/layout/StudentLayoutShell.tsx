"use client";

import { useParams, usePathname } from "next/navigation";

const IMAGE_BACKGROUND_PATHS = [
    "/student",
    "/student/study",
    "/student/art",
    "/student/cook",
    "/student/fitness",
    "/student/beauty",
    "/student/users",
    "/student/friends",
    "/student/calendar"
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

    // 그룹 스터디룸 / 솔로 세션 페이지는 타이머 화면에 집중할 수 있도록 푸터를 없앤다.
    const isStudySessionPage = pathname?.startsWith("/student/group-study/") ?? false;

    if (isImageBackgroundPage || params.userId) {
        return (
            <div className="flex h-auto min-h-screen flex-col overflow-visible bg-white md:h-screen md:overflow-hidden">
                {header}

                <main className="flex-1 pt-14 md:min-h-0 md:overflow-hidden">
                    {children}
                </main>

                {/* 모바일(md 미만)에서는 도시 배경 대신 리스트형 레이아웃을 쓰므로, 기존에 반응형 처리된 footer를 이 페이지들에도 노출한다 */}
                <div className="block md:hidden">
                    {footer}
                </div>
            </div>
        );
    }

    if (isStudySessionPage) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                {header}

                <main className="flex-1 bg-white pt-14">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {header}

            <main className="flex-1 bg-white pt-14">
                {children}
            </main>

            {footer}
        </div>
    );
}
