import type { MetadataRoute } from 'next';
import { getLectures } from '@/app/services/lecture/service';

const baseUrl = 'https://momocity.kro.kr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/lectures`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/membership`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/community`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
  ];

  try {
    // 1. 첫 페이지를 불러와서 전체 페이지 수를 확인한다
    const firstPage = await getLectures({ page: 1 });

    // 2. 나머지 페이지를 병렬로 불러온다
    const remainingPages = firstPage.totalPages > 1
      ? await Promise.all(
          Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
            getLectures({ page: index + 2 })
          )
        )
      : [];

    // 3. 공개(ACTIVE) 상태인 강의만 상세 페이지 URL로 등록한다
    const lectureEntries: MetadataRoute.Sitemap = [firstPage, ...remainingPages]
      .flatMap((page) => page.content)
      .filter((lecture) => lecture.lectureStatus === 'ACTIVE')
      .map((lecture) => ({
        url: `${baseUrl}/lectures/${lecture.lectureId}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    return [...staticEntries, ...lectureEntries];
  } catch {
    // 백엔드 조회에 실패해도 정적 페이지 사이트맵은 항상 제공한다
    return staticEntries;
  }
}
