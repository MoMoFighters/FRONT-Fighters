export interface ScheduleItem {
    id: number;

    userId: number;

    start: string;

    end: string | null;

    title: string;

    category: 'todo' | 'memo';

    isCompleted: boolean;

    createdAt: string;
}

export interface CalendarTodo {
    calendarId: number;
    userId?: number;
    title: string;
    category: 'TODO';
    start: string;
    end?: string;
    isCompleted: boolean;
    createdAt?: string;
}

export interface CalendarMemo {
    calendarId: number;
    title: string;
    category: 'MEMO';
    start: string;
    end: string;
}

export interface GetTodoListData {
    startDate: string;
    endDate: string;

    todos: CalendarTodo[];
    memos: CalendarMemo[];
}

export interface GetTodoListResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;

    data?: {
        data: GetTodoListData;
    };
}

export interface GetTodoListRequest {
    date: string;
    accessToken: string;
}

export interface GetCalendarSchedulesActionProps {
    date: string;
}

export interface CreateTodoProps {
    title: string;
    start: string;
    accessToken: string;
}


export interface CreateTodoResponse {
    timestamp: string;

    status: number;

    code: string;

    message: string;

    data?: {
        calendarId: number;

        title: string;

        category: 'TODO';

        start: string;

        isCompleted: boolean;
    };
}