import Image from "next/image";
import { CheckCircle2, ImageIcon } from "lucide-react";

import { MyPointItem } from "../type";

interface MyPointItemCardProps {
    item: MyPointItem;
}

export default function MyPointItemCard({
    item,
}: MyPointItemCardProps) {
    return (
        <article className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-indigo-100 hover:bg-indigo-50/40">
            <div className={`relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${item.accentClassName}`}>
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="72px"
                        className="object-cover"
                    />
                ) : (
                    <ImageIcon className="h-7 w-7" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                            {item.name}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            {item.acquiredAt} 구매
                        </p>
                    </div>

                    {item.isUsing && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-black text-indigo-500">
                            <CheckCircle2 className="h-3 w-3" />
                            사용중
                        </span>
                    )}
                </div>

                <p className="mt-3 text-[11px] font-bold text-slate-400">
                    적용 기능은 추후 API 연결 예정
                </p>
            </div>
        </article>
    );
}
