import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import { getMyInfo } from "@/features/user/action";
import UserInfoEditForm from "@/features/user/UserInfoEditForm";
import { toast } from "sonner";

export default async function MyPageEdit() {
    let userInfo = null;
    try {
        userInfo = await getMyInfo();
    } catch (error) {
        toast.error("유저 정보 로드 실패:");
    }

    return (
        <div className="p-12 relative">
            <MovePageBackBtn href="/student/mypage" />
            <p className="mb-8 font-bold text-slate-900 text-2xl">
                내 정보 수정
            </p>
            <UserInfoEditForm initialData={userInfo} />
        </div>
    );
}