import CommunityPostForm from "@/features/community/CommunityPostForm";
import { getCommunityPostDetailAction } from "@/features/community/action";
import { notFound } from "next/navigation";

interface CommunityPostEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CommunityPostEditPage({
    params,
}: CommunityPostEditPageProps) {
    const { id } = await params;
    const postId = Number(id);

    if (!Number.isFinite(postId)) {
        notFound();
    }

    const response =
        await getCommunityPostDetailAction(postId);

    if (!response.data) {
        notFound();
    }

    return (
        <div className="flex min-h-[calc(100vh-137px)] flex-col bg-white">
            <div className="mx-auto flex w-full max-w-360 flex-col px-4 py-8 md:px-12 md:py-12">
                <CommunityPostForm
                    mode="EDIT"
                    data={response.data}
                    role="TEACHER"
                />
            </div>
        </div>
    );
}
