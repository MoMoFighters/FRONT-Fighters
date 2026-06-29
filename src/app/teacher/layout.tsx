import TeacherHeader from "../../components/layout/TeacherHeader";
import Footer from "../../components/layout/Footer";
import TeacherSidebar from "@/components/layout/TeacherSidebar";
import LectureCreateFloatingWidget from "@/features/lecture/components/teacher/LectureCreateFloatingWidget";
import { LectureCreateUploadProvider } from "@/features/lecture/components/teacher/LectureCreateUploadContext";

export default function TeacherLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen overflow-hidden bg-slate-50">
            <div className="fixed top-0 left-0 right-0 z-50 h-16">
                <TeacherHeader role="teacher" />
            </div>
            <div className="flex pt-[55px] h-full">
                <main className="flex-1 h-full overflow-y-auto">
                    <div className="min-h-full flex flex-col">

                        <div className="flex-1 flex flex-row h-full">
                            <LectureCreateUploadProvider>
                                <TeacherSidebar />
                                {children}
                                <LectureCreateFloatingWidget />
                            </LectureCreateUploadProvider>
                        </div>

                        <Footer />

                    </div>
                </main>
            </div>
        </div>
    );
}
