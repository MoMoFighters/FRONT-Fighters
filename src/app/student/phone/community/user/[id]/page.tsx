export default async function CommunityUserHome({ params }: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    return (
        <div>커뮤니티 다른 유저{id}의 마이페이지</div>
    );
}