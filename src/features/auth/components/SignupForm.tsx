'use client';

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    sendEmailCodeAction,
    studentSignupAction,
    verifyEmailAction,
} from "../action";

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
            })();
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="text-center text-2xl font-bold">회원가입</h1>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-4 items-center w-full"
            >
                <label className="text-right font-bold text-slate-700" htmlFor="name">
                    이름
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-slate-300 py-2 px-2 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                    placeholder="이름"
                />

                <label className="text-right font-bold text-slate-700" htmlFor="email">
                    이메일
                </label>
                <div className="flex flex-col gap-1.5 w-full min-w-0">
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
                            className="border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors disabled:bg-slate-100"
                            placeholder="이메일"
                        />
                        <Button
                            type="button"
                            disabled={emailValidated || isEmailPending}
                            className="shrink-0 bg-indigo-500 rounded-none h-10 cursor-pointer disabled:opacity-50"
                            onClick={handleRequestCode}
                        >
                            {emailValidationClicked ? "재전송" : "인증 요청"}
                        </Button>
                    </div>

                    {emailError && (
                        <p
                            className={`text-sm font-medium pl-1 mt-0.5 ${emailValidationClicked &&
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
                    <>
                        <label className="text-right font-bold text-slate-700" htmlFor="validationCode">
                            인증번호
                        </label>
                        <div className="flex flex-col gap-2 min-w-0">
                            <div className="flex gap-2 min-w-0">
                                <input
                                    type="number"
                                    name="validationCode"
                                    id="validationCode"
                                    required={!emailValidated}
                                    disabled={emailValidated || timeLeft === 0}
                                    value={validationCode}
                                    onChange={(e) => setValidationCode(e.target.value)}
                                    className={`border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10 
                                        ${emailValidated ? "bg-slate-200 text-slate-400" : "text-slate-700"} 
                                        [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none 
                                        placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors`}
                                    placeholder="인증번호"
                                />
                                <Button
                                    type="button"
                                    disabled={emailValidated || isEmailPending || timeLeft === 0}
                                    className="shrink-0 bg-indigo-500 rounded-none h-10 cursor-pointer disabled:opacity-50"
                                    onClick={handleVerifyCode}
                                >
                                    인증하기
                                </Button>
                            </div>

                            <p className={`text-sm text-right pr-2 ${emailValidated ? "text-green-600" : "text-red-500"}`}>
                                {emailValidated
                                    ? "이메일 인증이 완료되었습니다."
                                    : timeLeft > 0
                                        ? `남은 시간 : ${formatTime(timeLeft)}`
                                        : "인증 시간이 만료되었습니다."}
                            </p>
                        </div>
                    </>
                )}

                <label className="text-right font-bold text-slate-700" htmlFor="password">
                    PW
                </label>
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-slate-300 py-2 px-2 w-full pr-10 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
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

                <label className="text-right font-bold text-slate-700" htmlFor="passwordCheck">
                    PW 확인
                </label>
                <div className="relative w-full">
                    <input
                        type={showPasswordCheck ? "text" : "password"}
                        name="passwordCheck"
                        id="passwordCheck"
                        required
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        className="border border-slate-300 py-2 px-2 w-full pr-10 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
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
                    <div className="col-span-2 text-center text-sm text-red-500 font-semibold mt-1">
                        {errorActionState}
                    </div>
                )}

                <Button
                    type="submit"
                    className="col-span-2 w-full py-6 mt-2 bg-indigo-500 rounded-none cursor-pointer"
                    disabled={!emailValidated || isPending}
                >
                    <p className="font-bold text-[17px]">
                        {isPending ? "가입 처리 중..." : "회원가입"}
                    </p>
                </Button>
            </form>
        </div>
    );
}
