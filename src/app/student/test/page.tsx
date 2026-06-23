import ChatItem from "@/components/common/ChatItem";

export default function Test() {

    return (
        <div className="w-full h-full">
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 flex flex-col gap-3 bg-slate-50">
                <ChatItem isMine={true} message="asdfasdf" time='2026-04-04' id={1} />
                <ChatItem
                    isMine={false}
                    message="asdfasdfafdsjlk;afsdjlk;fasdj;klfads;lkjfasdl;kjfadsl;kjfsadjl;kfdsajlk;fasdlj;kfdsa"
                    time='2026-04-04'
                    id={2}
                />
                <ChatItem isMine={false} message="asdfasdf" time='2026-04-04' id={3} />
                <ChatItem isMine={null} message="ㄴㄹㅇㄹ님이 채팅방을 나갔습니다." time='2026-04-04' id={4} />
                <ChatItem isMine={true} message="asdfasdf" time='2026-04-04' id={5} />
            </div>
        </div>
    );
}