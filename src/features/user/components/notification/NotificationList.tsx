import NotificationItem from "@/components/city/NotificationItem";
interface NotificationListProps {
    onClose: () => void;
}

export default function NotificationList({
    onClose,
}: NotificationListProps) {
    return (
        <div
            className="fixed w-screen h-screen top-0 right-0"
            onClick={onClose}
        >
            <div
                className="fixed bg-white/70 w-70 min-h-30 max-h-106 top-15 right-44 rounded-xl flex flex-col border border-slate-300 shadow-xl shadow-slate-900/10 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="py-1.5 pl-7.5 border-b border-slate-500/30 rounded-t-xl">
                    <h3 className="text-slate-800 font-bold">알림 목록</h3>
                </div>
                {/* <div className="h-full flex-1 justify-center items-center flex">
                <p className="font-bold my-auto">알림이 없습니다.</p>
                </div> */}
                <div className="pt-52 h-full flex flex-col flex-1 justify-center overflow-auto scrollbar-none">
                    <NotificationItem type='friend' content="asdfasdfasdfaafsdafsdfasd" onClose={onClose} isRead={true} targetId={1} />
                    <NotificationItem type='calendar' content="afsdafdsafdsafsdafsdafds" onClose={onClose} isRead={true} targetId={1} />
                    <NotificationItem type="community" content="afdsadfsfadsfadsfadsfasdfasd" onClose={onClose} isRead={false} targetId={1} />
                    <NotificationItem type='friend' content="321123132312321321" onClose={onClose} isRead={false} targetId={1} />
                    <NotificationItem type='calendar' content="ㄻㅇ넴ㄹㄴ엘ㅇㄴ멞ㄴ엚ㄴ에" onClose={onClose} isRead={false} targetId={1} />
                    <NotificationItem type="community" content="라ㅐㄷㅈ랠대즐ㄷ잴ㄷ" onClose={onClose} isRead={true} targetId={1} />
                    <NotificationItem type='friend' content="321321321213123132" onClose={onClose} isRead={false} targetId={1} />
                    <NotificationItem type='calendar' content="213132321321" onClose={onClose} isRead={true} targetId={1} />
                    <NotificationItem type="community" content="ㅁㄴㅇㄹ1231ㅇㄹㄴㅁ" onClose={onClose} isRead={true} targetId={1} />
                    <NotificationItem type='friend' content="ㅁㄴㅇㄻㄴㅇ123213" onClose={onClose} isRead={true} targetId={1} />
                    <NotificationItem type='friend' content="ㅁㄻㄴㅇㅎ123" onClose={onClose} isRead={true} targetId={1} />
                </div>
                <div className="h-12 bg-white/50 rounded-b-xl" />
            </div>
        </div>
    );
}
