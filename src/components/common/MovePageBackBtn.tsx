'use client'

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MovePageBackBtn({ href }: { href: string; }) {

    const router = useRouter();

    return (
        <ArrowLeft onClick={() => router.push(href)} className="absolute top-4 left-4 w-6 h-6 hover:text-slate-400 cursor-pointer text-slate-300" />
    );
}