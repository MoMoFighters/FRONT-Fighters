'use client'

import Image from "next/image";
import { CheckCircle2, ImageIcon } from "lucide-react";

import { MyPointItem } from "../type";

interface MyPointItemCardProps {
    item: MyPointItem;
}

export default function MyPointItemCard({
    item,
}: MyPointItemCardProps) {

    const handleMyItemClick = async () => {
        console.log(item.id, "|||", item.itemId)
    }

    return (
        <article
            className="group relative flex min-h-44 cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            onClick={handleMyItemClick}
        >
            {item.isUsing && (
                <span className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black text-indigo-500 shadow-sm ring-1 ring-indigo-100">
                    <CheckCircle2 className="h-3 w-3" />
                    사용중
                </span>
            )}

            <div className={`relative flex h-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${item.accentClassName}`}>
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="180px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-14 items-center justify-center rounded-full bg-white/80 text-slate-400 shadow-sm">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                )}
            </div>

            <div className="mt-3 min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                    {item.name}
                </p>
                {item.acquiredAt && (
                    <p className="mt-1 text-[11px] font-semibold text-slate-400">
                        {item.acquiredAt} 구매
                    </p>
                )}
            </div>

            <div className="mt-auto pt-3">
                <div className="flex h-8 items-center justify-center rounded-xl bg-slate-50 text-xs font-black text-slate-500 transition group-hover:bg-indigo-50 group-hover:text-indigo-500">
                    {item.isUsing ? "적용된 아이템" : "아이템 적용"}
                </div>
            </div>
        </article>
    );
}
