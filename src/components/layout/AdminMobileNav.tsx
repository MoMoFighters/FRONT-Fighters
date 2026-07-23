"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "./AdminSidebar";

export default function AdminMobileNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 bg-white md:hidden">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                className="flex h-11 w-full items-center justify-between px-4 text-sm font-black text-slate-700"
            >
                <span className="flex items-center gap-2">
                    <Menu className="h-4 w-4" />
                    메뉴
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <nav className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto border-t border-slate-100 p-3">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-black transition ${isActive ? "bg-indigo-50 text-indigo-500" : "text-slate-600 hover:bg-slate-50"}`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}
