import { Button } from "@/components/ui/button";

export default function MessageInputBox() {
    return (
        <form className="flex flex-row px-2 py-1">
            <input type="text" className="flex-1" />
            <Button>전송</Button>
        </form>
    );
}