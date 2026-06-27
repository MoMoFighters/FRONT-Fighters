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
 * @param trigger => 모달을 열 버튼 (asChild가 적용되므로 단일 요소여야 함)
 * @param title => 모달 제목
 * @param description => 모달 상세 설명
 * @param onDelete => 삭제 버튼 클릭 시 실행될 함수
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
                    {/* 이미지의 레드 테마를 반영한 아이콘 영역 */}
                    <AlertDialogMedia className="bg-red-100 text-red-500">
                        <Trash2Icon className="w-5 h-5" />
                    </AlertDialogMedia>

                    {/* 줄바꿈 유지를 위한 whitespace-pre-line 적용 */}
                    <AlertDialogTitle className="whitespace-pre-line">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="whitespace-pre-line">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" className="cursor-pointer">
                        취소
                    </AlertDialogCancel>

                    {/* 첫 번째 예시의 스타일을 유지하며 삭제(Red) 테마 적용 */}
                    <AlertDialogAction
                        variant="ghost"
                        className="bg-red-500 text-white hover:text-white! hover:bg-red-600!"
                        onClick={onDelete}
                    >
                        삭제
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
