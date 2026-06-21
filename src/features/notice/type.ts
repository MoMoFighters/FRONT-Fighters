export interface AdminNotice {
    noticeId: number;
    title: string;
    createdAt: string;
    viewCount: number;
}

export interface AdminNoticeDetail extends AdminNotice {
    content: string[];
}
