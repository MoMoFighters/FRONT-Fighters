import { ApiResponse } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const getOnboardingUsers = async ()
    : Promise<ApiResponse<number>> => {
    const response = await fetch(`${BASE_URL}/api/v1/user/onboarding`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    if (!response.ok) {
        throw new Error("500|알 수 없는 문제가 발생했습니다.")
    }
    return response.json();
}

interface OnboardingLectureResponse {
    lectureCount: number,
    averageRating: number
}

export const getOnboardingLectures = async ()
    : Promise<ApiResponse<OnboardingLectureResponse>> => {
    const response = await fetch(`${BASE_URL}/api/v1/lectures/onboarding`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    if (!response.ok) {
        throw new Error("500|알 수 없는 문제가 발생했습니다.")
    }
    return response.json();
}