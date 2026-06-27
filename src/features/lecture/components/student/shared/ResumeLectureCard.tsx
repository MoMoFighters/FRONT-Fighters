import Image from "next/image";
import Link from "next/link";

interface AvailableResumeLectureCardProps {
    href: string;
    thumbnail?: string;
    title: string;
    description: string;
    progress: number;
}

interface EmptyResumeLectureCardProps {
    empty: true;
}

type ResumeLectureCardProps =
    | AvailableResumeLectureCardProps
    | EmptyResumeLectureCardProps;

export default function ResumeLectureCard(props: ResumeLectureCardProps) {
    if ("empty" in props) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-950">
                    이어보기
                </h2>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                    이어볼 강의 영상이 존재하지 않습니다. 수강 신청을 한 후 영상을 시청해보세요!
                </p>
            </section>
        );
    }

    const {
        href,
        thumbnail,
        title,
        description,
        progress,
    } = props;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
                이어보기
            </h2>

            <div className="mt-4 flex gap-3">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-[10px] font-bold text-slate-400">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt="이어보기 강의"
                            fill
                            sizes="64px"
                            className="object-cover"
                        />
                    ) : (
                        "이미지 없음"
                    )}
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
                className="mt-4 flex h-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
                이어서 보기
            </Link>
        </section>
    );
}
