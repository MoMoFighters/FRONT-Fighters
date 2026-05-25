interface MessageData {
    isMine: boolean;
    message: string;
    time: string;
}

export default function ChatItem() {

    const { isMine, message, time } = {
        isMine: false,
        message: "테스트메시지테스트메시지테스트메시지테스트메시지테스트메시지테스트메시지테스트메시지",
        time: '04:44'
    } as MessageData;
    const messageStyle = isMine ? ["flex-row-reverse", "flex-row"] : "";


    return (
        <div className={`${messageStyle[0]} w-full flex align-bottom gap-2 justify-self-end`}>
            <div className={`max-w-70 bg-black h-auto p-3 ${messageStyle[1]} rounded-md`}>
                <p className="text-white">{message}</p>
            </div>
            <p className="mt-auto">{time}</p>
        </div>
    );
}