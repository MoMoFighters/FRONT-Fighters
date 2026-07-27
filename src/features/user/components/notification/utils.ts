import type { NoticeNotification } from "./type";

const FRIEND_ACCEPTED_MESSAGE = "친구가 되었습니다";

// 친구 요청 알림 중 "수락되어 친구가 됐다"는 알림은 안 읽었어도 배지/진동 트리거에서 제외한다.
// (요청이 아니라 결과 통보라 굳이 확인을 강제할 필요가 없다는 기획 의도)
export const isFriendAcceptedNotification = (
    notification: Pick<NoticeNotification, "type" | "message">
): boolean =>
    notification.type === "FRIEND_REQUEST" &&
    notification.message === FRIEND_ACCEPTED_MESSAGE;
