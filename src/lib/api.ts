'use server'
import { cookies } from "next/headers";

export interface ApiResponse<T> {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: T | null;
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
        'ngrok-skip-browser-warning': 'true',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers
    }

    // api 통신
    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: headers,
            ...options
        });
    } catch (err) {
        console.error(
            `[fetchWithAuth] ${options.method ?? 'GET'} ${endpoint} -> network error`,
            err instanceof Error ? err.message : err
        );
        throw err;
    }

    // 300 이상 응답은 promtail이 수집할 수 있도록 콘솔에 기록
    if (response.status >= 300) {
        const body = await response.clone().text();
        console.error(
            `[fetchWithAuth] ${options.method ?? 'GET'} ${endpoint} -> ${response.status}`,
            body
        );
    }

    return response;
}
