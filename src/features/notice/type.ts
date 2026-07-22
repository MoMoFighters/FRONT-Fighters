export interface Notice {
    noticeId: number;
    title: string;
    content?: string;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NoticeListResponse {
    items: Notice[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface CreateNoticeRequest {
    title: string;
    content: string;
    isPinned: boolean;
}

export interface UpdateNoticeRequest {
    title: string;
    content: string;
}