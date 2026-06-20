"use client";

import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminActionConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel: string;
    tone?: "indigo" | "rose";
    confirmDisabled?: boolean;
    children?: ReactNode;
    onConfirm: () => void;
}

export default function AdminActionConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    tone = "indigo",
    confirmDisabled = false,
    children,
    onConfirm,
}: AdminActionConfirmDialogProps) {
    const isRose = tone === "rose";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm" className="border border-slate-200 bg-white p-5">
                <AlertDialogHeader>
                    <AlertDialogMedia className={isRose ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"}>
                        <AlertTriangle />
                    </AlertDialogMedia>
                    <AlertDialogTitle className="font-bold text-slate-950">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-pre-line text-slate-500">{description}</AlertDialogDescription>
                    {children}
                </AlertDialogHeader>
                <AlertDialogFooter className="-mx-5 -mb-5 border-slate-100 bg-slate-50 p-4">
                    <AlertDialogCancel className="cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-100">취소</AlertDialogCancel>
                    <AlertDialogAction
                        variant="outline"
                        disabled={confirmDisabled}
                        onClick={onConfirm}
                        className={isRose
                            ? "cursor-pointer border-rose-600 bg-rose-600 text-white hover:bg-rose-700 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400"
                            : "cursor-pointer border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-400"}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
