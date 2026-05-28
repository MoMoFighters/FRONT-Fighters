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
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">취소</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={onDelete}>삭제</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}