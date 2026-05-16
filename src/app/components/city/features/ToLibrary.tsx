import Link from "next/link";

export default function ToLibrary() {
    return (
        <div className="p-10">
            <Link href='/library'>도서관</Link>
        </div>
    );
}