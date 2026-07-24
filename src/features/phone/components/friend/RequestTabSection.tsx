import RequestList from "@/features/phone/components/friend/RequestList";
import FriendSearchList from "@/features/phone/components/friend/FriendSearchList";

import {
    getReceivedFriendRequestsService,
    getSentFriendRequestsService,
} from "@/app/services/phone/friend/service";

interface RequestTabSectionProps {
    accessToken: string;
}

export default async function RequestTabSection({
    accessToken,
}: RequestTabSectionProps) {
    const [receivedResponse, sentResponse] = await Promise.all([
        getReceivedFriendRequestsService(accessToken),
        getSentFriendRequestsService(accessToken),
    ]);

    const received = receivedResponse.status === 200 ? receivedResponse.data ?? [] : [];
    const sent = sentResponse.status === 200 ? sentResponse.data ?? [] : [];

    return (
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
            <RequestList received={received} sent={sent} />
            <FriendSearchList />
        </div>
    );
}
