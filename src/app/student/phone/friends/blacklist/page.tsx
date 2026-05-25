import FriendNav from "@/features/phone/friend/FriendNav";

interface friendStatus {
    mode: 'friend' | 'recieved' | 'sent' | 'search' | 'blacklist';
}

export default function FriendBlackListPage() {
    return (
        <div>
            <FriendNav mode='blacklist' />
        </div>
    );
}