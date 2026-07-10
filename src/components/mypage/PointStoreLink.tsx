import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";

interface PointStoreLinkProps {
    className?: string;
}

export default function PointStoreLink({ className = "" }: PointStoreLinkProps) {
    return (
        <Link
            href="/student/point-store"
            className={`flex items-center gap-1 text-xs font-black text-indigo-500 transition hover:text-indigo-600 ${className}`}
        >
            <Store className="h-3.5 w-3.5" />
            포인트 상점
            <ArrowRight className="h-3.5 w-3.5" />
        </Link>
    );
}
