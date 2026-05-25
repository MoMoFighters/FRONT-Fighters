import { Button } from "@/components/ui/button";

export default function MessageInputBox() {
    return (
        <form className="flex flex-row px-2 py-1 gap-1 bg-slate-50">
            <input
                type="text"
                className="flex-1 border border-black pl-1 rounded-sm"
                placeholder="내용을 입력하세요..."
            />
            <Button>전송</Button>
        </form>
    );
}