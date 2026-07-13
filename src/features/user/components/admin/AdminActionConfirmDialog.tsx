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
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className={isRose ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"}>
                        <AlertTriangle />
                    </AlertDialogMedia>
                    <AlertDialogTitle className="whitespace-pre-line">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-pre-line">{description}</AlertDialogDescription>
                    {children}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" className="cursor-pointer">취소</AlertDialogCancel>
                    <AlertDialogAction
                        variant="ghost"
                        disabled={confirmDisabled}
                        onClick={onConfirm}
                        className={isRose
                            ? "bg-rose-500 text-white hover:text-white! hover:bg-rose-600!"
                            : "bg-indigo-500 text-white hover:text-white! hover:bg-indigo-600!"}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
