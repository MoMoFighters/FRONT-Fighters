import AuthHeader from "../layout/AuthHeader";
import FooterVisibility from "../layout/FooterVisibility";
import StudentSidebar from "../layout/StudentSidebar";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="h-screen overflow-hidden bg-slate-50">

            {/* 헤더 고정 */}
            <div className="fixed top-0 left-0 right-0 z-50 h-16">
                <AuthHeader role="student" />
            </div>

            <div className="flex pt-16 h-full">

                {/* 사이드바 고정 */}
                <div className="fixed left-0 top-16 bottom-0 w-60">
                    <StudentSidebar />
                </div>

                {/* 메인만 스크롤 */}
                <main
                    className="
                        ml-60
                        flex-1
                        h-[calc(100vh-64px)]
                        scrollbar-none
                        overflow-y-auto
                    "
                >
                    <div className="min-h-full flex flex-col">

                        <div className="flex-1">
                            {children}
                        </div>

                        <FooterVisibility />

                    </div>
                </main>
            </div>
        </div>
    );
}