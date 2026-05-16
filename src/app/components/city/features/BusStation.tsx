import Link from "next/link";

export default function BusStation() {
    return (
        <div className="p-10">
            <Link href='/city/bus'>
                BusStation
            </Link>
        </div>
    );
}