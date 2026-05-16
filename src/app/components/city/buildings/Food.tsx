import Link from "next/link";

export default function Food() {
    return (
        <div className="p-10">
            <Link href='/city/food'>음식점</Link>
        </div>
    );
}