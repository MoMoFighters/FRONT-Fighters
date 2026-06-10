interface MessageData {
    id: number;
    isMine: boolean;
    message: string;
    time: string;
}

export default function ChatItem({
    isMine,
    message,
    time,
    id,
}: MessageData) {
    return (
        <div
            className={`w-full flex gap-2 ${isMine ? "justify-end" : "justify-start"
                }`}
            key={id}
        >
            {!isMine ? (
                <>
                    <div
                        className="
                    max-w-[300px]
                    w-fit
                    bg-white
                    px-4
                    py-2
                    rounded-[20px]
                    rounded-bl-md
                    shadow-sm
                "
                    >
                        <p className="text-slate-800 break-words whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>

                    <p className="mt-auto text-xs text-slate-400 shrink-0">
                        {time}
                    </p>
                </>
            ) : (
                <>
                    <p className="mt-auto text-xs text-slate-400 shrink-0">
                        {time}
                    </p>

                    <div
                        className="
                    max-w-[300px]
                    w-fit
                    bg-indigo-500
                    px-4
                    py-2
                    rounded-[20px]
                    rounded-br-md
                    shadow-sm
                "
                    >
                        <p className="text-white break-words whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}