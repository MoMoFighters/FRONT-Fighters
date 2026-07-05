import type { Metadata } from "next";

import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { LectureDetailResponse } from "./type";

const SERVICE_NAME = "모모시티";
const DEFAULT_DESCRIPTION =
    "모모시티는 학습과 활동을 도시 성장으로 연결해 재미있게 배울 수 있는 온라인 학습 플랫폼입니다.";
const DEFAULT_OG_IMAGE = "/images/og-image.png";

const getLectureForMetadata = async (
    lectureId: string
): Promise<LectureDetailResponse | null> => {
    try {
        const response = await fetchWithAuth(`/api/v1/lectures/${lectureId}`);

        if (response.status === 401 || response.status === 403 || response.status === 404) {
            return null;
        }

        if (!response.ok) {
            return null;
        }

        const result: ApiResponse<LectureDetailResponse> = await response.json();

        return result.data ?? null;
    } catch {
        return null;
    }
};

export const generateLectureDetailMetadata = async ({
    lectureId,
    pathname,
}: {
    lectureId: string;
    pathname: string;
}): Promise<Metadata> => {
    const lecture = await getLectureForMetadata(lectureId);

    if (!lecture) {
        return {
            title: "강의 상세",
            description: DEFAULT_DESCRIPTION,
            alternates: {
                canonical: pathname,
            },
            openGraph: {
                type: "website",
                locale: "ko_KR",
                url: pathname,
                siteName: SERVICE_NAME,
                title: SERVICE_NAME,
                description: DEFAULT_DESCRIPTION,
                images: [
                    {
                        url: DEFAULT_OG_IMAGE,
                        width: 1200,
                        height: 630,
                        alt: `${SERVICE_NAME} 공유 이미지`,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: SERVICE_NAME,
                description: DEFAULT_DESCRIPTION,
                images: [DEFAULT_OG_IMAGE],
                creator: "@momocity",
            },
        };
    }

    const title = `${lecture.title}`;
    const description = lecture.description || DEFAULT_DESCRIPTION;
    const imageUrl = lecture.thumbnailUrl || DEFAULT_OG_IMAGE;

    return {
        title,
        description,
        alternates: {
            canonical: pathname,
        },
        openGraph: {
            type: "website",
            locale: "ko_KR",
            url: pathname,
            siteName: SERVICE_NAME,
            title: `${title} | ${SERVICE_NAME}`,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${title} 강의 썸네일`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | ${SERVICE_NAME}`,
            description,
            images: [imageUrl],
            creator: "@momocity",
        },
    };
};
