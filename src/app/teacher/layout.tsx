import AUthHeader from "../layout/AuthHeader";
import TeacherSidebar from "../layout/TeacherSidebar";

export default function TeacherLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <AUthHeader role="teacher" />
            <div className="flex flex-1">
                <TeacherSidebar />
                <main className="bg-slate-50 p-12 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
