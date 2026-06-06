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
        <div className="flex flex-row items-center gap-3 px-4 py-3 rounded-xl bg-white border">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-indigo-50 flex items-center justify-center shrink-0">
                <Image
                    src={profile}
                    alt="프사"
                    width={44}
                    height={44}
                    className="object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                    {name}
                </p>
            </div>

            <UpdateFriendStatusBtn
                data={{ status, userId }}
            />
        </div>
    );
}