interface MessageData {
    isMine: boolean;
    message: string;
    time: string;
}

export default function ChatItem({ isMine, message, time }: MessageData) {
    const messageStyle = isMine ? "flex-row-reverse" : "flex-row";

    return (
        <div className={`${messageStyle} w-full flex align-bottom gap-2`}>
            <div className={`max-w-70 bg-slate-50 h-auto p-3 rounded-md`}>
                <p className="text-slate-900">{message}</p>
            </div>
            <p className="mt-auto">{time}</p>
        </div>
    );
}