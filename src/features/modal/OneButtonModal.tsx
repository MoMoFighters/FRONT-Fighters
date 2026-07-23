'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CircleAlert } from "lucide-react";

interface OneButtonModalProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    onConfirm?: () => void;
}

export default function OneButtonModal({
    trigger,
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "확인",
    onConfirm,
}: OneButtonModalProps) {

    const isControlled =
        open !== undefined;

    return (
        <AlertDialog
            open={isControlled ? open : undefined}
            onOpenChange={
                isControlled
                    ? onOpenChange
                    : undefined
            }
        >
            {trigger && (
                <AlertDialogTrigger asChild>
                    {trigger}
                </AlertDialogTrigger>
            )}
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-red-100 text-red-500">
                        <CircleAlert />
                    </AlertDialogMedia>
                    <AlertDialogTitle className="whitespace-pre-line">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-pre-line">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="group-data-[size=sm]/alert-dialog-content:grid-cols-1">
                    <AlertDialogAction
                        variant="ghost"
                        className="w-full cursor-pointer bg-indigo-500 text-white hover:bg-indigo-600! hover:text-white!"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
