interface MessageData {
    id: number;
    isMine: boolean;
    message: string;
    time: string;
}

export default function ChatItem({ isMine, message, time, id }: MessageData) {
    const messageStyle = isMine ? "flex-row-reverse" : "flex-row";
    const messageColor = !isMine ? "bg-slate-50" : "bg-sky-500";
    const textColor = !isMine ? 'text-slate-900' : 'text-slate-50'

    return (
        <div className={`${messageStyle} w-full flex align-bottom gap-2`} key={id}>
            <div className={`max-w-70 ${messageColor} h-auto py-2 px-3 rounded-md border border-slate-300`}>
                <p className={textColor}>{message}</p>
            </div>
            <p className="mt-auto">{time}</p>
        </div>
    );
}