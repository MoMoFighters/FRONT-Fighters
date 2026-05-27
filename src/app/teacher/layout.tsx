import AUthHeader from "../layout/AuthHeader";
import Footer from "../layout/Footer";
import TeacherSidebar from "../layout/TeacherSidebar";

export default function TeacherLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen overflow-hidden bg-slate-50">
            <div className="fixed top-0 left-0 right-0 z-50 h-16">
                <AUthHeader role="teacher" />
            </div>
            <div className="flex pt-16 h-full">
                <div className="fixed left-0 top-16 bottom-0 w-60">
                    <TeacherSidebar />
                </div>
                <main className="ml-60 flex-1 h-full overflow-y-auto">
                    <div className="min-h-full flex flex-col">

                        <div className="flex-1">
                            {children}
                        </div>

                        <Footer />

                    </div>
                </main>
            </div>
        </div>
    );
}
