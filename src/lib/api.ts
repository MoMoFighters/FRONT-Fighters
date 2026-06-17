import { cookies } from "next/headers";

export interface ApiResponse<T> {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: T;
}

// fetch => 인증처리를 위한 fetch 개조

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {

    // 쿠키 accessToken 꺼내고
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    // Header 설정
    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers
    }

    // api 통신
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: headers,
        ...options
    });

    return response;
}