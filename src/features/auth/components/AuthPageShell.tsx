import Image from "next/image";
import auth from "@/app/assets/img/auth.png";
import Link from "next/link";

interface AuthPageShellProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function AuthPageShell({
    title,
    description,
    children,
}: AuthPageShellProps) {
    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-2">
            <section className="relative min-h-screen overflow-hidden">
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

            <section className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
                <div className="w-full max-w-[468px] rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
                    <div className="mb-7 text-center">
                        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 lg:hidden">
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
                        <p className="mt-3 text-[13px] font-medium leading-6 text-slate-500">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </section>
        </div>
    );
}
