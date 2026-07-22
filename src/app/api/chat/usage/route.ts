import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getChatbotUsageService } from "@/app/services/chatbot/service";

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    try {
        const usage = await getChatbotUsageService(accessToken);
        return NextResponse.json(usage);
    } catch {
        return NextResponse.json({ error: "사용량 조회에 실패했습니다." }, { status: 500 });
    }
}
