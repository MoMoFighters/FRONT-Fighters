import building from "@/app/assets/img/building.png";
import createBuilding from "@/app/assets/img/createBuilding.png";
import phoneCommunity from "@/app/assets/img/phone-community.png";

import { AboutFaqItem, image, text } from "./type";

/**
 * 소개 페이지 FAQ 예시 데이터입니다.
 * 카테고리(audience)별로 몇 개만 채워뒀으니 필요한 만큼 자유롭게 추가/수정해주세요.
 *
 * content는 text()/image() 블록을 원하는 순서로 나열하면 됩니다. (글-사진-글도 가능)
 * - 글만: content: [text("...")]
 * - 글-사진-글: content: [text("..."), image({ src: img, alt: "..." }), text("...")]
 * - 사진 여러 장(나란히): image({ src: a }, { src: b })
 * 이미지는 로컬 import(`import img from "@/app/assets/img/xxx.png"`) 또는 public 경로 문자열(`{ src: "/images/xxx.png" }`) 둘 다 됩니다.
 * 아래 building/createBuilding/phoneCommunity는 예시로 넣어둔 임시 이미지이니, 실제 스크린샷으로 교체해주세요.
 */
export const ABOUT_FAQ_ITEMS: AboutFaqItem[] = [
    {
        id: "common-what-is-momocity",
        audience: "COMMON",
        question: "모모시티는 어떤 서비스인가요?",
        content: [
            text(
                "모모시티는 오늘의 학습을 눈에 보이는 변화로 바꿔주는 학습 플랫폼입니다. 관심 카테고리의 강의를 수강하면 그 카테고리에 맞는 건물이 나만의 도시에 생겨나고, 꾸준히 학습할수록 도시가 점점 성장합니다."
            ),
        ],
    },
    {
        id: "common-signup",
        audience: "COMMON",
        question: "회원가입은 어떻게 하나요?",
        content: [
            text(
                "우측 상단에 위치한 <Link href='/auth/signup'>회원가입</Link> 버튼을 통해서도 가능하며, 카카오, 구글, 네이버 소셜 로그인으로 간단하게 가입할 수 있습니다. 별도의 회원가입 절차 없이 로그인만 하면 바로 이용을 시작할 수 있어요."
            ),
        ],
    },
    {
        id: "common-point",
        audience: "STUDENT",
        question: "포인트는 어떻게 얻고 사용하나요?",
        content: [
            text(
                "강의 완강, 리뷰 작성, 방명록 작성 등의 활동으로 포인트를 적립할 수 있습니다. 적립한 포인트는 마이페이지의 포인트 상점에서 프로필 아이템 등 다양한 아이템으로 교환할 수 있어요."
            ),
        ],
    },
    {
        id: "student-city-building",
        audience: "STUDENT",
        question: "도시는 어떻게 꾸미나요?",
        content: [
            text(
                "관심 카테고리를 선택하고 해당 카테고리의 강의를 수강하면 카테고리에 맞는 건물이 도시에 생겨납니다. 학습 카테고리는 학교, 운동 카테고리는 헬스장, 요리 카테고리는 레스토랑, 뷰티 카테고리는 백화점, 예술 카테고리는 아트홀로 지어져요."
            ),
            image(
                { src: createBuilding, alt: "건물이 새로 생성되는 모습" },
                { src: building, alt: "성장한 건물 예시" }
            ),
            text(
                "같은 카테고리의 강의를 추가로 수강할수록 건물의 레벨이 올라가며 도시가 점점 풍성해집니다."
            ),
        ],
    },
    {
        id: "student-friend",
        audience: "STUDENT",
        question: "친구는 어떻게 추가하나요?",
        content: [
            text(
                "가상 휴대폰의 친구 검색 기능에서 닉네임으로 사용자를 검색한 뒤 친구 신청을 보낼 수 있습니다."
            ),
            image({ src: phoneCommunity, alt: "가상 휴대폰 친구 검색 화면" }),
            text(
                "상대방이 신청을 수락하면 친구가 되고, 서로의 도시와 학습 현황을 확인할 수 있어요. 강의를 신청하면 자동으로 해당 강사와 친구 관계가 됩니다."
            ),
        ],
    },
    {
        id: "student-teacher-switch",
        audience: "STUDENT",
        question: "강사로 전환하고 싶은데, 아무 때나 가능한가요?",
        content: [
            text(
                "아니요. 강사 전환은 현재 수강 중인 강의가 하나도 없을 때만 신청할 수 있습니다. 도시에 건물이 하나라도 남아있다면(=수강 중인 강의가 있다면) 강사 전환을 신청할 수 없으니, 먼저 수강 중인 강의를 완강하거나 정리한 뒤 마이페이지에서 강사 전환을 신청해주세요."
            ),
        ],
    },
    {
        id: "student-membership",
        audience: "STUDENT",
        question: "요금제는 어떻게 되나요?",
        content: [
            text(
                "모모시티에는 크게 3가지의 요금제로 구성되어 있으며, 무료 플랜인 BASIC부터 PRO, PLUS가 존재합니다. BASIC 플랜에서는 커뮤니티 조회, PRO 플랜에서는 강의 수강, PLUS 플랜에서는 무제한 AI 챗봇 이용이 가능합니다. <Link href='membership'>멤버십</Link> 페이지에서 확인 가능합니다."
            ),
        ],
    },
    {
        id: "teacher-apply",
        audience: "TEACHER",
        question: "강사 신청은 어떻게 진행되나요?",
        content: [
            text(
                "마이페이지에서 강사 전환을 신청하면 활동명, 카테고리와 함께 증빙자료(PDF 또는 MP4)를 제출하게 됩니다. 관리자가 제출한 자료를 검토해 승인하면 강사로 전환되며, 이후 다시 로그인하면 강사 화면을 이용할 수 있어요."
            ),
        ],
    },
    {
        id: "teacher-apply-condition",
        audience: "TEACHER",
        question: "강사 전환이 막히는 경우도 있나요?",
        content: [
            text(
                "네, 수강 중인 강의가 하나라도 있으면 강사 전환을 신청할 수 없습니다. 수강생으로서 학습 중인 강의를 모두 완강하거나 정리해 도시에 남은 건물이 없어야 신청이 가능해요."
            ),
        ],
    },
    {
        id: "teacher-lecture",
        audience: "TEACHER",
        question: "강의는 어떻게 등록하나요?",
        content: [
            text(
                "강사 화면의 내 강의 관리에서 새 강의를 등록할 수 있습니다. 강의 정보와 챕터별 영상을 업로드하면 검토 후 학생들에게 공개됩니다."
            ),
        ],
    },
];
