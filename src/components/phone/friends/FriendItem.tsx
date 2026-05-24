import UpdateFriendStatusBtn from "@/features/phone/buttons/UpdateFriendStatusBtn";
import { Button } from "../../ui/button";
import Image from "next/image";
import user from '@/app/assets/img/user.svg'

interface friendStatus {
    mode: 'friend' | 'recieved' | 'sent' | 'search' | 'blacklist';
}

interface friendInfo {
    name: string;
    status: friendStatus;
    profile: string;
}

export default function FriendItem({ friendInfo }: { friendInfo: friendInfo }) {

    const { name, status, profile } = friendInfo;



    return (
        <div className="flex flex-row px-2 py-2 gap-3 rounded-lg bg-slate-100 h-15 hover:bg-slate-200 cursor-pointer">
            <div className="py-auto w-11 h-11 rounded-full bg-slate-300 flex justify-center align-middle">
                <Image src={user} alt='프사' />
            </div>
            <div className="flex-1 flex align-middle">
                <p className="my-auto font-medium">{name}</p>
            </div>
            <UpdateFriendStatusBtn status={status} />
        </div>
    );
}