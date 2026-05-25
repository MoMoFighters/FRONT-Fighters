import AUthHeader from "../layout/AuthHeader";
import StudentSidebar from "../layout/StudentSidebar";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col flex-1">
            <AUthHeader role="student" />
            <div className="flex flex-1">
                <StudentSidebar />
                <main className="bg-slate-50 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
