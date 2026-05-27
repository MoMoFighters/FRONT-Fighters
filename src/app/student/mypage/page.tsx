import MomoResidentCard from "@/components/mypage/MomoResidentCard";
import MyPageNav from "@/components/mypage/MyPageNav";


export default function MyPage() {

    //내 정보 패칭 받기
    const USER_DATA = {
        name: '홍길동',
        nickname: '모모시민',
        // date값 받아와서 yymmdd로
        createdAt: 111111,
        address: '대한민국 모모시 모모구 모모로 69길',
        issueDate: '2025. 11. 28',
        email: 'momocity@momo.kr',
        points: 3200,
        buildings: 5,
    };

    return (
        <div className="flex flex-col">
            <MyPageNav />
            <div className="flex flex-row gap-10 p-16">
                <MomoResidentCard data={USER_DATA} />
            </div>
        </div>
    );
}