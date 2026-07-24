"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editMyInfo } from "@/features/user/action";

export default function PasswordChangeMenuItem() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const passwordInvalid =
        password !== passwordConfirm
    const noInput = !currentPassword || !password || !passwordConfirm
    const buttonDisabled =
        isSubmitting || passwordInvalid || noInput

    const resetForm = () => {
        setCurrentPassword("");
        setPassword("");
        setPasswordConfirm("");
        setShowCurrentPassword(false);
        setShowPassword(false);
        setShowPasswordConfirm(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            resetForm();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedCurrentPassword = currentPassword.trim();
        const trimmedPassword = password.trim();
        const trimmedPasswordConfirm = passwordConfirm.trim();

        if (!trimmedCurrentPassword || !trimmedPassword || !trimmedPasswordConfirm) {
            toast.error("비밀번호 변경 정보를 모두 입력해주세요.");
            return;
        }

        if (trimmedPassword !== trimmedPasswordConfirm) {
            toast.error("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await editMyInfo({
                currentPassword: trimmedCurrentPassword,
                password: trimmedPassword,
            });

            if (res.status >= 200 && res.status < 300) {
                toast.success("비밀번호가 변경되었으니 다시 로그인해주세요.");
                handleOpenChange(false);
                router.push("/auth/login");
            } else {
                toast.error(res.message || "비밀번호 변경에 실패했습니다.");
            }
        } catch {
            toast.error("서버 통신 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <li className="cursor-pointer flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition hover:bg-slate-50 hover:text-slate-900">
                    <LockKeyhole className="h-3 w-3" />
                    비밀번호 변경
                </li>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[345px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="mb-6">비밀번호 변경</DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-3 flex-col">
                        <div className="space-y-1.5">
                            <Label htmlFor="currentPassword">현재 비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="pr-9"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword">새 비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-9"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="newPasswordConfirm">새 비밀번호 확인</Label>
                            <div className="relative">
                                <Input
                                    id="newPasswordConfirm"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="pr-9"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {passwordConfirm ? (
                                <p className={`pb-3 text-right text-xs font-bold ${passwordInvalid ? "text-red-500" : "text-emerald-500"}`}>
                                    {passwordInvalid ? "비밀번호가 일치하지 않습니다." : "비밀번호가 일치합니다."}
                                </p>
                            ) : <div className="h-4"></div>}
                        </div>
                    </div>

                    <DialogFooter className="items-center justify-center sm:justify-center">
                        <Button
                            type="submit" disabled={buttonDisabled}
                            className="w-1/3 min-w-28 cursor-pointer disabled:bg-indigo-400 bg-indigo-500 hover:bg-indigo-600"
                        >
                            {isSubmitting ? "변경 중..." : "비밀번호 변경"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
