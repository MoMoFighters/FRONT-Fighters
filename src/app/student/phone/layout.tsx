import PhoneTopBar from "@/components/layout/PhoneTopBar";

export default function PhoneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[calc(100vh-137px)]  w-full items-center justify-center overflow-hidden bg-white px-8 py-6">
            <div className="relative aspect-[16/9] h-full max-h-[720px] w-full max-w-[1180px] overflow-hidden rounded-[46px] border-[10px] border-slate-950 bg-slate-950 shadow-2xl shadow-slate-300/70">
                <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[34px] bg-white">
                    <div className="absolute inset-0 " />

                    <div className="relative z-10 flex h-full min-h-0 flex-col">
                        <PhoneTopBar />

                        <main className="min-h-0 flex-1 overflow-hidden bg-transparent p-2">
                            <div className="h-full min-h-0 overflow-hidden rounded-3xl [&>*]:h-full [&>*]:min-h-0">
                                {children}
                            </div>
                        </main>

                        <footer className="flex h-10 shrink-0 items-center justify-center bg-white/70 backdrop-blur-md">
                            <div className="h-1.5 w-32 rounded-full bg-slate-900/25 shadow-sm" />
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}