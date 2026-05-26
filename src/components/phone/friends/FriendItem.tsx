import UpdateFriendStatusBtn from "@/features/phone/buttons/UpdateFriendStatusBtn";
import Image from "next/image";
import user from '@/app/assets/img/user.svg'


interface friendInfo {
    userId: number;
    name: string;
    status?: 'sent' | 'recieved' | 'block';
    profile: string;
}

export default function FriendItem({ friendInfo }: { friendInfo: friendInfo }) {

    const { name, profile, userId } = friendInfo;
    const status = friendInfo.status ?? null



    return (
        <div className="flex flex-row px-2 py-auto gap-3 rounded-lg bg-slate-50 h-18 align-middle">
            <div className="my-auto w-11 h-11 rounded-full bg-slate-300 flex justify-center align-middle">
                <Image src={user} alt='프사' className="my-auto" />
            </div>
            <div className="flex-1 flex align-middle">
                <p className="my-auto font-medium">{name}</p>
            </div>
            <UpdateFriendStatusBtn data={{ status, userId }} />
        </div>
        // 나중에 아래꺼로 바꾸기
        /*
         
        */
    );
}