"use client";

import { useMemo, useState } from "react";
import { Coins, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { createPointOrderAction, getPointStoreItemsAction } from "../action";
import { POINT_STORE_CATEGORIES, POINT_STORE_PAGE_SIZE, toPointStoreItem } from "../data";
import { PointStoreItem, PointStoreTab } from "../type";
import PointGuideButton from "./PointGuideButton";
import PointStoreItemCard from "./PointStoreItemCard";

interface PointStorePurchaseSectionProps {
    points: number;
    initialItems: PointStoreItem[];
    initialTotalPages: number;
}

export default function PointStorePurchaseSection({
    points,
    initialItems,
    initialTotalPages,
}: PointStorePurchaseSectionProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<PointStoreTab>("ALL");
    const [items, setItems] = useState<PointStoreItem[]>(initialItems);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PointStoreItem | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const filteredItems = useMemo(() => {
        if (activeTab === "ALL") {
            return items;
        }

        return items.filter((item) => item.category === activeTab);
    }, [activeTab, items]);

    const handleLoadMore = async () => {
        if (isLoadingMore || page >= totalPages) {
            return;
        }

        setIsLoadingMore(true);

        try {
            const nextPage = page + 1;
            const response = await getPointStoreItemsAction({
                page: nextPage,
                size: POINT_STORE_PAGE_SIZE,
            });

            if (response.status >= 400) {
                toast.error(response.message || "상품 목록을 불러오지 못했습니다.");
                return;
            }

            const nextItems = response.data?.stores.map(toPointStoreItem) ?? [];

            setItems((prev) => [...prev, ...nextItems]);
            setPage(nextPage);
            setTotalPages(Math.max(response.data?.totalPages ?? totalPages, 1));
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleConfirmPurchase = async () => {
        if (!selectedItem || isPurchasing) {
            return;
        }

        setIsPurchasing(true);

        try {
            const response = await createPointOrderAction({
                reason: "PROFILE",
                itemName: selectedItem.name,
            });

            if (response.status >= 400) {
                toast.error(response.message || "구매에 실패했습니다.");
                return;
            }

            toast.success(response.message || "구매가 완료되었습니다.");
            setSelectedItem(null);
            router.refresh();
        } finally {
            setIsPurchasing(false);
        }
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
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 px-4 py-3">
                        <p className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                            <Coins className="h-3.5 w-3.5 text-amber-400" />
                            보유 포인트
                            <PointGuideButton />
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
                            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-black transition ${activeTab === category.value
                                    ? "bg-indigo-500 text-white shadow-sm shadow-indigo-200"
                                    : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-500"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-5">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
                        <p className="mt-3 text-sm font-bold">
                            판매 중인 상품이 없습니다.
                        </p>
                    </div>
                )}

                {page < totalPages && (
                    <button
                        type="button"
                        disabled={isLoadingMore}
                        onClick={handleLoadMore}
                        className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-black text-slate-500 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isLoadingMore ? "불러오는 중" : "상품 더보기"}
                    </button>
                )}
            </div>

            <TwoButtonModal
                open={!!selectedItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedItem(null);
                    }
                }}
                title="상품을 구매하시겠습니까?"
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
