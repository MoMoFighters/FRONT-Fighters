import UpdateFriendStatusBtn from "@/features/phone/components/buttons/UpdateFriendStatusBtn";
import Image from "next/image";


interface friendInfo {
    userId: number;
    name: string;
    status: 'none' | 'SENT' | 'FRIEND' | 'RECEIVED' | 'BLOCK';
    profile: string;
}

export default function FriendItem({ friendInfo }: { friendInfo: friendInfo }) {

    const { name, profile, userId } = friendInfo;
    const status = friendInfo.status ?? null



    return (
        <div className="flex flex-row px-2 py-auto gap-3 rounded-lg bg-slate-100 h-18 align-middle mt-1 min-w-max">
            <div className="my-auto w-11 h-11 rounded-full flex justify-center align-middle">
                <Image src={profile} alt='프사' className="my-auto" width={40} height={40} />
            </div>
            <div className="flex flex-1 align-middle">
                <p className="my-auto font-medium text-slate-900 flex-1">{name}</p>
            </div>
            <UpdateFriendStatusBtn data={{ status, userId }} />
        </div>
    );
}