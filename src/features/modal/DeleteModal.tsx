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
import { Trash2Icon } from "lucide-react";

interface DeleteModalProps {
    trigger: React.ReactNode;
    title: string;
    description: string;
    onDelete: () => void;
}

/**
 * 
 * @param param0 trigger => 모달 열 버튼(div로 감싸면 안됨), title => 질문, description => 설명, onDelete => 삭제 실행 함수
 * @returns 
 */
export default function DeleteModal({
    trigger, title, description, onDelete
}: DeleteModalProps) {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent size="sm" className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-xl">
                <AlertDialogHeader className="gap-3 px-6 pt-6">
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!mx-0 !mb-0 mt-6 !flex !flex-row !justify-end gap-2 !border-0 !bg-transparent !px-6 !pb-6 !pt-0">
                    <AlertDialogCancel variant="outline" className="h-9 rounded-md border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-100">취소</AlertDialogCancel>
                    <AlertDialogAction variant="outline" onClick={onDelete} className="h-9 rounded-md !border-rose-600 !bg-rose-600 px-4 text-sm font-bold !text-white hover:!bg-rose-700 hover:!text-white">삭제</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
