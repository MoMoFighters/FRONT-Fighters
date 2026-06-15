'use client';

import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { studentSignupAction, teacherSignupAction, sendEmailCodeAction, verifyEmailAction } from "../action";

export default function SignupForm() {
    const [isTeacher, setIsTeacher] = useState(false);

    // 기능 및 인증 상태 제어
    const [email, setEmail] = useState("");
    const [validationCode, setValidationCode] = useState("");
    const [emailValidationClicked, setEmailValidationClicked] = useState(false);
    const [emailValidated, setEmailValidated] = useState(false);

    // 실시간 초 단위 카운트다운 상태 관리
    const [timeLeft, setTimeLeft] = useState(0);

    // 🔴 이메일 필드 전용 하단 에러 및 안내 텍스트 상태
    const [emailError, setEmailError] = useState<string | null>(null);

    // 회원가입 서버 상태 및 트랜지션 처리
    const [errorActionState, setErrorActionState] = useState<string | null>(null);
    const [isPending, startSignupTransition] = useTransition();
    const [isEmailPending, startEmailTransition] = useTransition();

    // 비밀번호 토글 상태 조작
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    // 스타일 토글 변수
    const leftBgColor = isTeacher ? "bg-slate-200" : "bg-slate-400";
    const rightBgColor = isTeacher ? "bg-slate-400" : "bg-slate-200";
    const leftTextColor = isTeacher ? "text-slate-900" : "text-slate-50";
    const rightTextColor = isTeacher ? "text-slate-50" : "text-slate-900";

    // ⏳ 실시간 카운트다운 효과(Effect) 구동
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

    // 초 단위를 분:초(MM:SS) 형태로 변환해 주는 포매터
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // 1. 인증번호 발송 요청 함수 (백엔드 200 OK / 400 / 500 규격 완벽 대응)
    const handleRequestCode = () => {
        setEmailError(null);

        if (!email) {
            setEmailError("이메일을 입력해 주세요.");
            return;
        }

        // 프론트엔드 1차 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("올바른 이메일 형식이 아닙니다. 다시 확인해 주세요.");
            return;
        }

        setErrorActionState(null);
        startEmailTransition(async () => {
            try {
                // Server Action 호출
                const result = await sendEmailCodeAction(email);

                // 🔗 [연결 핵심] 백엔드 Response 구조 매핑
                if (result.status >= 200 && result.status < 300) {
                    setEmailValidationClicked(true);

                    // ✅ 200 OK 구조 데이터 접근: result.data.expiresIn (안전하게 내차 대안값 180 적용)
                    const serverExpiresIn = result.data?.expiresIn || 180;
                    setTimeLeft(serverExpiresIn);

                    // 성공 안내 문구를 이메일 하단에 표기 (인증 코드가 이메일로 전송되었습니다.)
                    setEmailError(result?.message || "인증 코드가 이메일로 전송되었습니다.");
                } else {
                    // ❌ 실패 분기 처리 (400 중복, 400 형식오류, 500 서버에러)
                    if (result?.message) {
                        // 실패 2 케이스 처리: 중첩 객체 내부 메시지 파싱
                        setEmailError(result.message);
                    } else {
                        // 실패 1, 3 케이스 처리: 일반 message 속성 파싱
                        setEmailError(result?.message || "인증번호 발송 실패. 다시 시도해 주세요.");
                    }
                }
            } catch (err) {
                setEmailError("이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }
        });
    };

    // 2. 인증번호 검증 완료 요청 함수
    const handleVerifyCode = () => {
        setEmailError(null);

        if (!validationCode) {
            setErrorActionState("인증번호를 입력해 주세요.");
            return;
        }

        setErrorActionState(null);
        startEmailTransition(async () => {
            try {
                const result = await verifyEmailAction(email, validationCode);

                if (result.status >= 200 && result.status < 300) {
                    setTimeLeft(0);
                    setEmailValidated(true);
                } else {
                    setErrorActionState(result?.message || "인증번호가 일치하지 않거나 만료되었습니다.");
                }
            } catch (err) {
                setErrorActionState("인증 처리 중 서버 에러가 발생했습니다.");
            }
        });
    };

    // 3. 최종 회원가입 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!emailValidated) {
            setEmailError("이메일 인증을 먼저 완료해 주세요.");
            return;
        }


        setErrorActionState(null);
        const currentForm = e.currentTarget;
        const formData = new FormData(currentForm);

        startSignupTransition(async () => {
            if (!isTeacher) {
                const studentJson = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                };

                const result = await studentSignupAction(studentJson);
                if (result && (result.status < 200 || result.status >= 300)) {
                    setErrorActionState(result.message);
                }
            } else {
                formData.delete("passwordCheck");
                formData.delete("validationCode");

                const result = await teacherSignupAction(formData);
                if (result && (result.status < 200 || result.status >= 300)) {
                    setErrorActionState(result.message);
                }
            }
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="text-center text-2xl font-bold">회원가입</h1>

            {/* 수강생 / 강사 탭 */}
            <div className="grid grid-cols-2">
                <div
                    className={`${leftBgColor} py-2 text-center cursor-pointer`}
                    onClick={() => setIsTeacher(false)}
                >
                    <p className={`${leftTextColor} font-bold`}>수강생</p>
                </div>
                <div
                    className={`${rightBgColor} py-2 text-center cursor-pointer`}
                    onClick={() => setIsTeacher(true)}
                >
                    <p className={`${rightTextColor} font-bold`}>강사</p>
                </div>
            </div>

            {/* 레이아웃 폼 */}
            <form onSubmit={handleSubmit} className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-4 items-center w-full">
                <input type="hidden" name="role" value={isTeacher ? "teacher" : "student"} />

                {/* 이름 필드 */}
                <label className="text-right font-bold text-slate-700" htmlFor="name">이름</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="border border-slate-300 py-2 px-2 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
                    placeholder="이름"
                />

                {/* 이메일 필드 */}
                <label className="text-right font-bold text-slate-700" htmlFor="email">이메일</label>
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
                                if (emailError) setEmailError(null);
                            }}
                            readOnly={emailValidated}
                            className="border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors disabled:bg-slate-100"
                            placeholder="이메일"
                        />
                        <Button
                            type="button"
                            disabled={emailValidated || isEmailPending}
                            className="shrink-0 bg-mauve-500 rounded-none h-10 cursor-pointer disabled:opacity-50"
                            onClick={handleRequestCode}
                        >
                            {emailValidationClicked ? "재전송" : "인증 요청"}
                        </Button>
                    </div>
                    {/* 이메일 컴포넌트 하단 텍스트 피드백 (성공 메시지/에러 메시지 통합 출력) */}
                    {emailError && (
                        <p className={`text-sm font-medium pl-1 mt-0.5 ${emailValidationClicked && !emailError.includes("실패") && !emailError.includes("형식") ? "text-green-600" : "text-red-500"}`}>
                            {emailError}
                        </p>
                    )}
                </div>

                {/* 인증번호 확인 필드 및 타이머 렌더링 구역 */}
                {emailValidationClicked && (
                    <>
                        <label className="text-right font-bold text-slate-700" htmlFor="validationCode">인증번호</label>
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
                                    className="shrink-0 bg-mauve-500 rounded-none h-10 cursor-pointer disabled:opacity-50"
                                    onClick={handleVerifyCode}
                                >
                                    인증하기
                                </Button>
                            </div>
                            {/* ⏳ 백엔드에서 내려준 데이터 기반 실시간 타임아웃 출력 */}
                            <p className={`text-sm text-right pr-2 ${emailValidated ? "text-green-600" : "text-red-500"}`}>
                                {emailValidated
                                    ? "이메일 인증이 완료되었습니다."
                                    : timeLeft > 0
                                        ? `남은 시간 : ${formatTime(timeLeft)}`
                                        : "인증 시간이 만료되었습니다."
                                }
                            </p>
                        </div>
                    </>
                )}

                {/* 비밀번호 필드 */}
                <label className="text-right font-bold text-slate-700" htmlFor="password">PW</label>
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        required
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

                {/* 비밀번호 확인 필드 */}
                <label className="text-right font-bold text-slate-700" htmlFor="passwordCheck">PW 확인</label>
                <div className="relative w-full">
                    <input
                        type={showPasswordCheck ? "text" : "password"}
                        name="passwordCheck"
                        id="passwordCheck"
                        required
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

                {/* 강사 전용 세션 */}
                {isTeacher && (
                    <>
                        <label className="text-right font-bold text-slate-700" htmlFor="category">희망 강의 분야</label>
                        <select
                            name="category"
                            id="category"
                            className="border border-slate-300 py-2 px-2 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors bg-white"
                        >
                            <option value="STUDY">학문</option>
                            <option value="ART">예체능</option>
                            <option value="FITNESS">헬스케어</option>
                            <option value="BEAUTY">뷰티</option>
                            <option value="COOK">요리</option>
                        </select>

                        <label className="text-right font-bold text-slate-700" htmlFor="proof">강사 인증 자료</label>
                        <input
                            type="file"
                            id="proof"
                            name="proof"
                            // required
                            className="border border-slate-300 py-1.5 px-2 h-10 text-sm text-slate-700 focus:outline-none focus:border-slate-500 transition-colors file:mr-4 file:py-0 file:px-2 file:rounded-none file:border-0 file:text-sm file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
                        />
                    </>
                )}

                {/* 백엔드 오류 피드백 */}
                {errorActionState && (
                    <div className="col-span-2 text-center text-sm text-red-500 font-semibold mt-1">
                        {errorActionState}
                    </div>
                )}

                {/* 회원가입 버튼 */}
                <Button
                    type="submit"
                    className="col-span-2 w-full py-6 mt-2 bg-mauve-500 rounded-none cursor-pointer"
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
