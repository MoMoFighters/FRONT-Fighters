import { Heart } from "lucide-react";

export default function PostLikeBtn({ postId, postLikeCount }: { postId: number; postLikeCount: number; }) {
    return (
        <button
            type="button"
            className="cursor-pointer flex shrink-0 items-center gap-1.5 rounded-md bg-rose-50 px-3 py-2 text-sm font-black text-rose-500 transition hover:bg-rose-100"
        >
            <Heart className="h-4 w-4 fill-current" />
            {postLikeCount}
        </button>
    );
}