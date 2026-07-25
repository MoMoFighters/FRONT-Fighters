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
        // 모바일(lg 미만)에서는 받은요청/보낸요청/친구검색을 한 화면 세로 스크롤로 쌓아서 보여주고,
        // lg 이상에서는 기존처럼 2열로 나눠 각 열이 독립적으로 스크롤되게 유지한다.
        // absolute+inset-0로 스크롤 영역의 높이를 부모 박스에 직접 고정시켜서(중첩 flex-grow 계산에
        // 기대지 않음), 콘텐츠가 넘칠 때 확실하게 스크롤되게 한다.
        <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0 flex flex-col overflow-y-auto scrollbar-none lg:grid lg:grid-cols-2 lg:overflow-hidden">
                <RequestList received={received} sent={sent} />
                <FriendSearchList />
            </div>
        </div>
    );
}
