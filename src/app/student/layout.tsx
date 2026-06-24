import StudentHeader from "@/components/layout/StudentHeader";
import Footer from "@/components/layout/Footer";
import StudentLayoutShell from "@/components/layout/StudentLayoutShell";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StudentLayoutShell
            header={<StudentHeader role="student" />}
            footer={<Footer />}
        >
            {children}
        </StudentLayoutShell>
    );
}