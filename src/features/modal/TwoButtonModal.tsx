'use client'

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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CircleAlert } from "lucide-react";

interface TwoButtonModalProps {
    // 일반 상황의 경우
    trigger?: React.ReactNode;
    // 중복 레이아웃의 경우
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    description?: string;
    onConfirm?: () => void;
}

export default function TwoButtonModal({
    trigger,
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
}: TwoButtonModalProps) {

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
                    <AlertDialogMedia className="bg-green-100 text-green-400">
                        <CircleAlert />
                    </AlertDialogMedia>
                    <AlertDialogTitle className="whitespace-pre-line">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-pre-line">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" className="cursor-pointer">취소</AlertDialogCancel>
                    <AlertDialogAction variant="ghost" className="bg-indigo-500 text-white hover:text-white! hover:bg-indigo-600!" onClick={onConfirm}>확인</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}