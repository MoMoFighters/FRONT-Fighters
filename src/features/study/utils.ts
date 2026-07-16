import { jwtDecode } from "jwt-decode";

import type { GroupStudyDetail, StudyRoomSeatUser } from "./type";

export const formatStudyTime = (totalSeconds: number) => {
    const safeSeconds = Math.max(totalSeconds, 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = Math.floor(safeSeconds % 60);

    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// 진행 중인(endedAt이 null인) 랩은 seconds도 null로 내려오므로 별도 표기
export const formatLapSeconds = (seconds: number | null) =>
    seconds === null ? "진행 중" : formatStudyTime(seconds);

interface StudyAccessTokenPayload {
    nickname?: string;
}

// 나인지 아닌지 구분: accessToken을 디코드해서 nickname 클레임을 꺼내온다.
export const getNicknameFromAccessToken = (accessToken?: string | null): string | null => {
    if (!accessToken) {
        return null;
    }

    try {
        const decoded = jwtDecode<StudyAccessTokenPayload>(accessToken);
        return decoded.nickname ?? null;
    } catch {
        return null;
    }
};

// 그룹방 상세 정보의 멤버 목록을, 좌석(방장 고정 좌상단) 형태로 가공한다.
// 자리가 비어 있으면 undefined로 채워서 항상 maxMember 길이의 배열을 반환한다.
export const buildRoomSeats = (
    detail: GroupStudyDetail,
    myNickname: string | null
): (StudyRoomSeatUser | undefined)[] => {
    const seats: (StudyRoomSeatUser | undefined)[] = detail.members
        .map((member) => ({
            ...member,
            isHost: member.nickname === detail.hostNickname,
            isMe: member.nickname === myNickname,
        }))
        .sort((a, b) => Number(b?.isHost) - Number(a?.isHost));

    while (seats.length < detail.maxMember) {
        seats.push(undefined);
    }

    return seats.slice(0, detail.maxMember);
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환 (일별 통계 조회용)
export const getTodayDateString = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");
    const day = String(baseDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// 이번 달을 YYYY-MM 형식으로 반환 (월별 통계 조회용)
export const getThisYearMonthString = (baseDate: Date) => {
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
};
