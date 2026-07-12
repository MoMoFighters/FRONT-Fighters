"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AboutFaqItem, FaqBlock } from "@/features/guest/about/type";

interface AboutFaqCardProps {
    item: AboutFaqItem;
}

/**
 * 텍스트 안의 `<Link href='...'>텍스트</Link>` 표기를 실제 next/link로 변환합니다.
 * 예) "우측 상단의 <Link href='/auth/signup'>회원가입</Link> 버튼을 눌러주세요."
 */
const renderFaqText = (text: string): ReactNode[] => {
    const linkTagRegex = /<Link href=['"]([^'"]+)['"]>([^<]+)<\/Link>/g;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = linkTagRegex.exec(text)) !== null) {
        const [fullMatch, href, label] = match;

        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        nodes.push(
            <Link
                key={`faq-link-${key++}`}
                href={href}
                className="font-bold text-indigo-500 underline underline-offset-2 hover:text-indigo-600"
            >
                {label}
            </Link>
        );

        lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
};

const FaqContentBlock = ({ block, question }: { block: FaqBlock; question: string }) => {
    if (block.type === "text") {
        return (
            <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                {renderFaqText(block.text)}
            </p>
        );
    }

    return (
        <div
            className={`grid gap-3 ${block.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                }`}
        >
            {block.images.map((image, index) => (
                <div
                    key={index}
                    className="relative h-40 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                >
                    <Image
                        src={image.src}
                        alt={image.alt ?? question}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

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
                    <div className="space-y-4 border-t border-slate-100 px-5 py-4">
                        {item.content.map((block, index) => (
                            <FaqContentBlock
                                key={index}
                                block={block}
                                question={item.question}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
