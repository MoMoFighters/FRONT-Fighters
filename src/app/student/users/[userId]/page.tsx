interface FriendCityPageProps {
    params: Promise<{
        userId: string;
    }>;
}

export default async function FriendCity({ params }: FriendCityPageProps) {
    await params;

    return (
        <div>친구의 도시</div>
    );
}
