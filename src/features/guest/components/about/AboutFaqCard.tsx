"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { AboutFaqItem } from "@/features/guest/about/type";

interface AboutFaqCardProps {
    item: AboutFaqItem;
}

export default function AboutFaqCard({ item }: AboutFaqCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
            >
                <span className="text-sm font-bold text-slate-900">
                    {item.question}
                </span>

                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-5 py-4">
                        <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                            {item.answer}
                        </p>

                        {item.imageSrc && (
                            <div className="relative mt-4 h-48 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                <Image
                                    src={item.imageSrc}
                                    alt={item.question}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
