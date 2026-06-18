import CommunityPostForm from "@/features/community/CommunityPostForm";

interface CommunityPostEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CommunityPostEditPage({
    params,
}: CommunityPostEditPageProps) {
    const { id } = await params;

    return (
        <div>
            <CommunityPostForm
                mode="EDIT"
                data={{ postId: id }}
            />
        </div>
    );
}
