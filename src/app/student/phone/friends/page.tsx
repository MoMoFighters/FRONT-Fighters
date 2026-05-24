import FriendItem from "@/components/phone/friends/FriendItem";
import FriendNav from "@/features/phone/friend/FriendNav";
import { profile } from "console";
import Link from "next/link";

interface friendStatus {
    mode: 'friend' | 'recieved' | 'sent' | 'search' | 'blacklist';
}

interface friendInfo {
    name: string;
    status: friendStatus;
    profile: string;
}

export default function MyFriends() {

    const friendInfo1: friendInfo = { name: '김친구', profile: '프사', status: { mode: 'friend' } }
    const friendInfo2: friendInfo = { name: '이요청', profile: '프사', status: { mode: 'recieved' } }
    const friendInfo3: friendInfo = { name: '박보냄', profile: '프사', status: { mode: 'sent' } }
    const friendInfo4: friendInfo = { name: '최검색', profile: '프사', status: { mode: 'search' } }
    const friendInfo5: friendInfo = { name: '정차단', profile: '프사', status: { mode: 'blacklist' } }

    return (
        <div className="flex flex-col flex-1 h-full">
            <FriendNav mode='friend' />
            <div className="flex flex-col gap-1 px-2 py-2 bg-mauve-200 flex-1 overflow-y-auto">
                <FriendItem friendInfo={friendInfo1} key={friendInfo1.name} />
                <FriendItem friendInfo={friendInfo2} key={friendInfo2.name} />
                <FriendItem friendInfo={friendInfo3} key={friendInfo3.name} />
                <FriendItem friendInfo={friendInfo4} key={friendInfo4.name} />
                <FriendItem friendInfo={friendInfo5} key={friendInfo5.name} />
            </div>
        </div>
    );
}