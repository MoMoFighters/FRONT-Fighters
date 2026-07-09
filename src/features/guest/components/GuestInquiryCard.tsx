'use client';

import { CircleQuestionMark } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function GuestInquiryCard() {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={cardRef}
      className="relative rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <CircleQuestionMark className="h-4 w-4 text-indigo-400" />
        1:1 문의
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs leading-5 text-slate-600">
          그 외 기타 사항은 문의를 부탁드립니다.
        </p>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="min-w-16 cursor-pointer rounded-lg border border-indigo-400 bg-white px-1.5 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          문의하기
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%-0.5rem)] z-10 w-[min(15rem,calc(100vw-2.5rem))] rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-lg sm:right-5">
          <p className="font-bold text-slate-950">
            문의 정보
          </p>
          <div className="mt-3 space-y-2 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">이메일</span>
              <span className="ml-2">yourmomocity@gmail.com</span>
            </p>
            <p>
              <span className="font-semibold text-slate-900">전화번호</span>
              <span className="ml-2">02-123-4567</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
