# Momocity Frontend System Guide

이 문서는 Momocity 프론트엔드 개발 기준을 팀 전체가 공유하기 위한 문서입니다.  
새 기능을 개발하거나 Codex 같은 AI 도구에게 작업을 맡길 때, 이 문서를 먼저 읽히고 아래 구조와 컨벤션을 따르도록 합니다.

## 1. 프로젝트 개요

- Framework: Next.js 16 App Router
- Language: TypeScript
- UI: Tailwind CSS v4, shadcn/ui, lucide-react
- State/cache: React Query
- Realtime: STOMP over native WebSocket
- Notification: sonner toast
- E2E: Playwright
- Dev server port: `4444`

주요 명령어:

```bash
npm run dev
npm run build
npm run analyze
npm run lint
npm run test:e2e
```

빌드는 현재 webpack 기반으로 고정합니다.

```bash
next build --webpack
```

## 2. 최상위 구조

```txt
src/
  app/          Next.js App Router 라우트, layout, page, error, loading
  app/services/서버 API 통신 함수
  components/   여러 도메인에서 공유하거나 화면 단위로 재사용되는 컴포넌트
  features/     도메인별 action, type, UI 컴포넌트
  lib/          공통 유틸, API wrapper, pagination, STOMP, provider
```

폴더 책임:

- `src/app`: 라우팅과 페이지 조립을 담당합니다.
- `src/app/services`: 백엔드 API를 직접 호출하는 service 함수만 둡니다.
- `src/features/{domain}`: 도메인별 server action, type, 해당 도메인 전용 컴포넌트를 둡니다.
- `src/components`: 여러 도메인에서 재사용하거나 화면의 큰 섹션을 구성하는 컴포넌트를 둡니다.
- `src/components/ui`: shadcn/ui 컴포넌트만 둡니다. 기능 로직을 넣지 않습니다.
- `src/lib`: 공통 API 유틸, pagination, STOMP, React Query provider 등 프레임워크성 코드를 둡니다.

## 3. 라우팅 구조

주요 라우트 그룹:

```txt
src/app/(guest)   비로그인, 로그인, 회원가입, OAuth
src/app/student   학생 도메인
src/app/teacher   강사 도메인
src/app/admin     관리자 도메인
```

페이지 작성 기준:

- `page.tsx`는 가능하면 서버 컴포넌트로 유지합니다.
- 데이터 초기 조회는 서버 컴포넌트에서 action/service를 호출해서 props로 내려주는 방식을 우선합니다.
- 사용자 상호작용, local state, WebSocket, React Query hook이 필요한 영역만 `"use client"` 컴포넌트로 분리합니다.
- 같은 기능이 student, teacher, admin에 모두 필요하면 공용 컴포넌트를 만들고 라우트별 href만 분기합니다.

## 4. API 계층 규칙

Momocity 프론트엔드 API 흐름은 기본적으로 아래 구조를 따릅니다.

```txt
Page or Client Component
  -> features/{domain}/action.ts
  -> app/services/{domain}/service.ts
  -> backend API
```

### 4.1 service 함수

위치:

```txt
src/app/services/{domain}/service.ts
```

역할:

- 백엔드 endpoint를 직접 호출합니다.
- `fetchWithAuth` 또는 직접 `fetch`를 사용합니다.
- response JSON을 파싱합니다.
- 백엔드 응답 타입을 최대한 그대로 반환합니다.
- 400번대 등 백엔드가 의도한 실패 응답은 가능하면 컴포넌트까지 전달합니다.
- 진짜 통신 실패, 예외 상황은 action에서 처리할 수 있도록 throw하거나 표준 실패 응답으로 감쌉니다.

공통 인증 fetch:

```ts
import { fetchWithAuth, type ApiResponse } from "@/lib/api";
```

`fetchWithAuth` 특징:

- 쿠키의 `accessToken`을 읽어서 `Authorization: Bearer {token}`을 붙입니다.
- 기본 `Content-Type: application/json`을 붙입니다.
- ngrok 사용 시 경고 페이지를 피하기 위해 `ngrok-skip-browser-warning: true`를 붙입니다.

주의:

- `FormData` 업로드에는 `Content-Type`을 수동 지정하지 않습니다.
- 대용량 업로드 진행률이 필요하면 axios를 사용합니다.
- 서버 주소는 `NEXT_PUBLIC_API_BASE_URL`을 기준으로 합니다.

### 4.2 action 함수

위치:

```txt
src/features/{domain}/action.ts
```

역할:

- `"use server"`를 선언합니다.
- service 함수를 호출합니다.
- 쿠키 접근, redirect, revalidatePath, 에러 응답 생성 등 서버 액션 책임을 처리합니다.
- 클라이언트에서 호출해도 화면이 터지지 않도록 가능하면 `ApiResponse<T>` 형태로 반환합니다.

기본 형태:

```ts
"use server";

export const someAction = async (): Promise<ApiResponse<SomeData>> => {
    try {
        return await someService();
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "SOME-ACTION-FAILED",
            message:
                error instanceof Error
                    ? error.message
                    : "알 수 없는 문제가 발생했습니다.",
        };
    }
};
```

### 4.3 타입 정의

위치:

```txt
src/features/{domain}/type.ts
```

원칙:

- 백엔드 응답 DTO 기준으로 타입을 만듭니다.
- 공통 응답은 `ApiResponse<T>`를 사용합니다.
- 컴포넌트 전용 가공 타입은 같은 파일 안에 두되, API 응답 타입과 이름을 구분합니다.

예:

```ts
export interface SomeData {
    id: number;
    name: string;
}

export type SomeResponse = ApiResponse<SomeData>;
```

## 5. 공통 응답 처리

공통 응답 타입:

```ts
export interface ApiResponse<T> {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: T | null;
}
```

백엔드 응답에 `statusCode`가 섞여 들어오는 API가 있을 수 있습니다.  
이 경우 service에서 `status`로 정규화합니다.

```ts
if (typeof result.status !== "number" && typeof result.statusCode === "number") {
    result.status = result.statusCode;
}
```

화면에서는 보통 아래처럼 처리합니다.

```ts
if (response.status >= 400) {
    toast.error(response.message);
    return;
}
```

## 6. 인증과 쿠키

사용 토큰:

- `accessToken`
- `refreshToken`

저장 위치:

- HTTP only cookie

주요 처리 위치:

- 로그인, OAuth 로그인: `src/features/auth/action.ts`
- 공통 인증 fetch: `src/lib/api.ts`
- 내 정보 조회: `src/features/user/action.ts`

닉네임 미설정 처리:

- 로그인 성공 응답의 `nickname`이 `null`이면 `/student/mypage`로 이동합니다.
- 마이페이지에서 다시 내 정보를 조회하고, `nickname`이 `null`이면 닉네임 입력 모달을 띄웁니다.
- layout/header에서 nickname redirect 검사를 반복하지 않습니다.

## 7. 환경 변수

대표 환경 변수:

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_STOMP_URL=

KAKAO_CLIENT_ID=
KAKAO_REDIRECT_URI=

GOOGLE_CLIENT_ID=
GOOGLE_REDIRECT_URI=

NAVER_CLIENT_ID=
NAVER_REDIRECT_URI=

JAVASCRIPT_KEY=
```

규칙:

- 브라우저에서 직접 읽어야 하는 값만 `NEXT_PUBLIC_`을 붙입니다.
- OAuth client id, redirect uri는 서버 route에서만 쓰는 경우 `NEXT_PUBLIC_`을 붙이지 않습니다.
- 배포 환경에서 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`을 사용하면 안 됩니다.
- ngrok을 사용할 경우 Vercel env에는 ngrok HTTPS 주소를 넣습니다.

예:

```env
NEXT_PUBLIC_API_BASE_URL=https://example.ngrok-free.dev
NEXT_PUBLIC_STOMP_URL=wss://example.ngrok-free.dev/ws-chat
```

## 8. STOMP WebSocket 규칙

공통 STOMP 클라이언트:

```txt
src/lib/stomp/stomp.ts
```

현재 방식:

- native WebSocket 사용
- SockJS 사용하지 않음
- `NEXT_PUBLIC_STOMP_URL` 우선 사용
- URL에 token query를 붙임
- STOMP `connectHeaders`에도 Authorization을 붙임
- 하나의 shared client를 reference count 방식으로 공유

구독 예:

```ts
const client = connectNoticeStomp({
    accessToken,
    onConnect: (stompClient) => {
        subscription = stompClient.subscribe(
            "/user/sub/notice/app-counts",
            (body) => {
                const data = JSON.parse(body);
            }
        );
    },
});

return () => {
    subscription?.unsubscribe();
    client.disconnect();
};
```

반드시 지킬 것:

- 컴포넌트 unmount 시 `subscription.unsubscribe()`를 호출합니다.
- 이어서 `client.disconnect()`를 호출합니다.
- SockJS 전용 `/info` 요청에 의존하지 않습니다.
- HTTPS 배포 환경에서는 `wss://`를 사용합니다.
- `http://`는 `ws://`, `https://`는 `wss://`로 변환됩니다.

주요 구독 경로:

```txt
/user/sub/notice/total-counts
/user/sub/notice/app-counts
/user/sub/notice/list
/user/sub/chat/rooms
/user/sub/chat/room/{roomId}
```

## 9. React Query 사용 기준

Provider:

```txt
src/components/common/ReactQueryProvider.tsx
```

기본 설정:

```ts
staleTime: 10분
gcTime: 30분
refetchOnMount: false
refetchOnWindowFocus: false
```

사용 기준:

- 반복 조회, 캐싱 이점이 있는 클라이언트 상호작용에 사용합니다.
- 캘린더 월별/일별 조회처럼 같은 데이터를 다시 보는 화면에 적합합니다.
- 서버 컴포넌트 초기 조회를 무조건 React Query로 바꾸지 않습니다.
- query key는 별도 파일로 분리하는 것을 권장합니다.

예:

```ts
export const getCalendarDailyQueryKey = (date: string) => [
    "calendar",
    "daily",
    date,
];
```

mutation 후에는 관련 query를 invalidate하거나, 필요한 경우 optimistic update를 사용합니다.

## 10. UI 컴포넌트 규칙

### 10.1 shadcn/ui

공통 UI는 `src/components/ui`의 shadcn 컴포넌트를 사용합니다.

주요 컴포넌트:

- `Button`
- `Dialog`
- `AlertDialog`
- `DropdownMenu`
- `Pagination`
- `Select`
- `Tooltip`
- `HoverCard`

새 UI가 필요하면 기존 shadcn 스타일을 우선 재사용합니다.

### 10.2 아이콘

아이콘은 기본적으로 `lucide-react`를 사용합니다.

```ts
import { Search, X } from "lucide-react";
```

### 10.3 toast

사용자 피드백은 `sonner`를 사용합니다.

```ts
import { toast } from "sonner";

toast.success("처리되었습니다.");
toast.error(response.message);
```

### 10.4 Pagination

페이지네이션은 shadcn pagination과 `getVisiblePageNumbers`를 사용합니다.

```ts
import { getVisiblePageNumbers } from "@/lib/pagination";
```

특징:

- 최대 5개 페이지 번호 표시
- 현재 페이지가 가능한 가운데에 오도록 계산
- 예: 현재 페이지가 4이면 `2 3 4 5 6`

기존 공용 컴포넌트:

```txt
src/components/common/ListPagination.tsx
```

## 11. 이미지 사용 기준

일반적으로는 Next.js `Image`를 사용합니다.

```ts
import Image from "next/image";
```

외부 이미지 도메인은 `next.config.ts`의 `images.remotePatterns`에 등록합니다.

현재 등록된 대표 도메인:

- `momocity-bucket.s3.ap-northeast-2.amazonaws.com`
- `picsum.photos`
- `placehold.co`
- `d1w7ptjpsyo7f4.cloudfront.net`

주의:

- 성능 비교나 의도적 비최적화 실험이 아니라면 일반 `<img>`로 바꾸지 않습니다.
- `<img>` 사용 시 Next lint가 LCP/대역폭 경고를 냅니다.

## 12. 도메인별 개발 위치

### Auth

```txt
src/features/auth
src/app/services/auth/service.ts
src/app/(guest)
```

담당:

- 로그인
- 회원가입
- OAuth
- 비밀번호 변경
- 닉네임 입력
- 강사 신청 모달

### User / MyPage

```txt
src/features/user
src/app/services/user/service.ts
src/components/mypage
src/app/student/mypage
```

담당:

- 내 정보 조회/수정
- 프로필 아이템 적용
- 닉네임 검사
- 회원 상태 처리

### Point

```txt
src/features/point
src/app/services/point/service.ts
src/app/student/point-store
src/app/student/mypage/point
```

담당:

- 포인트 상점 목록
- 보유 프로필 아이템
- 포인트 구매
- 포인트 내역

프로필 변경은 내 정보 수정 API에 `itemName`만 넘기는 방식입니다.

### Community

```txt
src/features/community
src/app/services/community/service.ts
src/components/phone/community
src/app/student/phone/community
src/app/teacher/community
src/app/admin/community
```

담당:

- 게시글 목록/검색
- 게시글 상세
- 댓글/답글
- 좋아요
- 커뮤니티 프로필
- 추천 게시글

댓글/답글은 cursor 기반 API를 사용합니다.

### Chat / Friend

```txt
src/features/chat
src/features/friend
src/app/services/phone/chat/service.ts
src/app/services/phone/friend/service.ts
src/components/common/ChatRoom*
src/features/phone/components/friend
```

담당:

- 친구 목록
- 친구 요청
- 채팅방 목록
- 채팅방 상세
- 메시지 전송
- STOMP 실시간 갱신

채팅방 구분:

- `roomTitle`이 있으면 단체톡
- `roomTitle`이 없으면 1:1톡
- 전체 채팅방 중 `roomId`가 가장 작은 방은 나와의 채팅

### Calendar

```txt
src/features/calendar
src/app/services/phone/calendar/service.ts
src/components/phone/calendar
src/features/phone/components/todo
```

담당:

- 월별 캘린더
- 일별 Todo/Memo
- Todo 체크
- React Query 캐싱

### Lecture

```txt
src/features/lecture
src/app/services/lecture
src/app/services/lecture/create
src/app/student/lectures
src/app/teacher/lectures
```

담당:

- 강의 목록/상세
- 강의 등록
- 챕터 등록
- 영상 업로드
- 수강 진도

대용량 업로드 진행률은 axios 기반 서비스에서 처리합니다.

### Notification

```txt
src/features/user/components/notification
src/app/services/notification/service.ts
src/components/city/Phone.tsx
```

담당:

- 종 알림 개수
- 알림 목록
- 폰 앱별 알림 개수
- 알림 읽음/삭제
- STOMP 실시간 갱신

### Admin

```txt
src/app/admin
src/features/admin
src/app/services/admin-dashboard
src/app/services/access-log
src/app/services/manage
```

담당:

- 관리자 대시보드
- 회원 관리
- 신고 관리
- 공지 관리
- 접근 로그

## 13. 에러 처리 기준

프론트에서 지켜야 할 방향:

- API 실패 응답의 `message`를 우선 사용자에게 보여줍니다.
- 400번대 도메인 실패는 백엔드 응답을 그대로 화면까지 전달하는 방식을 선호합니다.
- 500번대 또는 예외는 `알 수 없는 문제가 발생했습니다.` 계열 fallback을 사용합니다.
- 서버 액션에서 에러가 throw되어 Next production digest로 숨겨지지 않게, 가능하면 action에서 `ApiResponse` 형태로 감쌉니다.

예:

```ts
try {
    return await service();
} catch (error) {
    return {
        timestamp: new Date().toISOString(),
        status: 500,
        code: "CLIENT-ACTION-ERROR",
        message: error instanceof Error
            ? error.message
            : "알 수 없는 문제가 발생했습니다.",
    };
}
```

## 14. 서버 컴포넌트와 클라이언트 컴포넌트 기준

서버 컴포넌트로 둘 것:

- 페이지 초기 데이터 조회
- 쿠키 기반 인증 확인
- redirect
- 정적 레이아웃 조립

클라이언트 컴포넌트로 분리할 것:

- `useState`, `useEffect`, `useMemo`
- 입력값 관리
- modal open/close
- toast
- STOMP 구독
- React Query hook
- 브라우저 API 사용

클라이언트 컴포넌트에 서버 함수나 콜백을 직접 prop으로 넘기지 않습니다.  
필요하면 server action을 import해서 호출하거나, 클라이언트 handler 내부에서 action을 호출합니다.

## 15. FormData / 업로드 규칙

FormData 사용 시:

- `Content-Type: multipart/form-data`를 직접 넣지 않습니다.
- 브라우저/axios/fetch가 boundary를 자동 설정하게 둡니다.
- 파일 input이 hidden이고 required일 때, 브라우저 focus 에러가 날 수 있으므로 required 처리에 주의합니다.

강의 등록 흐름:

```txt
1. 강의 기본 정보 등록
2. lectureId 기반 챕터 등록
3. chapterId 기반 영상 등록
```

업로드 상태:

- 강의 업로드 현황은 context에서 관리합니다.
- 완료/실패 상태는 localStorage에 저장할 수 있습니다.
- 영상/썸네일 파일 자체는 localStorage에 저장하지 않습니다.

## 16. 코드 스타일

TypeScript:

- `strict: true`
- API 응답 타입은 명시합니다.
- `any`는 가능한 피합니다.
- union type으로 백엔드 enum 값을 표현합니다.

Import:

- 절대 경로 alias `@/`를 사용합니다.
- 같은 도메인의 type/action/service는 기존 위치를 우선 사용합니다.

컴포넌트:

- props interface를 컴포넌트 상단에 둡니다.
- 복잡한 가공 로직은 컴포넌트 바깥 함수로 분리합니다.
- 화면 상태 이름은 `isLoading`, `isPending`, `isModal`, `selectedItem`처럼 의미가 드러나게 작성합니다.

조건부 렌더링:

- 에러, 빈 상태, 로딩 상태를 명확히 분리합니다.
- 빈 배열은 반드시 빈 상태 UI를 둡니다.

## 17. 배포 기준

Vercel 배포:

- Build Command: `npm run build`
- package script 내부에서 `next build --webpack` 사용
- env 변경 후 반드시 redeploy 필요

주의:

- `.next`, `.npm-cache`, `node_modules`는 배포 소스에 포함하지 않습니다.
- 배포 서버에서 `localhost`는 사용자 PC가 아니라 Vercel 자신입니다.
- 로컬 백엔드를 임시로 배포 프론트와 연결하려면 ngrok HTTPS 주소를 사용합니다.

ngrok 사용 시:

```env
NEXT_PUBLIC_API_BASE_URL=https://{ngrok-domain}
NEXT_PUBLIC_STOMP_URL=wss://{ngrok-domain}/ws-chat
```

## 18. 작업 전 체크리스트

새 API를 연결할 때:

1. `features/{domain}/type.ts`에 요청/응답 타입을 만든다.
2. `app/services/{domain}/service.ts`에 service 함수를 만든다.
3. `features/{domain}/action.ts`에 action 함수를 만든다.
4. page 또는 client component에서 action을 호출한다.
5. 400번대 응답과 빈 데이터 상태를 화면에서 처리한다.
6. 필요한 경우 `revalidatePath` 또는 React Query invalidation을 추가한다.
7. `npx tsc --noEmit --pretty false`로 타입 확인한다.
8. 관련 파일만 `npx eslint`로 확인한다.

새 UI를 만들 때:

1. 기존 도메인 컴포넌트에서 비슷한 UI를 찾는다.
2. shadcn/ui와 lucide-react를 우선 사용한다.
3. 기존 색상/간격/rounded 스타일을 맞춘다.
4. 로딩/빈 상태/에러 상태를 포함한다.

실시간 기능을 만들 때:

1. HTTP 초기 조회를 먼저 만든다.
2. STOMP 구독으로 실시간 갱신만 담당하게 한다.
3. 구독 해제를 반드시 작성한다.
4. HTTP 재조회와 WebSocket 수신이 중복 호출되지 않게 한다.
5. 읽음 처리 같은 부수 효과는 중복 호출 방지 로직을 둔다.

## 19. AI 개발 지시용 요약

Codex 또는 다른 AI에게 이 프로젝트 작업을 맡길 때는 아래 원칙을 우선 적용시킵니다.

- Next.js App Router 구조를 유지한다.
- API 직접 호출은 `src/app/services/{domain}/service.ts`에 둔다.
- 서버 액션은 `src/features/{domain}/action.ts`에 둔다.
- API 타입은 `src/features/{domain}/type.ts`에 둔다.
- 공통 인증 요청은 `fetchWithAuth`를 우선 사용한다.
- 클라이언트 상태가 필요한 컴포넌트만 `"use client"`로 만든다.
- shadcn/ui와 lucide-react를 우선 사용한다.
- 기존 디자인을 임의로 바꾸지 않는다.
- 요청받은 파일/도메인 외의 관련 없는 파일은 건드리지 않는다.
- 400번대 API 응답은 가능하면 그대로 화면까지 전달한다.
- 500번대와 예외는 안전한 fallback 응답으로 감싼다.
- WebSocket은 `connectNoticeStomp`를 사용하고 unmount 시 unsubscribe/disconnect 한다.
- 페이지네이션은 `getVisiblePageNumbers`와 shadcn `Pagination`을 사용한다.
- 작업 후 TypeScript와 관련 파일 ESLint를 확인한다.
