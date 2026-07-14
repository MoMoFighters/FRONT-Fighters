export interface GuestbookListItem {
    bookId: number;
    writerId: number;
    nickname: string;
    content: string;
    createdAt: string;
}

export interface CreateGuestbookResponse {
    bookId: number;
    ownerId: number;
    nickname: string;
    content: string;
    createdAt: string;
}
