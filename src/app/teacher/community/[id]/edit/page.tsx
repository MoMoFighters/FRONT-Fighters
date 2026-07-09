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
        <div>
            <CommunityPostForm
                mode="EDIT"
                data={response.data}
                role="TEACHER"
            />
        </div>
    );
}
