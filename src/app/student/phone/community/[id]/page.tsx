import Link from "next/link";
import {
    ChevronLeft,
    Eye,
    Flag,
    Heart,
    MessageCircle,
    Reply,
    X,
} from "lucide-react";
import Image from "next/image";
import momo from "@/app/assets/img/momo.png"

interface CommunityPostDetailPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        panel?: string;
    }>;
}

interface CommunityPostDetail {
    id: number;
    lectureId: number;
    title: string;
    authorNickname: string;
    content: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
}

interface CommunityComment {
    id: number;
    lectureId: number;
    postId: number;
    parentId: number | null;
    authorNickname: string;
    content: string;
    createdAt: string;
}

interface CommunitySidePost {
    id: number;
    title: string;
    authorNickname: string;
    commentCount: number;
    likeCount: number;
}

const COMMUNITY_POST: CommunityPostDetail = {
    id: 1,
    lectureId: 1,
    title: "오늘 요리 수업 후기",
    authorNickname: "복숭아라떼",
    content:
        "처음 듣는 요리 수업이라 살짝 긴장했는데 재료 설명부터 조리 순서까지 차근차근 알려줘서 좋았어요. 특히 중간중간 왜 그렇게 해야 하는지 이유를 설명해줘서 혼자 다시 따라 하기에도 편했습니다. 다음에는 친구랑 같이 들어보고 싶어요.",
    viewCount: 128,
    likeCount: 24,
    commentCount: 15,
};

const COMMUNITY_SIDE_POSTS: CommunitySidePost[] = [
    {
        id: 1,
        title: "오늘 요리 수업 후기",
        authorNickname: "복숭아라떼",
        commentCount: 15,
        likeCount: 24,
    },
    {
        id: 2,
        title: "헬스 초보 루틴 질문",
        authorNickname: "단짠단짠",
        commentCount: 6,
        likeCount: 18,
    },
    {
        id: 3,
        title: "집중 잘 되는 공부법",
        authorNickname: "오늘도공부",
        commentCount: 9,
        likeCount: 12,
    },
    {
        id: 4,
        title: "그림 연습 같이 할 사람",
        authorNickname: "도시산책",
        commentCount: 4,
        likeCount: 31,
    },
    {
        id: 5,
        title: "오늘의 작은 성공 공유",
        authorNickname: "새싹회원",
        commentCount: 11,
        likeCount: 42,
    },
    {
        id: 6,
        title: "옷장 정리하고 느낀 점",
        authorNickname: "마이시티",
        commentCount: 3,
        likeCount: 16,
    },
];

const COMMUNITY_COMMENTS: CommunityComment[] = [
    {
        id: 1,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "모모학생",
        content: "저도 이 수업 고민 중이었는데 후기 감사합니다.",
        createdAt: "2026.04.04 10:12",
    },
    {
        id: 2,
        lectureId: 1,
        postId: 1,
        parentId: 1,
        authorNickname: "복숭아라떼",
        content: "처음 듣기에도 부담 없어서 추천해요.",
        createdAt: "2026.04.04 10:18",
    },
    {
        id: 3,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "도시산책",
        content: "재료는 따로 준비해야 하나요?",
        createdAt: "2026.04.04 10:41",
    },
    {
        id: 4,
        lectureId: 1,
        postId: 1,
        parentId: 3,
        authorNickname: "복숭아라떼",
        content: "기본 재료 목록이 먼저 나와서 준비하기 쉬웠어요.",
        createdAt: "2026.04.04 10:45",
    },
    {
        id: 5,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "요리초보",
        content: "난이도 낮은 편이면 저도 들어봐야겠네요.",
        createdAt: "2026.04.04 11:02",
    },
    {
        id: 6,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "민트잎",
        content: "사진 정책 정해지면 완성샷도 같이 올라오면 좋겠어요.",
        createdAt: "2026.04.04 11:28",
    },
    {
        id: 7,
        lectureId: 1,
        postId: 1,
        parentId: 6,
        authorNickname: "쿠킹런",
        content: "맞아요. 결과물 보면 더 참고하기 좋을 듯합니다.",
        createdAt: "2026.04.04 11:35",
    },
    {
        id: 8,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "단짠단짠",
        content: "선생님 설명 속도가 빠르지는 않았나요?",
        createdAt: "2026.04.04 12:10",
    },
    {
        id: 9,
        lectureId: 1,
        postId: 1,
        parentId: 8,
        authorNickname: "복숭아라떼",
        content: "저는 적당했어요. 중간에 멈추고 따라갈 수도 있고요.",
        createdAt: "2026.04.04 12:16",
    },
    {
        id: 10,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "새싹회원",
        content: "후기 덕분에 수강 결정했습니다.",
        createdAt: "2026.04.04 13:01",
    },
    {
        id: 11,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "오늘도공부",
        content: "요리 쪽 강의가 생각보다 재밌어 보이네요.",
        createdAt: "2026.04.04 13:22",
    },
    {
        id: 12,
        lectureId: 1,
        postId: 1,
        parentId: 11,
        authorNickname: "복숭아라떼",
        content: "직접 따라 하니까 확실히 더 재밌더라고요.",
        createdAt: "2026.04.04 13:30",
    },
    {
        id: 13,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "소금빵",
        content: "다음에 비슷한 강의 들으면 저도 후기 남겨볼게요.",
        createdAt: "2026.04.04 14:05",
    },
    {
        id: 14,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "마이시티",
        content: "댓글 보니까 더 궁금해지네요.",
        createdAt: "2026.04.04 14:42",
    },
    {
        id: 15,
        lectureId: 1,
        postId: 1,
        parentId: 14,
        authorNickname: "요리초보",
        content: "초보자 입장에서도 괜찮아 보여서 저도 찜했습니다.",
        createdAt: "2026.04.04 14:50",
    },
];

export default async function CommunityPostDetailPage({
    params,
    searchParams,
}: CommunityPostDetailPageProps) {
    const { id } = await params;
    const { panel } = await searchParams;
    const isCommentPanelOpen = panel === "comments";

    const post = {
        ...COMMUNITY_POST,
        id: Number(id) || COMMUNITY_POST.id,
    };

    const parentComments = COMMUNITY_COMMENTS.filter(
        (comment) => comment.parentId === null
    );

    const getReplies = (commentId: number) =>
        COMMUNITY_COMMENTS.filter((comment) => comment.parentId === commentId);

    return (
        <section className="grid h-full min-h-0 grid-cols-[7fr_3fr] gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <article className="flex min-h-0 flex-col rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
                <header className="shrink-0 border-b border-slate-100 pb-4">
                    <Link
                        href="/student/phone/community"
                        className="inline-flex items-center gap-1 text-xs font-black text-slate-400 transition hover:text-indigo-500"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        커뮤니티
                    </Link>

                    <div className="mt-3 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="line-clamp-2 text-2xl font-black tracking-tight text-slate-900">
                                {post.title}
                            </h1>
                            <p className="mt-2 text-sm font-bold text-slate-500">
                                {post.authorNickname}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-1.5 rounded-full bg-rose-50 px-3 py-2 text-sm font-black text-rose-500 transition hover:bg-rose-100"
                        >
                            <Heart className="h-4 w-4 fill-current" />
                            {post.likeCount}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            조회 {post.viewCount}
                        </span>
                        c
                    </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <div className="py-5 flex flex-col">
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <div className="flex justify-center">
                            <Image src={momo} alt='' className="w-[40%]" />
                        </div>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <div className="flex justify-center">
                            <Image src={momo} alt='' className="w-[40%]" />
                        </div>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                        <p className="whitespace-pre-wrap text-4 font-medium leading-7 text-slate-700">
                            {post.content}
                        </p>
                    </div>
                </div>
            </article>

            <aside className="flex min-h-0 flex-col rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
                {isCommentPanelOpen ? (
                    <>
                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <h2 className="text-base font-black text-slate-900">
                                댓글 {post.commentCount}
                            </h2>
                            <Link
                                href={`/student/phone/community/${post.id}`}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-900 hover:text-white"
                                aria-label="댓글 목록 닫기"
                            >
                                <X className="h-4 w-4" />
                            </Link>
                        </div>

                        <button
                            type="button"
                            className="mb-3 shrink-0 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white transition hover:bg-indigo-500"
                        >
                            댓글 작성
                        </button>

                        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                            {/* ==================== COMMUNITY_COMMENT_COMPONENT_START ==================== */}
                            {/* TODO: 아래 댓글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                            {parentComments.map((comment) => {
                                const replies = getReplies(comment.id);

                                return (
                                    <div
                                        key={comment.id}
                                        className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-900">
                                                    {comment.authorNickname}
                                                </p>
                                                <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                                                    {comment.createdAt}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="flex shrink-0 items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-rose-500"
                                            >
                                                <Flag className="h-3.5 w-3.5" />
                                                신고
                                            </button>
                                        </div>

                                        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                                            {comment.content}
                                        </p>

                                        <button
                                            type="button"
                                            className="mt-3 flex items-center gap-1 text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                                        >
                                            <Reply className="h-3.5 w-3.5" />
                                            답글 달기
                                        </button>

                                        {replies.length > 0 && (
                                            <div className="mt-3 space-y-2 border-l-2 border-indigo-100 pl-3">
                                                {replies.map((reply) => (
                                                    <div
                                                        key={reply.id}
                                                        className="rounded-xl bg-slate-50 p-3"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-black text-slate-900">
                                                                    {
                                                                        reply.authorNickname
                                                                    }
                                                                </p>
                                                                <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                                                                    {
                                                                        reply.createdAt
                                                                    }
                                                                </p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-400 transition hover:text-rose-500"
                                                            >
                                                                <Flag className="h-3 w-3" />
                                                                신고
                                                            </button>
                                                        </div>

                                                        <p className="mt-2 text-xs font-medium leading-5 text-slate-600">
                                                            {reply.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {/* TODO: 위 댓글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                            {/* ===================== COMMUNITY_COMMENT_COMPONENT_END ===================== */}
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            href={`/student/phone/community/${post.id}?panel=comments`}
                            className="flex items-center gap-1 transition hover:text-indigo-500"
                        >
                            <div className="py-2 flex justify-center border border-black rounded-md mb-2 items-center w-full bg-indigo-200 hover:bg-indigo-300 gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <p>댓글 보기 {post.commentCount}</p>
                            </div>
                        </Link>

                        <div className="mb-4 flex shrink-0 items-center justify-between">
                            <h2 className="text-base font-black text-slate-900">
                                게시글 목록
                            </h2>
                            <Link
                                href="/student/phone/community"
                                className="text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                            >
                                전체보기
                            </Link>
                        </div>

                        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                            {/* ==================== COMMUNITY_SIDE_POST_COMPONENT_START ==================== */}
                            {/* TODO: 아래 사이드 게시글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                            {COMMUNITY_SIDE_POSTS.map((sidePost) => (
                                <Link
                                    key={sidePost.id}
                                    href={`/student/phone/community/${sidePost.id}`}
                                    className={`block rounded-2xl border p-3 transition hover:border-indigo-100 hover:bg-indigo-50/40 ${sidePost.id === post.id
                                        ? "border-indigo-200 bg-indigo-50"
                                        : "border-slate-100 bg-white"
                                        }`}
                                >
                                    <p className="line-clamp-2 text-sm font-black text-slate-900">
                                        {sidePost.title}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-slate-400">
                                        {sidePost.authorNickname}
                                    </p>
                                    <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Heart className="h-3 w-3" />
                                            {sidePost.likeCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="h-3 w-3" />
                                            {sidePost.commentCount}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {/* TODO: 위 사이드 게시글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                            {/* ===================== COMMUNITY_SIDE_POST_COMPONENT_END ===================== */}
                        </div>
                    </>
                )}
            </aside>
        </section>
    );
}
