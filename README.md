## FRONT README

### 파일구조
```bash
[src]
├──📁[assets]
│			├──📁[img]
│			└──📁[font]
│
├──📁[app]
│			├── layout.tsx   // 메인 레이아웃
│			├── page.tsx    // guest 메인 홈페이지
│			├── error.tsx    // 에러 페이지
│			├── not-found.tsx    // 404 페이지
│			├──📁auth
│			│			├──📁login
│			│			│			└── page.tsx     // 로그인
│			│			├──📁signup
│			│			└──		└── page.tsx     // 회원가입
│			├──📁student
│			│			├── page.tsx    // 내 도시  (buildings  알림 관련 - module 4 이후)
│			│			├── layout.tsx   // 수강생 레이아웃
│			│			├──📁tutorial   // 튜토리얼 ( module 4 이후 )
│			│			├──📁users
│			│			│			├── page.tsx    // 친구(가고 싶은 도시) 전체 조회 - 버스 (friends)
│			│			│			├──📁[userId]
│			│			│			└──			└── page.tsx    // 친구 도시(상세 조회) (friend)
│			│			├──📁lectures
│			│			│			├── page.tsx    // 건물 X - 강의 전체 조회 (lectures)
│			│			│			├──📁[lectureId]
│			│			│			└──			└── page.tsx    // 강의 상세 조회 (lecture)
│			│			├──📁mypage
│			│			│			├──📁myinfo
│			│			│			│			├── page.tsx    // 내 정보 조회 (user)
│			│			│			│			├──📁edit
│			│			│			│			└──			└── page.tsx    // 내 정보 수정 (user)
│			│			│			├──📁lectures
│			│			│			└──			└── page.tsx    // 내 강의 전체 조회 (enrollment)
│			│			├──📁community
│			│			│			└── page.tsx     // 커뮤니티 게시판 목록 ( module 4 이후 )
│			│			├──📁market
│			│			│			└── page.tsx     // 포인트 상점 ( module 4 이후 )
│			│			├──📁[category]
│			│			│			├── page.tsx    // 실내 UI - 건물 정보
│			│			│			├──📁lectures
│			│			│			│			├── page.tsx    // (lectures/category) , (enrollments/learning history)
│			│			│			│			├──📁[lectureId]
│			│			│			│			│			├── page.tsx  // (lecture, enrollment, chapter, review, l-h)
│			│			│			│			│			├──📁chapters
│			│			│			│			│			│			├──📁[chapterId]
│			│			│			└──		└──		└──		└──		└── page.tsx    // (enrollment, chapter)
│			│			├──📁phone
│			│			│			├── layout.tsx      // 휴대폰 배경
│			│			│			├──📁calender
│			│			│			│			└── page.tsx    // 달력 페이지 - 투두리스트 (해당 페이지에서 컴포넌트로 모두 처리)
│			│			│			├──📁friends
│			│			│			│			├── page.tsx    // 내 친구 목록 (friends)
│		  │			│			│			├──📁sent
│			│			│			│			│			└── page.tsx    // 보낸 요청 (friend - sent)
│		  │			│			│			├──📁recieved
│			│			│			│			│			└── page.tsx    // 받은 요청 (friend - sent)
│		  │			│			│			├──📁search
│			│			│			│			│			└── page.tsx    // 친구 찾기 (users - 검색 api)
│		  │			│			│			├──📁blacklist
│			│			│			│			│			└── page.tsx    // 블랙리스트 (friend - block)
│			│			│			│			├──📁chat 
│			│			└──		└──		└──		└── page.tsx    // 채팅방 (chatroom, message)
│			├──📁teacher
│			│			├── page.tsx    // 강사 메인 
│			│			├── layout.tsx   // 강사 레이아웃
│			│			├──📁lectures
│			│			│			└── page.tsx     // 내 강의 전체 조회 (lectures)
│			│			├──📁community
│			│			│			└── page.tsx     // 커뮤니티 게시판 목록 ( module 4 이후 )
│			│			├──📁Ask
│			│			└──			└── page.tsx     // 1대1 문의 (chatroom, message)
│			├──📁admin
│			│			├── page.tsx    // 관리자 메인 대시보드 (계산, report, error)
│			│			├── layout.tsx   // 관리자 레이아웃
│			│			├──📁users
│			│			│			└── page.tsx     // 회원 관리 (users)
│			│			├──📁lectures
│			│			│			└── page.tsx     // 강의 관리 (lectures)
│			│			├──📁sales
│			└──		└──		└── page.tsx     // 매출 관리 (module 4 이후)
├──📁components
│			├──📁ui
│			│			├── alert-dialog.tsx
│			│			├── badge.tsx
│			│			├── button.tsx
│			│			├── combobox.tsx
│			│			├── checkbox.tsx
│			│			├── dialog.tsx
│			│			├── field.tsx
│			│			├── hover-card.tsx
│			│			├── label.tsx
│			│			├── navigation-menu.tsx
│			│			├── progress.tsx
│			│			├── spinner.tsx
│			│			└── table.tsx
│			├──📁layout
│			│			├── GuestHeader.tsx     // 비로그인 헤더 (홈 로그인 회원가입)
│			│			├── AuthHeader.tsx      // 로그인 헤더 (홈 로그아웃)
│			│			├── StudentSidebar.tsx
│			│			├── TeacherSidebar.tsx
│			│			├── AdminSidebar.tsx
│			│			├── PhoneLayout.tsx
│			│			└── Footer.tsx
│			├──📁common
│			│			├── LectureItem.tsx (mode === 'detail' | 'list' | 'teacherList')
│			│			├── ChapterItem.tsx (mode === 'preview' | 'list')
│			│			├── ReviewItem.tsx 
│			│			├── ChatItem.tsx
│			│			└── ChatRoomItem.tsx
│			├──📁phone
│			└──		└── FriendItem.tsx
├──📁features
│			├──📁common
│			│			├── OneButtonModal.tsx
│			│			├── TwoButtonModal.tsx
│			│			└── DeleteModal.tsx
│			├──📁auth
│			│			├── EmailInputModal.tsx     // 임시 비밀번호 발급 시 이메일 입력
│			│			└── NicknameInputModal.tsx
│			├──📁lecture
│			│			├── LectureForm.tsx     (mode = 'create' | mode = 'edit')
│			│			├──📁detail
│			│			│			├──📁buttons
│			│			│			│			├── EnrollLectureBtn.tsx
│			│			│			│			├── DeleteLectureBtn.tsx    (mode= 'icon' | mode= 'text')
│			│			│			│			├── AcceptLectureBtn.tsx
│			│			│			│			├── RejectLectureBtn.tsx
│			│			│			└──		└── CreateReviewBtn.tsx
│			│			├──📁teacher
│			│			│			├──📁buttons
│			│			│			│			├── EditLectureBtn.tsx
│			│			│			└──		└── CreateLectureBtn.tsx
│			│			├──📁admin
│			│			│			├──📁buttons
│			│			└──		└──		└── DeleteChapterBtn.tsx
│			├──📁phone
│			│			├──📁buttons
│			│			│			├── UpdateFriendStatusBtn.tsx
│			│			│			├── DeleteTodoBtn.tsx
│			│			│			└── CreateRoomBtn.tsx
│			│			├──📁Todo
│			│			│			├── TodoSection.tsx
│			│			│			├── Calendar.tsx
│			│			│			├── TodoItem.tsx
│			│			│			└── AddTodoArea.tsx
│			│			├──📁Friend
│			│			└──		└── FriendNav.tsx
│			├──📁user
│			│			├──📁admin
│			│			│			├──📁buttons
│			│			│			│			├── UpdateUserStatusBtn.tsx
│			│			│			│			└── DownloadProofDocBtn.tsx
│			│			│			├── UserManageNav.tsx
│			└──		└──		└── UserManageSearchbar.tsx
├──📁sevices
├──📁lib
│			├── api.ts
└──		└── utils.ts
```
