"use client";

import { useMemo, useState } from "react";
import { PackageOpen } from "lucide-react";

import { MY_POINT_ITEMS, POINT_STORE_CATEGORIES } from "../data";
import { PointStoreTab } from "../type";
import MyPointItemCard from "./MyPointItemCard";

export default function PointStoreInventorySection() {
    const [activeTab, setActiveTab] = useState<PointStoreTab>("ALL");

    const filteredItems = useMemo(() => {
        if (activeTab === "ALL") {
            return MY_POINT_ITEMS;
        }

        return MY_POINT_ITEMS.filter((item) => item.category === activeTab);
    }, [activeTab]);

    return (
        <aside className="flex min-h-150 w-full max-w-120 flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-400">
                    Inventory
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                    내 보유 아이템
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-400">
                    구매한 아이템과 현재 사용 상태를 확인합니다.
                </p>

                <nav className="mt-5 flex gap-2">
                    {POINT_STORE_CATEGORIES.map((category) => (
                        <button
                            key={category.value}
                            type="button"
                            onClick={() => setActiveTab(category.value)}
                            className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-black transition ${
                                activeTab === category.value
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-500"
                            }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="scrollbar-hidden min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <MyPointItemCard
                            key={item.id}
                            item={item}
                        />
                    ))
                ) : (
                    <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                        <PackageOpen className="h-8 w-8" />
                        <p className="mt-3 text-sm font-bold">보유한 아이템이 없습니다.</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
