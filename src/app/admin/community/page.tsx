import { MessageSquareText } from "lucide-react";

export default function AdminCommunityPage() {
    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                        <MessageSquareText className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-950">커뮤니티 관리</h1>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            게시글과 댓글 운영 기능을 이곳에서 관리합니다.
                        </p>
                    </div>
                </div>
            </div>

            <section className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
                <div>
                    <MessageSquareText className="mx-auto size-10 text-slate-400" />
                    <p className="mt-4 text-base font-bold text-slate-700">커뮤니티 관리 기능을 준비하고 있습니다.</p>
                    <p className="mt-2 text-sm font-medium text-slate-400">게시글, 댓글, 신고 연동 API가 정리되면 목록과 처리 흐름을 연결합니다.</p>
                </div>
            </section>
        </div>
    );
}
