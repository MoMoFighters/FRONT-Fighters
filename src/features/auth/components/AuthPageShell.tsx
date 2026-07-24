import Image from "next/image";
import auth from "@/app/assets/img/auth.png";
import Link from "next/link";

interface AuthPageShellProps {
    title: string;
    description: string;
    children: React.ReactNode;
    compact?: boolean;
}

export default function AuthPageShell({
    title,
    description,
    children,
    compact = false,
}: AuthPageShellProps) {
    return (
        <div className="grid h-screen bg-white lg:grid-cols-2 overflow-hidden">
            <section className="relative hidden h-screen overflow-hidden lg:block">
                <Image
                    src={auth}
                    alt="MoMoCITY 아이콘"
                    fill
                    sizes="50vw"
                    priority
                />
                <Link href="/">
                    <div className="absolute left-[6%] top-[4%] h-[6%] w-[27%] cursor-pointer"></div>
                </Link>
            </section>

            <section className="flex h-screen items-center justify-center bg-white px-6 py-12 overflow-hidden">
                <div className={`w-full max-w-[468px] rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "px-6 py-6" : "px-8 py-8"}`}>
                    <div className={compact ? "mb-4 text-center" : "mb-7 text-center"}>
                        <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 lg:hidden ${compact ? "mb-2" : "mb-5"}`}>
                            <Image
                                src={auth}
                                alt="MoMoCITY 아이콘"
                                width={30}
                                height={30}
                            />
                        </div>
                        <h1 className="text-[1.55rem] font-bold tracking-tight text-slate-950">
                            {title}
                        </h1>
                        <p className={`text-[13px] font-medium leading-6 text-slate-500 ${compact ? "mt-1" : "mt-3"}`}>
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </section>
        </div>
    );
}
