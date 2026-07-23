import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
    try {
        const { message, lectureId } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "메시지가 누락되었습니다." }, { status: 400 });
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
        }

        const params = new URLSearchParams({ token: accessToken, question: message });
        if (lectureId) {
            params.set("lectureId", String(lectureId));
        }

        const requestUrl = `${BASE_URL}/api/v1/chatbot/questions/stream?${params.toString()}`;

        const backendResponse = await fetch(requestUrl, {
            headers: { Accept: "text/event-stream" },
            cache: "no-store"
        });

        if (!backendResponse.ok || !backendResponse.body) {
            const errorBody = await backendResponse.json().catch(() => null);

            // 진단용 임시 로그 - 원인 파악 후 제거 예정
            console.error("[chatbot-stream] 백엔드 응답 실패:", {
                status: backendResponse.status,
                errorBody,
            });

            return NextResponse.json(
                {
                    error: errorBody?.message ?? "챗봇 서버 오류가 발생했습니다.",
                    code: errorBody?.code,
                },
                { status: backendResponse.status }
            );
        }

        const stream = new ReadableStream({
            async start(controller) {
                const reader = backendResponse.body!.getReader();

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        controller.enqueue(value);
                    }
                } catch {
                    // 백엔드 연결이 스트리밍 도중 끊겼을 때, 브라우저에 raw 네트워크 에러 대신 정상 SSE 에러 이벤트로 전달
                    const errorEvent = `data: ${JSON.stringify({ type: "error", content: "답변을 받아오는 중 연결이 끊겼어요. 다시 시도해주세요." })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(errorEvent));
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch {
        return NextResponse.json({ error: "서버 측에 오류가 발생하였습니다." }, { status: 500 });
    }
}
