import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ResumeLectureCardProps {
    href: string;
    thumbnail: StaticImageData;
    title: string;
    description: string;
    progress: number;
}

export default function ResumeLectureCard({
    href,
    thumbnail,
    title,
    description,
    progress,
}: ResumeLectureCardProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                이어보기
            </h2>

            <div className="mt-4 flex gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                    <Image
                        src={thumbnail}
                        alt="이어보기 강의"
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                        {title}
                    </p>

                    <p className="mt-1 truncate text-xs font-medium text-slate-500">
                        {description}
                    </p>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-indigo-400"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <Link
                href={href}
                className="mt-4 flex h-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-800"
            >
                이어서 보기
            </Link>
        </section>
    );
}
