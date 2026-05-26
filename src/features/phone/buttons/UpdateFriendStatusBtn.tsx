import { Button } from "@/components/ui/button";

interface friendStatus {
    userId: number;
    status: 'sent' | 'recieved' | 'block' | null;
}
// type friendStatus = 'sent' | 'recieved' | 'block';


export default function UpdateFriendStatusBtn({ data }: { data: friendStatus }) {

    const { status, userId } = data;

    const buttonText =
        status === 'recieved' ? ['수락', '거절']
            : status === 'sent' ? ['', '취소']
                : status === null ? ["", "요청"] : ["", ""]

    const buttonStyle =
        status === 'recieved' ? ['bg-sky-500', 'bg-slate-200']
            : status === 'sent' ? ['', 'bg-slate-200']
                : status === null ? ["", "bg-slate-200"] : ["", ""]
    const buttonAPI =
        status === 'recieved' ? ['수락', '거절']
            : status === 'sent' ? ['', '취소']
                : status === null ? ["", ""] : ["", ""]
    return (
        <div className="flex flex-row gap-3 items-center">
            {buttonText[0] ? (
                <Button className={`${buttonStyle[0]} text-slate-50 cursor-pointer px-3`}>
                    {buttonText[0]}
                </Button>
            ) : ''}
            <Button className={`${buttonStyle[1]} text-slate-900 cursor-pointer px-3`}>
                {buttonText[1]}
            </Button>
        </div>
    );
}