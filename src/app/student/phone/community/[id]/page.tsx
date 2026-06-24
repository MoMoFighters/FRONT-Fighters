import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";
import PostLikeBtn from "@/features/post/PostLikeBtn";
import PostDetailSide from "@/components/phone/community/PostDetailSide";

interface CommunityPostDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

type CommunityPostCategory =
    | "STUDY"
    | "FASHION"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";

type CommunityAuthorRole = "STUDENT" | "TEACHER" | "ADMIN";

type CommunityPostContent =
    | {
        type: "TEXT";
        content: string;
    }
    | {
        type: "IMAGE";
        content: string;
    };

interface CommunityPostDetail {
    postId: number;
    title: string;
    category: CommunityPostCategory;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    isMine: boolean;
    authorName: string;
    authorProfileImageUrl: string;
    authorRole: CommunityAuthorRole;
    authorId: number;
    contents: CommunityPostContent[];
    createdAt: string;
}

const COMMUNITY_POST: CommunityPostDetail = {
    postId: 1,
    title: "모강사 코딩 강의 리뷰",
    category: "STUDY",
    viewCount: 11,
    likeCount: 5,
    commentCount: 5,
    isMine: false,
    authorName: "김태완",
    authorProfileImageUrl: "https://placehold.co/80x80/e0e7ff/4f46e5?text=M",
    authorRole: "STUDENT",
    authorId: 3,
    contents: [
        {
            type: "TEXT",
            content:
                "공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,공부가 이렇게 재밌는거였다니,,",
        },
        {
            type: "IMAGE",
            content: "https://placehold.co/900x560/e0e7ff/4f46e5?text=Community+Image",
        },
        {
            type: "TEXT",
            content:
                "저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. 저는 공부만 하다 죽을게요. ",
        },
    ],
    createdAt: "2026-06-18T13:00:00.000000Z",
};

export default async function CommunityPostDetailPage({
    params,
}: CommunityPostDetailPageProps) {
    const { id } = await params;

    const post: CommunityPostDetail = {
        ...COMMUNITY_POST,
        postId: Number(id) || COMMUNITY_POST.postId,
    };

    return (
        <section className="grid h-full min-h-0 grid-cols-[7fr_3fr] gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <article className="flex min-h-0 flex-col rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
                <header className="w-full border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href="/student/phone/community"
                            className="inline-flex items-center gap-1 text-xs font-black text-slate-400 transition hover:text-indigo-500"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            목록 보기
                        </Link>

                        {!post.isMine ? (
                            <CreateReportBtn triggerClassName="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100" />
                        ) : (
                            <Link
                                className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
                                href={`/student/phone/community/${id}/edit`}
                            >
                                수정
                            </Link>
                        )}
                    </div>

                    <div className="mt-2 flex min-w-0 items-center gap-2">
                        <h1 className="min-w-0 flex-1 truncate text-xl font-black tracking-tight text-slate-900">
                            {post.title}
                        </h1>
                        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-500">
                            {post.category}
                        </span>
                        <span className="shrink-0 text-xs font-bold text-slate-400">
                            {post.createdAt.slice(0, 10)}
                        </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                        <Link
                            href={post.isMine
                                ? "/student/phone/community/mypage"
                                : `/student/phone/community/user/${post.authorId}`
                            }
                            className="flex min-w-0 items-center gap-2"
                        >
                            <img
                                src={post.authorProfileImageUrl}
                                alt={`${post.authorName} profile`}
                                className="h-8 w-8 rounded-full object-cover ring-1 ring-indigo-100"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-black text-slate-700">
                                    {post.authorName}
                                </p>
                                <p className="text-[11px] font-bold text-slate-400">
                                    {post.authorRole === "STUDENT"
                                        ? "학생"
                                        : post.authorRole === "TEACHER"
                                            ? "강사"
                                            : "관리자"}
                                </p>
                            </div>
                        </Link>

                        <div className="flex-1" />

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                조회수 {post.viewCount}
                            </span>
                            <PostLikeBtn
                                postId={post.postId}
                                postLikeCount={post.likeCount}
                            />
                        </div>
                    </div>
                </header>

                {/* ==================== COMMUNITY_POST_CONTENT_COMPONENT_START ==================== */}
                {/* TODO: Extract this post content block later. */}
                <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex flex-col gap-5 py-5">
                        {post.contents.map((content, index) => {
                            if (content.type === "IMAGE") {
                                return (
                                    <div
                                        key={`${content.type}-${index}`}
                                        className="flex justify-center"
                                    >
                                        <img
                                            src={content.content}
                                            alt=""
                                            className="w-[40%] rounded-2xl object-cover shadow-sm ring-1 ring-slate-100"
                                        />
                                    </div>
                                );
                            }

                            return (
                                <p
                                    key={`${content.type}-${index}`}
                                    className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700"
                                >
                                    {content.content}
                                </p>
                            );
                        })}
                    </div>
                </div>
                {/* TODO: Extract this post content block later. */}
                {/* ===================== COMMUNITY_POST_CONTENT_COMPONENT_END ===================== */}
            </article>

            <PostDetailSide
                postId={post.postId}
                commentTotalCount={post.commentCount}
            />
        </section>
    );
}
