import Link from "next/link";

export default function ToHome() {
    return (
        <div className="p-10">
            <Link href='/home'>집으로</Link>
        </div>
    );
}