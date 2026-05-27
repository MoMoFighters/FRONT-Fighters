import MyPageNav from "@/components/mypage/MyPageNav";

export default function MyLecturesListPage() {
    return (
        <div className="flex flex-col">
            <MyPageNav />
            내 강의 목록(enrollments)
            student - [category] - lectures - [lectureId]
        </div>
    );
}