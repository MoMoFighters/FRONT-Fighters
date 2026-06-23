import Link from "next/link";
import {
    ChevronLeft,
    Eye,
} from "lucide-react";
import Image from "next/image";
import momo from "@/app/assets/img/momo.png"
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";
import PostLikeBtn from "@/features/post/PostLikeBtn";
import PostDetailSide from "@/components/phone/community/PostDetailSide";

interface CommunityPostDetailPageProps {
    params: Promise<{
        id: string;
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
    title: "Today cooking class review",
    authorNickname: "PeachFrappe",
    content:
        "It was my first cooking class, so I was a little nervous. The instructor explained the ingredients and order step by step, which made it easy to follow. I want to try another class with a friend next time.",
    viewCount: 128,
    likeCount: 24,
    commentCount: 15,
};

const COMMUNITY_SIDE_POSTS: CommunitySidePost[] = [
    {
        id: 1,
        title: "Today cooking class review",
        authorNickname: "PeachFrappe",
        commentCount: 15,
        likeCount: 24,
    },
    {
        id: 2,
        title: "Beginner fitness routine question",
        authorNickname: "SweetSalt",
        commentCount: 6,
        likeCount: 18,
    },
    {
        id: 3,
        title: "Study method that helps focus",
        authorNickname: "StudyToday",
        commentCount: 9,
        likeCount: 12,
    },
    {
        id: 4,
        title: "Anyone want to practice drawing together?",
        authorNickname: "ArtKong",
        commentCount: 4,
        likeCount: 31,
    },
    {
        id: 5,
        title: "Sharing a small win today",
        authorNickname: "SunnyMember",
        commentCount: 11,
        likeCount: 42,
    },
    {
        id: 6,
        title: "Closet cleanup notes",
        authorNickname: "MyCity",
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
        authorNickname: "MomoStudent",
        content: "I was thinking about taking the same class. Thanks for the review.",
        createdAt: "2026.04.04 10:12",
    },
    {
        id: 2,
        lectureId: 1,
        postId: 1,
        parentId: 1,
        authorNickname: "PeachFrappe",
        content: "It was beginner friendly, so I recommend it.",
        createdAt: "2026.04.04 10:18",
    },
    {
        id: 3,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "ArtKong",
        content: "Do we need to prepare ingredients separately?",
        createdAt: "2026.04.04 10:41",
    },
    {
        id: 4,
        lectureId: 1,
        postId: 1,
        parentId: 3,
        authorNickname: "PeachFrappe",
        content: "The basic ingredient list was provided first, so it was easy.",
        createdAt: "2026.04.04 10:45",
    },
    {
        id: 5,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "CookBeginner",
        content: "Photos would make this even easier to follow.",
        createdAt: "2026.04.04 11:02",
    },
    {
        id: 6,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "MintChip",
        content: "I hope you share the final result next time.",
        createdAt: "2026.04.04 11:28",
    },
    {
        id: 7,
        lectureId: 1,
        postId: 1,
        parentId: 6,
        authorNickname: "CookieRun",
        content: "Same. Seeing the result would be helpful.",
        createdAt: "2026.04.04 11:35",
    },
    {
        id: 8,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "SweetSalt",
        content: "Was the instructor's pace too fast?",
        createdAt: "2026.04.04 12:10",
    },
    {
        id: 9,
        lectureId: 1,
        postId: 1,
        parentId: 8,
        authorNickname: "PeachFrappe",
        content: "It was fine. There was time to pause and follow along.",
        createdAt: "2026.04.04 12:16",
    },
    {
        id: 10,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "SunnyMember",
        content: "Your review helped me decide to take it.",
        createdAt: "2026.04.04 13:01",
    },
    {
        id: 11,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "StudyToday",
        content: "The cooking classes look more fun than I expected.",
        createdAt: "2026.04.04 13:22",
    },
    {
        id: 12,
        lectureId: 1,
        postId: 1,
        parentId: 11,
        authorNickname: "PeachFrappe",
        content: "It was more enjoyable because I could follow along directly.",
        createdAt: "2026.04.04 13:30",
    },
    {
        id: 13,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "SaltRain",
        content: "I should try a similar class next time.",
        createdAt: "2026.04.04 14:05",
    },
    {
        id: 14,
        lectureId: 1,
        postId: 1,
        parentId: null,
        authorNickname: "MyCity",
        content: "This made me curious too.",
        createdAt: "2026.04.04 14:42",
    },
    {
        id: 15,
        lectureId: 1,
        postId: 1,
        parentId: 14,
        authorNickname: "CookBeginner",
        content: "It sounds good from a beginner perspective.",
        createdAt: "2026.04.04 14:50",
    },
];
export default async function CommunityPostDetailPage({
    params,
}: CommunityPostDetailPageProps) {
    const { id } = await params;

    const post = {
        ...COMMUNITY_POST,
        id: Number(id) || COMMUNITY_POST.id,
    };

    return (
        <section className="grid h-full min-h-0 grid-cols-[7fr_3fr] gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <article className="flex min-h-0 flex-col rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
                <header className="shrink-0 border-b border-slate-100 pb-4">
                    <Link
                        href="/student/phone/community"
                        className="inline-flex items-center gap-1 text-xs font-black text-slate-400 transition hover:text-indigo-500"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        ?뚣끇???딅뼒
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
                        <CreateReportBtn triggerClassName="text-xs text-slate-500 font-bold py-1.5 px-3 rounded-md border border-slate-300 hover:bg-slate-100 cursor-pointer" />


                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            鈺곌퀬???{post.viewCount}
                        </span>
                        <PostLikeBtn postId={post.id} postLikeCount={post.likeCount} />
                    </div>
                </header>

                {/* 野껊슣?녷묾? ?꾩꼹?쀯㎘??怨몃열 */}
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

            <PostDetailSide
                post={post}
                sidePosts={COMMUNITY_SIDE_POSTS}
                comments={COMMUNITY_COMMENTS}
            />
        </section>
    );
}
