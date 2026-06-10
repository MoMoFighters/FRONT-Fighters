import AuthHeader from "@/components/layout/AuthHeader";
import Footer from "@/components/layout/Footer";
import StudentLayoutShell from "@/components/layout/StudentLayoutShell";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StudentLayoutShell
            header={<AuthHeader role="student" />}
            footer={<Footer />}
        >
            {children}
        </StudentLayoutShell>
    );
}