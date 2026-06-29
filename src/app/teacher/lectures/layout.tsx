import LectureCreateFloatingWidget from "@/features/lecture/components/teacher/LectureCreateFloatingWidget";
import { LectureCreateUploadProvider } from "@/features/lecture/components/teacher/LectureCreateUploadContext";

export default function TeacherLecturesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LectureCreateUploadProvider>
            {children}
            <LectureCreateFloatingWidget />
        </LectureCreateUploadProvider>
    );
}
