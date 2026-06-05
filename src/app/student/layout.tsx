import AUthHeader from "@/components/layout/AuthHeader";
import StudentShell from "@/components/layout/StudentShell";
import StudentSidebar from "@/components/layout/StudentSidebar";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="h-screen overflow-hidden bg-slate-50">
            <StudentShell sidebar={<StudentSidebar />} header={<AUthHeader role="student" />}>{children}</StudentShell>
        </div>
    );
}