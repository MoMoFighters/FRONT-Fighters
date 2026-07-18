import { NextRequest, NextResponse } from "next/server";

// 테스트용 라우트. 실제 백엔드 챗봇 API가 준비되면 이 파일은 제거하고
// useChatBotMessages 훅의 fetch 대상만 백엔드 엔드포인트로 교체하면 된다.
export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "메시지가 누락되었습니다." }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY가 설정되어 있지 않습니다." }, { status: 500 });
        }

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:streamGenerateContent?alt=sse&key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: `당신은 모모시티의 학습 도우미입니다. 항상 한국어로 대답하세요.\n\n${message}` },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!geminiResponse.ok) {
            return NextResponse.json({ error: "Gemini API 오류" }, { status: geminiResponse.status });
        }

        const stream = new ReadableStream({
            start: async (controller) => {
                const reader = geminiResponse.body?.getReader();
                const decoder = new TextDecoder();
                const encoder = new TextEncoder();

                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            controller.close();
                            break;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split("\n");

                        for (const line of lines) {
                            if (!line.startsWith("data: ")) continue;

                            const data = line.slice(6).trim();
                            if (!data) continue;

                            try {
                                const json = JSON.parse(data);
                                const content = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

                                if (content) {
                                    const sseData = `data: ${JSON.stringify({ content })}\n\n`;
                                    controller.enqueue(encoder.encode(sseData));
                                }
                            } catch {
                                // JSON 파싱 실패(빈 줄 등)는 무시
                            }
                        }
                    }
                } catch (error) {
                    controller.error(error);
                } finally {
                    reader.releaseLock();
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
