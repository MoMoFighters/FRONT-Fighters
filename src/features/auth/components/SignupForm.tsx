'use client';

import { BadgeCheck, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    sendEmailCodeAction,
    studentSignupAction,
    verifyEmailAction,
} from "../action";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [validationCode, setValidationCode] = useState("");
    const [emailValidationClicked, setEmailValidationClicked] = useState(false);
    const [emailValidated, setEmailValidated] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [errorActionState, setErrorActionState] = useState<string | null>(null);
    const [isPending, startSignupTransition] = useTransition();
    const [isEmailPending, startEmailTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0 || emailValidated) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, emailValidated]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleRequestCode = () => {
        setEmailError(null);
        setErrorActionState(null);

        if (!email) {
            setEmailError("이메일을 입력해 주세요.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setEmailError("올바른 이메일 형식이 아닙니다. 다시 확인해 주세요.");
            return;
        }

        startEmailTransition(() => {
            void (async () => {
                try {
                    const result = await sendEmailCodeAction(email);

                    if (result.status >= 200 && result.status < 300) {
                        setEmailValidationClicked(true);
                        setTimeLeft(result.data?.expiresIn || 180);
                        setEmailError(result.message || "인증 코드가 이메일로 전송되었습니다.");
                        return;
                    }

                    setEmailError(result.message || "인증번호 발송에 실패했습니다.");
                } catch {
                    setEmailError("이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                }
            })();
        });
    };

    const handleVerifyCode = () => {
        setEmailError(null);
        setErrorActionState(null);

        if (!validationCode) {
            setErrorActionState("인증번호를 입력해 주세요.");
            return;
        }

        startEmailTransition(() => {
            void (async () => {
                try {
                    const result = await verifyEmailAction(email, validationCode);

                    if (result.status >= 200 && result.status < 300) {
                        setTimeLeft(0);
                        setEmailValidated(true);
                        setErrorActionState(null);
                        return;
                    }

                    setErrorActionState(result.message || "인증번호가 일치하지 않거나 만료되었습니다.");
                } catch {
                    setErrorActionState("인증 처리 중 서버 오류가 발생했습니다.");
                }
            })();
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailError(null);
        setErrorActionState(null);

        if (!emailValidated) {
            setEmailError("이메일 인증을 먼저 완료해 주세요.");
            return;
        }

        if (!name.trim()) {
            setErrorActionState("이름을 입력해 주세요.");
            return;
        }

        if (!password) {
            setErrorActionState("비밀번호를 입력해 주세요.");
            return;
        }

        if (password !== passwordCheck) {
            setErrorActionState("비밀번호가 일치하지 않습니다.");
            return;
        }

        startSignupTransition(() => {
            void (async () => {
                const result = await studentSignupAction({
                    email,
                    password,
                    name,
                });

                if (result && (result.status < 200 || result.status >= 300)) {
                    setErrorActionState(result.message);
                }
                redirect("/auth/login");
            })();
        });
    };

    const labelClassName = "text-[13px] font-bold text-slate-950";
    const inputClassName =
        "h-[50px] w-full rounded-md border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-3 focus:ring-indigo-50";

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-full flex-col gap-3.5"
        >
            <div className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="name">
                    이름
                </label>
                <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${inputClassName} pl-11 pr-4`}
                        placeholder="이름을 입력해 주세요"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="email">
                    이메일
                </label>
                <div className="flex w-full min-w-0 gap-2">
                    <div className="relative min-w-0 flex-1">
                        <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300" />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailValidated(false);
                                setEmailValidationClicked(false);
                                setValidationCode("");
                                setTimeLeft(0);
                                if (emailError) setEmailError(null);
                            }}
                            readOnly={emailValidated}
                            className={`${inputClassName} pl-11 pr-4 disabled:bg-slate-100`}
                            placeholder="이메일을 입력해 주세요"
                        />
                    </div>
                    <Button
                        type="button"
                        disabled={emailValidated || isEmailPending}
                        className="h-[50px] shrink-0 cursor-pointer rounded-md border border-indigo-200 bg-white px-4 text-[13px] font-bold text-indigo-500 hover:bg-indigo-50 disabled:opacity-50"
                        onClick={handleRequestCode}
                    >
                        {emailValidationClicked ? "재전송" : "인증 요청"}
                    </Button>
                </div>

                {emailError && (
                    <p
                        className={`mt-0.5 pl-1 text-xs font-medium ${emailValidationClicked &&
                            !emailError.includes("실패") &&
                            !emailError.includes("형식")
                            ? "text-green-600"
                            : "text-red-500"
                            }`}
                    >
                        {emailError}
                    </p>
                )}
            </div>

            {emailValidationClicked && (
                <div className="flex flex-col gap-2">
                    <label className={labelClassName} htmlFor="validationCode">
                        인증번호
                    </label>
                    <div className="flex min-w-0 gap-2">
                        <div className="relative min-w-0 flex-1">
                            <BadgeCheck className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300" />
                            <input
                                type="number"
                                name="validationCode"
                                id="validationCode"
                                required={!emailValidated}
                                disabled={emailValidated || timeLeft === 0}
                                value={validationCode}
                                onChange={(e) => setValidationCode(e.target.value)}
                                className={`${inputClassName} pl-11 pr-4 ${emailValidated ? "bg-slate-200 text-slate-400" : "text-slate-700"} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                placeholder="인증번호"
                            />
                        </div>
                        <Button
                            type="button"
                            disabled={emailValidated || isEmailPending || timeLeft === 0}
                            className="h-[50px] shrink-0 cursor-pointer rounded-md border border-indigo-200 bg-white px-4 text-[13px] font-bold text-indigo-500 hover:bg-indigo-50 disabled:opacity-50"
                            onClick={handleVerifyCode}
                        >
                            인증하기
                        </Button>
                    </div>

                    <p className={`pr-2 text-right text-xs ${emailValidated ? "text-green-600" : "text-red-500"}`}>
                        {emailValidated
                            ? "이메일 인증이 완료되었습니다."
                            : timeLeft > 0
                                ? `남은 시간 : ${formatTime(timeLeft)}`
                                : "인증 시간이 만료되었습니다."}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="password">
                    비밀번호
                </label>
                <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClassName} pl-11 pr-12`}
                        placeholder="영문, 숫자, 특수문자 포함 8~20자"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className={labelClassName} htmlFor="passwordCheck">
                    비밀번호 확인
                </label>
                <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300" />
                    <input
                        type={showPasswordCheck ? "text" : "password"}
                        name="passwordCheck"
                        id="passwordCheck"
                        required
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        className={`${inputClassName} pl-11 pr-12`}
                        placeholder="비밀번호를 확인해 주세요"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswordCheck((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showPasswordCheck ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
                    >
                        {showPasswordCheck ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            {errorActionState && (
                <div className="mt-1 text-center text-sm font-bold text-red-500">
                    {errorActionState}
                </div>
            )}

            <Button
                type="submit"
                className="mt-1.5 h-[50px] w-full cursor-pointer rounded-md bg-indigo-500 text-base font-bold text-white hover:bg-indigo-600 disabled:bg-slate-300"
                disabled={!emailValidated || isPending}
            >
                {isPending ? "가입 처리 중..." : "회원가입"}
            </Button>

            <div className="flex items-center justify-center gap-3 text-[13px] font-bold text-slate-500">
                <Link
                    href="/"
                    className="transition-colors hover:text-indigo-500"
                >
                    홈
                </Link>
                <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
                <Link
                    href="/auth/login"
                    className="transition-colors hover:text-indigo-500"
                >
                    로그인
                </Link>
            </div>
        </form>
    );
}
