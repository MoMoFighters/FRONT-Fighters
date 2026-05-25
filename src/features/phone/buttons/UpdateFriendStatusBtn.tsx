import { Button } from "@/components/ui/button";

interface friendStatus {
    mode: 'friend' | 'recieved' | 'sent' | 'search' | 'blacklist';
}

export default function UpdateFriendStatusBtn({ status }: { status: friendStatus }) {

    const buttonText =
        status.mode === 'friend' ? ["삭제", "차단"]
            : status.mode === 'recieved' ? ['수락', '거절']
                : status.mode === 'sent' ? ['', '취소']
                    : status.mode === 'search' ? ['', '요청']
                        : ['', '해제'];

    const buttonStyle =
        status.mode === 'friend' ? ["bg-slate-300 text-black", "bg-red-500 text-white"]
            : status.mode === 'recieved' ? ['bg-blue-500 text-white', 'bg-slate-300 text-black']
                : status.mode === 'sent' ? ['', 'bg-slate-300 text-black']
                    : status.mode === 'search' ? ['', 'bg-blue-500 text-white']
                        : ['', 'bg-slate-300 text-black'];

    const buttonAPI =
        status.mode === 'friend' ? ["삭제하기", "차단하기"]
            : status.mode === 'recieved' ? ['수락하기', '거절하기']
                : status.mode === 'sent' ? ['', '취소하기']
                    : status.mode === 'search' ? ['', '요청하기']
                        : ['', '해제하기'];
    return (
        <div className="flex flex-row gap-3 items-center">
            {buttonText[0] ? (
                <Button className={`${buttonStyle[0]}`}>
                    {buttonText[0]}
                </Button>
            ) : ''}
            <Button className={`${buttonStyle[1]}`}>
                {buttonText[1]}
            </Button>
        </div>
    );
}