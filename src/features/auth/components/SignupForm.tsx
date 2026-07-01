'use client';

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    sendEmailCodeAction,
    studentSignupAction,
    verifyEmailAction,
} from "../action";
import Link from "next/link";
import Image from "next/image";
import logo from '@/app/assets/img/logo.png'
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
                redirect("/auth/login")
            })();
        });
    };

    const labelClassName =
        "absolute right-[calc(100%+1rem)] top-1/2 -translate-y-1/2 whitespace-nowrap text-right font-bold text-slate-700 cursor-pointer";
    const inputClassName =
        "h-10 w-full border border-slate-300 px-2 py-2 text-[15px] text-slate-700 placeholder:text-slate-400 transition-colors focus:border-slate-500 focus:outline-none";

    return (
        <div className="flex flex-col gap-4 mt-10">
            <div className="flex justify-center mb-4">
                <Image src={logo} width={160} alt="MOMOCITY 로고" priority />
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto flex w-90 flex-col gap-4"
            >
                <div className="relative">
                    <label className={labelClassName} htmlFor="name">
                        이름
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClassName}
                        placeholder="이름"
                    />
                </div>

                <div className="relative flex flex-col gap-1.5">
                    <label className={labelClassName} htmlFor="email">
                        이메일
                    </label>
                    <div className="flex gap-2 w-full min-w-0">
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
                            className={`${inputClassName} min-w-0 flex-1 disabled:bg-slate-100`}
                            placeholder="이메일"
                        />
                        <Button
                            type="button"
                            disabled={emailValidated || isEmailPending}
                            className="h-10 shrink-0 rounded-none bg-indigo-500 hover:bg-indigo-600 px-4 text-[15px] font-bold cursor-pointer disabled:opacity-50"
                            onClick={handleRequestCode}
                        >
                            {emailValidationClicked ? "재전송" : "인증 요청"}
                        </Button>
                    </div>

                    {emailError && (
                        <p
                            className={`text-xs font-medium pl-1 mt-0.5 ${emailValidationClicked &&
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
                    <div className="relative flex flex-col gap-2">
                        <label className={labelClassName} htmlFor="validationCode">
                            인증번호
                        </label>
                        <div className="flex gap-2 min-w-0">
                            <input
                                type="number"
                                name="validationCode"
                                id="validationCode"
                                required={!emailValidated}
                                disabled={emailValidated || timeLeft === 0}
                                value={validationCode}
                                onChange={(e) => setValidationCode(e.target.value)}
                                className={`${inputClassName} min-w-0 flex-1
                                        ${emailValidated ? "bg-slate-200 text-slate-400" : "text-slate-700"} 
                                        [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                                    `}
                                placeholder="인증번호"
                            />
                            <Button
                                type="button"
                                disabled={emailValidated || isEmailPending || timeLeft === 0}
                                className="h-10 shrink-0 rounded-none bg-indigo-500 px-4 text-[15px] font-bold cursor-pointer disabled:opacity-50"
                                onClick={handleVerifyCode}
                            >
                                인증하기
                            </Button>
                        </div>

                        <p className={`text-xs text-right pr-2 ${emailValidated ? "text-green-600" : "text-red-500"}`}>
                            {emailValidated
                                ? "이메일 인증이 완료되었습니다."
                                : timeLeft > 0
                                    ? `남은 시간 : ${formatTime(timeLeft)}`
                                    : "인증 시간이 만료되었습니다."}
                        </p>
                    </div>
                )}

                <div className="relative">
                    <label className={labelClassName} htmlFor="password">
                        PW
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClassName} pr-10`}
                        placeholder="비밀번호"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="relative">
                    <label className={labelClassName} htmlFor="passwordCheck">
                        PW 확인
                    </label>
                    <input
                        type={showPasswordCheck ? "text" : "password"}
                        name="passwordCheck"
                        id="passwordCheck"
                        required
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        className={`${inputClassName} pr-10`}
                        placeholder="비밀번호 확인"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswordCheck((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
                    >
                        {showPasswordCheck ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {errorActionState && (
                    <div className="text-center text-sm text-red-500 font-semibold mt-1">
                        {errorActionState}
                    </div>
                )}

                <Button
                    type="submit"
                    className="mt-2 w-full rounded-none bg-indigo-500 py-5 cursor-pointer"
                    disabled={!emailValidated || isPending}
                >
                    <p className="font-bold text-[16px]">
                        {isPending ? "가입 처리 중..." : "회원가입"}
                    </p>
                </Button>
                <div className="flex flex-row justify-center gap-7 mb-10">
                    <Link href='/auth/login'>
                        <button
                            type="button"
                            className="cursor-pointer text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
                        >
                            로그인 페이지로 돌아가기
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
