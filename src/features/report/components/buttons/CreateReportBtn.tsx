'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { toast } from "sonner";
import { CreateReportAction } from "../../action";
import { CreateReportRequest } from "../../type";

interface ReportFormData {
    reason: string;
    reasonDetail: string;
}

interface CreateReportBtnProps {
    triggerLabel?: string;
    triggerClassName?: string;
}

export default function CreateReportBtn({
    triggerLabel = "신고",
    triggerClassName,
}: CreateReportBtnProps) {

    // 신고 작성 모달
    const [isModal, setIsModal] = useState(false);

    // 최종 확인 모달 상태 관리
    const [isConfirmModal, setIsConfirmModal] = useState(false);

    const [formData, setFormData] = useState<ReportFormData>({
        reason: '',
        reasonDetail: '',
    });

    // 신고하기 버튼 클릭
    const handleOpenConfirmModal = () => {

        // 간단 검증
        if (!formData.reason) {
            toast.error('신고 사유를 선택해주세요.', {
                duration: 1000
            });
            return;
        }

        if (!formData.reasonDetail) {
            toast.error('상세 내용을 작성해주세요.', {
                duration: 1000
            });
            return;
        }

        setIsConfirmModal(true);
    };

    // 실제 신고 처리
    const handleCreateReport = async () => {

        try {
            const payload: CreateReportRequest = {
                targetType: "LECTURE", // 일단 모듈 3에서는 고정
                targetId: 1, // 마찬가지
                reason: formData.reason,
                detail: formData.reasonDetail
            }

            const reportResponse = await CreateReportAction(payload);


            toast.success('신고 접수 성공', {
                duration: 1000
            });

            // 상태 초기화
            setFormData({
                reason: '',
                reasonDetail: '',
            });

            // 모달 닫기
            setIsConfirmModal(false);
            setIsModal(false);

        } catch (error) {

            const message =
                error instanceof Error
                    ? error.message.split('|')[1]
                    : '회원 상태 변경 실패';

            toast.error(message);
        }
    };

    return (
        <>
            <Dialog
                open={isModal}
                onOpenChange={setIsModal}
            >

                {triggerClassName ? (
                    <button
                        type="button"
                        className={triggerClassName}
                        onClick={() => setIsModal(true)}
                    >
                        {triggerLabel}
                    </button>
                ) : (
                    <Button
                        variant="destructive"
                        className="absolute right-5 bottom-5 w-12 text-xs"
                        onClick={() => setIsModal(true)}
                    >
                        {triggerLabel}
                    </Button>
                )}

                <DialogContent className="sm:max-w-sm">

                    <div>

                        <DialogHeader>

                            <DialogTitle
                                className="text-red-400 text-lg font-bold"
                            >
                                신고
                            </DialogTitle>

                            <DialogDescription
                                className="text-xs whitespace-pre-line text-slate-400 leading-5"
                            >
                                {`1. 해당 페이지에서 접수할 신고 사유를 작성해주세요.
2. 악성 유저에 대한 신고라면 해당 유저의 닉네임도 적어주세요.
3. 악성 게시글에 대한 신고라면 해당 게시글의 제목도 적어주세요.`}
                            </DialogDescription>

                        </DialogHeader>

                        <FieldGroup className="mt-4">

                            <Field>

                                <Select
                                    value={formData.reason}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            reason: value,
                                        }))}
                                >

                                    <SelectTrigger className="w-full max-w-48 cursor-pointer">
                                        <SelectValue placeholder="신고 사유를 선택해주세요." className="text-sm!" />
                                    </SelectTrigger>

                                    <SelectContent>

                                        <SelectGroup>

                                            <SelectLabel>
                                                신고 사유
                                            </SelectLabel>

                                            <SelectItem value="SPAM">
                                                홍보성 컨텐츠
                                            </SelectItem>

                                            <SelectItem value="ABUSE">
                                                도배성 컨텐츠
                                            </SelectItem>

                                            <SelectItem value="INAPPROPRIATE">
                                                부적절한 컨텐츠
                                            </SelectItem>

                                            <SelectItem value="OTHER">
                                                기타
                                            </SelectItem>

                                        </SelectGroup>

                                    </SelectContent>

                                </Select>

                            </Field>

                            <Field>

                                <Label htmlFor="reasonDetail">
                                    상세 내용
                                </Label>

                                <Input
                                    id="reasonDetail"
                                    placeholder="기타 사유 또는 닉네임 및 제목을 작성해주세요."
                                    className="text-xs!"
                                    value={formData.reasonDetail}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            reasonDetail: e.target.value,
                                        }))}
                                />

                            </Field>

                        </FieldGroup>

                        <DialogFooter className="mt-6">

                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    취소
                                </Button>
                            </DialogClose>

                            <Button
                                type="button"
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={handleOpenConfirmModal}
                            >
                                신고하기
                            </Button>

                        </DialogFooter>

                    </div>

                </DialogContent>

            </Dialog>

            {/* 최종 확인 모달 */}
            <TwoButtonModal
                open={isConfirmModal}
                onOpenChange={setIsConfirmModal}
                title="신고를 접수하시겠습니까?"
                description={`신고 후에는 취소할 수 없습니다.`}
                onConfirm={handleCreateReport}
            />
        </>
    );
}
