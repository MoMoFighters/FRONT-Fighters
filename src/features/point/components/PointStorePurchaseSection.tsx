"use client";

import { useMemo, useState } from "react";
import { Coins, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { POINT_STORE_CATEGORIES, POINT_STORE_ITEMS } from "../data";
import { PointStoreItem, PointStoreTab } from "../type";
import PointStoreItemCard from "./PointStoreItemCard";

interface PointStorePurchaseSectionProps {
    points: number;
}

export default function PointStorePurchaseSection({
    points,
}: PointStorePurchaseSectionProps) {
    const [activeTab, setActiveTab] = useState<PointStoreTab>("ALL");
    const [selectedItem, setSelectedItem] = useState<PointStoreItem | null>(null);

    const filteredItems = useMemo(() => {
        if (activeTab === "ALL") {
            return POINT_STORE_ITEMS;
        }

        return POINT_STORE_ITEMS.filter((item) => item.category === activeTab);
    }, [activeTab]);

    const handleConfirmPurchase = () => {
        if (!selectedItem) {
            return;
        }

        toast.info("구매 API 연결 예정입니다.");
        setSelectedItem(null);
    };

    return (
        <section className="flex min-h-150 flex-1 flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-400">
                            Point Shop
                        </p>
                        <h2 className="mt-1 text-2xl font-black text-slate-950">
                            상점
                        </h2>
                        <p className="mt-1 text-sm font-medium text-slate-400">
                            포인트로 꾸미기 아이템을 구매할 수 있습니다.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 px-4 py-3">
                        <p className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                            <Coins className="h-3.5 w-3.5 text-amber-400" />
                            보유 포인트
                        </p>
                        <p className="mt-1 text-right text-2xl font-black text-slate-950">
                            {points.toLocaleString()}
                            <span className="ml-1 text-sm text-indigo-500">P</span>
                        </p>
                    </div>
                </div>

                <nav className="mt-5 flex gap-2">
                    {POINT_STORE_CATEGORIES.map((category) => (
                        <button
                            key={category.value}
                            type="button"
                            onClick={() => setActiveTab(category.value)}
                            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-black transition ${
                                activeTab === category.value
                                    ? "bg-indigo-500 text-white shadow-sm shadow-indigo-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-500"
                            }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="min-h-0 flex-1 p-5">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                        {filteredItems.map((item) => (
                            <PointStoreItemCard
                                key={item.id}
                                item={item}
                                onSelect={setSelectedItem}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                        <ShoppingBag className="h-8 w-8" />
                        <p className="mt-3 text-sm font-bold">판매 중인 아이템이 없습니다.</p>
                    </div>
                )}
            </div>

            <TwoButtonModal
                open={!!selectedItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedItem(null);
                    }
                }}
                title="아이템을 구매하시겠습니까?"
                description={
                    selectedItem
                        ? `${selectedItem.name}\n${selectedItem.price.toLocaleString()}P가 차감됩니다.`
                        : undefined
                }
                onConfirm={handleConfirmPurchase}
            />
        </section>
    );
}
