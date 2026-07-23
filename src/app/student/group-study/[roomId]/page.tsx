import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
    getGroupStudyDetailService,
    getSentStudyInviteListService,
} from "@/app/services/study/service";
import GroupStudyRankingPanel from "@/components/study/GroupStudyRankingPanel";
import GroupStudyRankingSkeleton from "@/components/study/GroupStudyRankingSkeleton";
import GroupStudyRoomView from "@/components/study/GroupStudyRoomView";
import { getMyInfo } from "@/features/user/action";

export default async function GroupStudyRoomPage({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;
    const numericRoomId = Number(roomId);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        redirect("/auth/login");
    }

    // 랭킹은 좌석/타이머 같은 핵심 화면과 무관한 보조 패널이라
    // 여기서 막아둘 필요 없이 Suspense로 따로 스트리밍한다 (아래 rankingPanel).
    const [myInfoResponse, detailResponse, sentInvitesResponse] = await Promise.all([
        getMyInfo(),
        getGroupStudyDetailService(numericRoomId),
        getSentStudyInviteListService(),
    ]);

    const myNickname = myInfoResponse.data?.nickname ?? null;

    if (!detailResponse.data) {
        redirect("/student/group-study");
    }

    const detail = detailResponse.data;
    const sentInvites = (sentInvitesResponse.data?.invitations ?? []).filter(
        (invite) => invite.roomId === numericRoomId
    );

    return (
        <GroupStudyRoomView
            roomId={numericRoomId}
            accessToken={accessToken}
            initialDetail={detail}
            myNickname={myNickname}
            rankingPanel={
                <Suspense fallback={<GroupStudyRankingSkeleton />}>
                    <GroupStudyRankingPanel roomId={numericRoomId} />
                </Suspense>
            }
            initialSentInvites={sentInvites}
        />
    );
}
