"use client";

import Image from "next/image";
import { Coins, Sparkles } from "lucide-react";

import { PointStoreItem } from "../type";

interface PointStoreItemCardProps {
    item: PointStoreItem;
    onSelect: (item: PointStoreItem) => void;
}

export default function PointStoreItemCard({
    item,
    onSelect,
}: PointStoreItemCardProps) {
    return (
        <button
            type="button"
            onClick={() => {
                if (!item.isOwned) {
                    onSelect(item);
                }
            }}
            disabled={item.isOwned}
            className="group flex min-h-38 flex-col rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:border-slate-100 disabled:hover:shadow-sm cursor-pointer"
        >
            <div className={`relative flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${item.accentClassName}`}>
                {item.isOwned && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black text-indigo-500 shadow-sm ring-1 ring-indigo-100">
                        보유중
                    </span>
                )}

                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex size-16 items-center justify-center rounded-full bg-white/75 text-2xl font-black shadow-sm backdrop-blur">
                        <Sparkles className="h-7 w-7" />
                    </div>
                )}
            </div>

            <div className="mt-3 min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                    {item.name}
                </p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-3">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-500">
                    프로필
                </span>

                <span className="flex items-center gap-1 text-sm font-black text-slate-800">
                    <Coins className="h-3.5 w-3.5 text-amber-400" />
                    {item.price.toLocaleString()}
                </span>
            </div>
        </button>
    );
}
