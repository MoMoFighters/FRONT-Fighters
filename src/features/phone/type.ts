export interface ScheduleItem {

    calendarId: number;
    title: string;
    category: "TODO" | "MEMO";
    start: string;
    end?: string;
    isCompleted?: boolean;
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

    data: GetTodoListData;
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

export interface CreateTodoActionState {
    success: boolean;

    message: string;
}

export interface DeleteTodoRequest {
    calendarId: number;
    accessToken: string;
}


export interface DeleteTodoResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
}

export interface EditTodoRequest {
    calendarId: number;
    accessToken: string;
    title: string;
    start: string;
}

export interface EditTodoResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: ScheduleItem;
}

export interface CheckTodoRequest {
    calendarId: number;
    accessToken: string;
    isCompleted: boolean;
}

export interface CheckTodoResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: ScheduleItem;
}