📚 MOMOCITY
---
📁 파일 구조
```bash
[src]
├── [app]                         # Next.js App Router
│   ├── (guest)                   # 비회원 영역
│   │   ├── auth
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── oauth
│   │   │   ├── google/callback/page.tsx
│   │   │   └── kakao/callback/page.tsx
│   │   ├── error/page.tsx
│   │   └── page.tsx              # 소개 페이지
│   │
│   ├── student                   # 수강생 영역
│   │   ├── lectures
│   │   ├── community
│   │   ├── payments
│   │   ├── phone
│   │   ├── users
│   │   └── mypage
│   │
│   ├── teacher                   # 강사 영역
│   │   ├── lectures
│   │   ├── community
│   │   └── ask
│   │
│   ├── admin                     # 관리자 영역
│   │   ├── users
│   │   ├── lectures
│   │   └── sales
│   │
│   ├── assets
│   │   ├── img
│   │   └── style
│   │
│   ├── layout.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── [components]                  # 공통 UI 컴포넌트
│   ├── common
│   │   ├── LectureItem.tsx
│   │   ├── ReviewItem.tsx
│   │   ├── ChatItem.tsx
│   │   └── ChapterItem.tsx
│   │
│   ├── layout
│   │   ├── GuestHeader.tsx
│   │   ├── AuthHeader.tsx
│   │   ├── StudentSidebar.tsx
│   │   ├── TeacherSidebar.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── Footer.tsx
│   │   └── StudentShell.tsx
│   │
│   ├── city
│   ├── mypage
│   ├── phone
│   └── ui                        # shadcn/ui 공통 컴포넌트
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ...
│
├── [features]                    # 기능 단위 모듈
│   ├── auth                      # 로그인 / 회원가입
│   ├── lecture                   # 강의 관련 기능
│   ├── phone                     # 가상 휴대폰 기능
│   ├── report                    # 신고 기능
│   ├── user                      # 회원 기능
│   ├── city                      # 도시 기능
│   └── modal                     # 모달 기능
│
├── [lib]                         # 공통 라이브러리
│   ├── api.ts                    # Axios 설정
│   ├── socket.ts                 # Socket 연결
│   ├── config
│   │   └── oauth
└───└── utils
```
---
## 🤝 협업 규칙

작업은 아래 순서에 따라 진행합니다.

### 단계	내용

```bash
0️⃣	Discussion 작성
1️⃣	Issue 작성
2️⃣	Branch 생성
3️⃣	작업 진행
4️⃣	Commit & Push
5️⃣	Pull Request
6️⃣	Code Review 후 Merge
```

### 브랜치 명명 규칙

```bash
접두어/(api or ui)/도메인_세부기능

예 : feat/ui/student_phone
```

---
## 📝 Issue 작성 규칙

제목

설명
- 작업 목적

작업 내용
- [ ] 작업1
- [ ] 작업2

기타
- 참고사항
---
## 🔀 Pull Request 작성 규칙

### 관련 이슈
#이슈번호

## 작업 내용
- 작업 내용 작성

## 스크린샷
💻 Coding Convention

---
## 코드컨벤션

### 네이밍 규칙
Component : PascalCase
Function : camelCase
Variable : camelCase
Constant : UPPER_SNAKE_CASE
