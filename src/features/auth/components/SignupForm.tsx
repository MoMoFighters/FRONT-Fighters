// 'use client'

// import { momoStudentSignup } from "@/app/services/auth/service";
// import { Button } from "@/components/ui/button";
// import Router from "next/router";
// import { useActionState, useState } from "react";

// export default function SignupForm() {

//     //강사 여부
//     const [isTeacher, setIsTeacher] = useState(false)
//     //기능
//     const [emailValidationClicked, setEmailValidationClicked] = useState(false); //인증번호 받기 누를때 인증번호칸 뜨게하기
//     const [emailValidated, setEmailValidated] = useState(false); //인증완료 시 아래 글자뜨는거 
//     const [remainTime, setRemainTime] = useState("4:44") //시간 받아오기 -> 렌더링방식 고려 필요(ISR 1초로 해야할듯)
//     //스타일
//     const leftNavBarBgColor = isTeacher ? "bg-mauve-200" : "bg-mauve-500"
//     const rightNavBarBgColor = isTeacher ? "bg-mauve-500" : "bg-mauve-200"
//     const leftNavBarTextColor = isTeacher ? "text-black" : "text-white"
//     const rightNavBarTextColor = isTeacher ? "text-white" : "text-black"
//     const emailValidatedTextStyle = emailValidated ? "text-right mr-45" : "text-right mr-45 text-red-500"
//     const emailValidationInputStyle = emailValidated ? 'border border-black py-2 pl-2 flex-1 bg-gray-300' : 'border border-black py-2 pl-2 flex-1'

//     const [studentState, studentSignup, studentIsPending] = useActionState(momoStudentSignup, { success: false, message: "", errors: {} })
//     // const [teacherState, teacherSignup, teacherIsPending] = useActionState(momoTeacherSignup, { success: false, message: "", errors: {} })

//     return (
//         < >
//             <h1 className="text-center text-2xl font-bold">회원가입</h1>
//             <div className="grid grid-cols-2 ">
//                 <div
//                     className={`${leftNavBarBgColor} py-2 text-center cursor-pointer`}
//                     onClick={() => setIsTeacher(false)}
//                 >
//                     <p className={`${leftNavBarTextColor} font-bold`}>수강생</p>
//                 </div>
//                 <div
//                     className={`${rightNavBarBgColor} py-2 text-center cursor-pointer`}
//                     onClick={() => setIsTeacher(true)}
//                 >
//                     <p className={`${rightNavBarTextColor} font-bold`}>강사</p>
//                 </div>
//             </div>
//             <form
//                 // action={!isTeacher ? studentSignup : "teacherSignup"}
//                 action={studentSignup}
//                 className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-4 items-center w-full"
//             >
//                 <input
//                     type="hidden"
//                     name="role"
//                     value={isTeacher ? "teacher" : "student"}
//                 />
//                 <label className="text-right font-bold" htmlFor="name">
//                     이름
//                 </label>
//                 <input
//                     className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
//                     type="text"
//                     placeholder="이름"
//                     name="name"
//                     id='name'
//                     required
//                 />
//                 <label className="text-right font-bold" htmlFor="email">
//                     이메일
//                 </label>
//                 <div className="flex gap-2 min-w-0">
//                     <input
//                         className="border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
//                         type="email"
//                         placeholder="이메일"
//                         name="email"
//                         id="email"
//                         required
//                     />
//                     <Button
//                         type="button"
//                         className="shrink-0 bg-mauve-500 rounded-none h-10"
//                         onClick={() => setEmailValidationClicked(true)}
//                     >
//                         인증 요청
//                     </Button>
//                 </div>
//                 {emailValidationClicked && (
//                     <>
//                         <label className="text-right font-bold" htmlFor="validationCode">
//                             인증번호
//                         </label>
//                         <div className="flex flex-col gap-2 min-w-0">
//                             <div className="flex gap-2 min-w-0">
//                                 <input
//                                     className={`border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10
//                                     ${emailValidated ? "bg-gray-200" : ""}
//                                     [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
//                                     text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors`}
//                                     type="number"
//                                     placeholder="인증번호"
//                                     disabled={emailValidated}
//                                     name="validationCode"
//                                     id="validationCode"
//                                     required
//                                 />

//                                 <Button
//                                     type="button"
//                                     className="shrink-0 bg-mauve-500 rounded-none h-10"
//                                     disabled={emailValidated}
//                                 >
//                                     인증하기
//                                 </Button>

//                                 <Button
//                                     className="shrink-0 bg-mauve-300 text-slate-700 rounded-none h-10"
//                                     disabled={emailValidated}
//                                 >
//                                     재전송
//                                 </Button>
//                             </div>
//                             <p
//                                 className={`text-sm text-right ${emailValidated
//                                     ? "text-green-600"
//                                     : "text-red-500"
//                                     }`}
//                             >
//                                 {emailValidated
//                                     ? "이메일 인증이 완료되었습니다."
//                                     : `남은 시간 : ${remainTime}`}
//                             </p>
//                         </div>
//                     </>
//                 )}
//                 <label className="text-right font-bold" htmlFor="password">
//                     PW
//                 </label>
//                 <input
//                     className="border border-slate-300 py-2 px-2 min-w-0  h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
//                     type="password"
//                     placeholder="비밀번호"
//                     name="password"
//                     id="password"
//                     required
//                 />
//                 <label className="text-right font-bold" htmlFor="passwordCheck">
//                     PW 확인
//                 </label>
//                 <input
//                     className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
//                     type="password"
//                     placeholder="비밀번호 확인"
//                     name="passwordCheck"
//                     id="passwordCheck"
//                     required
//                 />
//                 {isTeacher && (
//                     <>
//                         <label className="text-right font-bold" htmlFor="category">
//                             희망 강의 분야
//                         </label>
//                         <select
//                             className="border border-slate-300 py-2 px-2 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
//                             name="category" id='category'
//                         >
//                             <option value="study">학문</option>
//                             <option value="art">예체능</option>
//                             <option value="health">헬스케어</option>
//                             <option value="beauty">뷰티</option>
//                             <option value="cook">요리</option>
//                         </select>
//                         <label className="text-right font-bold" htmlFor="proof">
//                             강사 인증 자료
//                         </label>
//                         <input
//                             type="file" id='proof' name='proof'
//                             className="border border-slate-300 py-2 px-3 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
//                         />
//                     </>
//                 )}
//                 <Button
//                     className="col-span-2 w-full py-6 mt-2 bg-mauve-500 rounded-none"
//                     disabled={!emailValidated}
//                 >
//                     <p className="font-bold text-[17px]">회원가입</p>
//                 </Button>
//             </form>
//         </>
//     )
// }



// 'use client'



// import { Button } from "@/components/ui/button";
// import {
//     useActionState,
//     useEffect,
//     useRef,
//     useState,
// } from "react";
// import { studentSignupAction, teacherSignupAction, verifyEmailAction } from "../action";

// export default function SignupForm() {

//     // 강사 여부
//     const [isTeacher, setIsTeacher] = useState(false);

//     // 이메일 인증 UI 노출 여부
//     const [
//         emailValidationClicked,
//         setEmailValidationClicked
//     ] = useState(false);

//     // 이메일 인증 완료 여부
//     const [
//         emailValidated,
//         setEmailValidated
//     ] = useState(false);

//     // 남은 시간
//     const [remainTime, setRemainTime] =
//         useState("4:44");

//     // 이메일 인증용 form ref
//     const verifyFormRef =
//         useRef<HTMLFormElement>(null);

//     // 이메일 인증 action
//     const [
//         verifyState,
//         verifyAction,
//         verifyPending
//     ] = useActionState(
//         verifyEmailAction,
//         {
//             success: false,
//             message: '',
//         }
//     );

//     // 학생 회원가입
//     const [
//         studentState,
//         studentSignup,
//         studentPending
//     ] = useActionState(
//         studentSignupAction,
//         {
//             success: false,
//             message: '',
//         }
//     );

//     // 강사 회원가입
//     const [
//         teacherState,
//         teacherSignup,
//         teacherPending
//     ] = useActionState(
//         teacherSignupAction,
//         {
//             success: false,
//             message: '',
//         }
//     );

//     // 이메일 인증 성공 처리
//     useEffect(() => {

//         if (verifyState.success) {
//             setEmailValidated(true);
//         }

//     }, [verifyState]);


//     // 스타일
//     const leftNavBarBgColor =
//         isTeacher
//             ? "bg-mauve-200"
//             : "bg-mauve-500";

//     const rightNavBarBgColor =
//         isTeacher
//             ? "bg-mauve-500"
//             : "bg-mauve-200";

//     const leftNavBarTextColor =
//         isTeacher
//             ? "text-black"
//             : "text-white";

//     const rightNavBarTextColor =
//         isTeacher
//             ? "text-white"
//             : "text-black";


//     return (
//         <>

//             <h1 className="text-center text-2xl font-bold mb-6">
//                 회원가입
//             </h1>

//             {/* 탭 */}
//             <div className="grid grid-cols-2 mb-8">

//                 <div
//                     className={`
//                         ${leftNavBarBgColor}
//                         py-3
//                         text-center
//                         cursor-pointer
//                     `}
//                     onClick={() =>
//                         setIsTeacher(false)
//                     }
//                 >
//                     <p className={`
//                         ${leftNavBarTextColor}
//                         font-bold
//                     `}>
//                         수강생
//                     </p>
//                 </div>

//                 <div
//                     className={`
//                         ${rightNavBarBgColor}
//                         py-3
//                         text-center
//                         cursor-pointer
//                     `}
//                     onClick={() =>
//                         setIsTeacher(true)
//                     }
//                 >
//                     <p className={`
//                         ${rightNavBarTextColor}
//                         font-bold
//                     `}>
//                         강사
//                     </p>
//                 </div>

//             </div>


//             {/* 회원가입 form */}
//             <form
//                 action={
//                     isTeacher
//                         ? teacherSignup
//                         : studentSignup
//                 }
//                 className="
//                     grid
//                     grid-cols-[110px_minmax(0,1fr)]
//                     gap-x-4
//                     gap-y-4
//                     items-center
//                     w-full
//                 "
//             >

//                 <input
//                     type="hidden"
//                     name="role"
//                     value={
//                         isTeacher
//                             ? 'teacher'
//                             : 'student'
//                     }
//                 />


//                 {/* 이름 */}
//                 <label
//                     className="text-right font-bold"
//                     htmlFor="name"
//                 >
//                     이름
//                 </label>

//                 <input
//                     className="
//                         border
//                         border-slate-300
//                         py-2
//                         px-2
//                         min-w-0
//                         h-10
//                         text-slate-700
//                         placeholder:text-slate-400
//                         focus:outline-none
//                         focus:border-slate-500
//                         transition-colors
//                     "
//                     type="text"
//                     placeholder="이름"
//                     name="name"
//                     id="name"
//                     required
//                 />


//                 {/* 이메일 */}
//                 <label
//                     className="text-right font-bold"
//                     htmlFor="email"
//                 >
//                     이메일
//                 </label>

//                 <div className="flex gap-2 min-w-0">

//                     <input
//                         className="
//                             border
//                             border-slate-300
//                             py-2
//                             px-2
//                             flex-1
//                             min-w-0
//                             h-10
//                             text-slate-700
//                             placeholder:text-slate-400
//                             focus:outline-none
//                             focus:border-slate-500
//                             transition-colors
//                         "
//                         type="email"
//                         placeholder="이메일"
//                         name="email"
//                         id="email"
//                         required
//                     />

//                     <Button
//                         type="button"
//                         className="
//                             shrink-0
//                             bg-mauve-500
//                             rounded-none
//                             h-10
//                         "
//                         onClick={() =>
//                             setEmailValidationClicked(true)
//                         }
//                     >
//                         인증 요청
//                     </Button>

//                 </div>


//                 {/* 이메일 인증 */}
//                 {emailValidationClicked && (
//                     <>

//                         <label
//                             className="
//                                 text-right
//                                 font-bold
//                             "
//                             htmlFor="validationCode"
//                         >
//                             인증번호
//                         </label>

//                         <div className="
//                             flex
//                             flex-col
//                             gap-2
//                             min-w-0
//                         ">

//                             <div className="
//                                 flex
//                                 gap-2
//                                 min-w-0
//                             ">

//                                 <input
//                                     className={`
//                                         border
//                                         border-slate-300
//                                         py-2
//                                         px-2
//                                         flex-1
//                                         min-w-0
//                                         h-10
//                                         text-slate-700
//                                         placeholder:text-slate-400
//                                         focus:outline-none
//                                         focus:border-slate-500
//                                         transition-colors
//                                         ${emailValidated
//                                             ? "bg-gray-200"
//                                             : ""
//                                         }
//                                     `}
//                                     type="number"
//                                     placeholder="인증번호"
//                                     disabled={emailValidated}
//                                     name="validationCode"
//                                     id="validationCode"
//                                     required
//                                 />

//                                 <Button
//                                     type="button"
//                                     className="
//         shrink-0
//         bg-mauve-500
//         rounded-none
//         h-10
//     "
//                                     disabled={
//                                         emailValidated ||
//                                         verifyPending
//                                     }
//                                     onClick={async () => {

//                                         const email = (
//                                             document.getElementById('email') as HTMLInputElement).value;

//                                         const validationCode = (
//                                             document.getElementById('validationCode') as HTMLInputElement).value;

//                                         const formData = new FormData();

//                                         formData.append(
//                                             'email',
//                                             email
//                                         );

//                                         formData.append(
//                                             'validationCode',
//                                             validationCode
//                                         );

//                                         await verifyAction(formData);
//                                     }}
//                                 >
//                                     인증하기
//                                 </Button>


//                                 <Button
//                                     type="button"
//                                     className="
//                                         shrink-0
//                                         bg-mauve-300
//                                         text-slate-700
//                                         rounded-none
//                                         h-10
//                                     "
//                                     disabled={emailValidated}
//                                 >
//                                     재전송
//                                 </Button>

//                             </div>

//                             <p
//                                 className={`
//                                     text-sm
//                                     text-right
//                                     ${emailValidated
//                                         ? "text-green-600"
//                                         : "text-red-500"
//                                     }
//                                 `}
//                             >
//                                 {
//                                     emailValidated
//                                         ? "이메일 인증이 완료되었습니다."
//                                         : `남은 시간 : ${remainTime}`
//                                 }
//                             </p>

//                             {
//                                 verifyState.message && (
//                                     <p className="
//                                         text-sm
//                                         text-right
//                                         text-red-500
//                                     ">
//                                         {
//                                             verifyState.message
//                                         }
//                                     </p>
//                                 )
//                             }

//                         </div>

//                     </>
//                 )}


//                 {/* 비밀번호 */}
//                 <label
//                     className="text-right font-bold"
//                     htmlFor="password"
//                 >
//                     PW
//                 </label>

//                 <input
//                     className="
//                         border
//                         border-slate-300
//                         py-2
//                         px-2
//                         min-w-0
//                         h-10
//                         text-slate-700
//                         placeholder:text-slate-400
//                         focus:outline-none
//                         focus:border-slate-500
//                         transition-colors
//                     "
//                     type="password"
//                     placeholder="비밀번호"
//                     name="password"
//                     id="password"
//                     required
//                 />


//                 {/* 비밀번호 확인 */}
//                 <label
//                     className="text-right font-bold"
//                     htmlFor="passwordCheck"
//                 >
//                     PW 확인
//                 </label>

//                 <input
//                     className="
//                         border
//                         border-slate-300
//                         py-2
//                         px-2
//                         min-w-0
//                         h-10
//                         text-slate-700
//                         placeholder:text-slate-400
//                         focus:outline-none
//                         focus:border-slate-500
//                         transition-colors
//                     "
//                     type="password"
//                     placeholder="비밀번호 확인"
//                     name="passwordCheck"
//                     id="passwordCheck"
//                     required
//                 />


//                 {/* 강사 전용 */}
//                 {isTeacher && (
//                     <>

//                         <label
//                             className="
//                                 text-right
//                                 font-bold
//                             "
//                             htmlFor="category"
//                         >
//                             희망 강의 분야
//                         </label>

//                         <select
//                             className="
//                                 border
//                                 border-slate-300
//                                 py-2
//                                 px-2
//                                 h-10
//                                 text-slate-700
//                                 focus:outline-none
//                                 focus:border-slate-500
//                                 transition-colors
//                             "
//                             name="category"
//                             id="category"
//                         >
//                             <option value="study">
//                                 학문
//                             </option>

//                             <option value="art">
//                                 예체능
//                             </option>

//                             <option value="health">
//                                 헬스케어
//                             </option>

//                             <option value="beauty">
//                                 뷰티
//                             </option>

//                             <option value="cook">
//                                 요리
//                             </option>
//                         </select>


//                         <label
//                             className="
//                                 text-right
//                                 font-bold
//                             "
//                             htmlFor="proof"
//                         >
//                             강사 인증 자료
//                         </label>

//                         <input
//                             type="file"
//                             id="proof"
//                             name="proof"
//                             className="
//                                 border
//                                 border-slate-300
//                                 py-2
//                                 px-3
//                                 h-10
//                                 text-slate-700
//                                 focus:outline-none
//                                 focus:border-slate-500
//                                 transition-colors
//                             "
//                         />

//                     </>
//                 )}


//                 {/* 회원가입 버튼 */}
//                 <Button
//                     className="
//                         col-span-2
//                         w-full
//                         py-6
//                         mt-2
//                         bg-mauve-500
//                         rounded-none
//                     "
//                     disabled={!emailValidated}
//                 >
//                     <p className="
//                         font-bold
//                         text-[17px]
//                     ">
//                         회원가입
//                     </p>
//                 </Button>

//             </form >

//         </>
//     );
// }*/








// 'use client';

// import { useState, useActionState } from "react";
// import { Button } from "@/components/ui/button";
// import { studentSignupAction, teacherSignupAction } from "../action";
// import EmailVerificationZone from "./EmailVarificationZone";

// export default function SignupForm() {
//     const [isTeacher, setIsTeacher] = useState(false);

//     // 부모 컴포넌트에서 인증 상태 일괄 관리
//     const [isEmailVerified, setIsEmailVerified] = useState(false);

//     // 회원가입용 Server Actions
//     const [studentState, studentFormAction, isStudentPending] = useActionState(studentSignupAction, null);
//     const [teacherState, teacherFormAction, isTeacherPending] = useActionState(teacherSignupAction, null);

//     const leftNavBarBgColor = isTeacher ? "bg-mauve-200" : "bg-mauve-500";
//     const rightNavBarBgColor = isTeacher ? "bg-mauve-500" : "bg-mauve-200";
//     const leftNavBarTextColor = isTeacher ? "text-black" : "text-white";
//     const rightNavBarTextColor = isTeacher ? "text-white" : "text-black";

//     return (
//         <div className="max-w-md mx-auto my-10 p-4 border border-slate-200">
//             <h1 className="text-center text-2xl font-bold mb-6">회원가입</h1>

//             {/* 수강생 / 강사 선택 탭 */}
//             <div className="grid grid-cols-2 mb-6">
//                 <div
//                     className={`${leftNavBarBgColor} py-2 text-center cursor-pointer transition-colors`}
//                     onClick={() => setIsTeacher(false)}
//                 >
//                     <p className={`${leftNavBarTextColor} font-bold`}>수강생</p>
//                 </div>
//                 <div
//                     className={`${rightNavBarBgColor} py-2 text-center cursor-pointer transition-colors`}
//                     onClick={() => setIsTeacher(true)}
//                 >
//                     <p className={`${rightNavBarTextColor} font-bold`}>강사</p>
//                 </div>
//             </div>

//             {/* 메인 폼 */}
//             <form
//                 action={isTeacher ? teacherFormAction : studentFormAction}
//                 className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-4 items-center w-full"
//             >
//                 {/* 폼 제출 시 필요한 정보들을 hidden 필드로 구성 */}
//                 <input type="hidden" name="role" value={isTeacher ? "teacher" : "student"} />

//                 {/* ★ 인증 완료 여부를 hidden 필드로 폼에 포함 (서버 검증용) */}
//                 <input type="hidden" name="emailVerified" value={String(isEmailVerified)} />

//                 {/* 이름 필드 */}
//                 <label className="text-right font-bold" htmlFor="name">이름</label>
//                 <input
//                     className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
//                     type="text"
//                     placeholder="이름"
//                     name="name"
//                     id="name"
//                     required
//                 />

//                 {/* ★ 이메일 인증 서브 컴포넌트 호출 (상태와 변경 함수를 직접 넘김) */}
//                 <EmailVerificationZone
//                     isEmailVerified={isEmailVerified}
//                     setIsEmailVerified={setIsEmailVerified}
//                 />

//                 {/* 비밀번호 필드 */}
//                 <label className="text-right font-bold" htmlFor="password">PW</label>
//                 <input
//                     className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
//                     type="password"
//                     placeholder="비밀번호"
//                     name="password"
//                     id="password"
//                     required
//                 />

//                 {/* 비밀번호 확인 필드 */}
//                 <label className="text-right font-bold" htmlFor="passwordCheck">PW 확인</label>
//                 <input
//                     className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
//                     type="password"
//                     placeholder="비밀번호 확인"
//                     name="passwordCheck"
//                     id="passwordCheck"
//                     required
//                 />

//                 {/* 강사 전용 추가 필드 */}
//                 {isTeacher && (
//                     <>
//                         <label className="text-right font-bold" htmlFor="category">희망 강의 분야</label>
//                         <select
//                             className="border border-slate-300 py-2 px-2 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
//                             name="category"
//                             id="category"
//                         >
//                             <option value="study">학문</option>
//                             <option value="art">예체능</option>
//                             <option value="health">헬스케어</option>
//                             <option value="beauty">뷰티</option>
//                             <option value="cook">요리</option>
//                         </select>

//                         <label className="text-right font-bold" htmlFor="proof">강사 인증 자료</label>
//                         <input
//                             type="file"
//                             id="proof"
//                             name="proof"
//                             className="border border-slate-300 py-2 px-3 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
//                         />
//                     </>
//                 )}

//                 {/* 가입 실패 시의 에러 안내 */}
//                 {((!isTeacher && studentState) || (isTeacher && teacherState)) && (
//                     <p className="col-span-2 text-center text-sm text-red-500 font-semibold">
//                         {isTeacher ? teacherState?.message : studentState?.message}
//                     </p>
//                 )}

//                 {/* 최종 가입 제출 버튼 - 이메일 인증이 완료되지 않으면 아예 비활성화(disabled) */}
//                 <Button
//                     type="submit"
//                     className="col-span-2 w-full py-6 mt-2 bg-mauve-500 rounded-none"
//                     disabled={!isEmailVerified || isStudentPending || isTeacherPending}
//                 >
//                     <p className="font-bold text-[17px]">
//                         {isStudentPending || isTeacherPending ? "가입 처리 중..." : "회원가입"}
//                     </p>
//                 </Button>
//             </form>
//         </div>
//     );
// }

'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { studentSignupAction, teacherSignupAction } from "../action";
import EmailVerificationZone from "./EmailVarificationZone";

export default function SignupForm() {
    const [isTeacher, setIsTeacher] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // 가입 완료 후 에러 및 로딩 처리를 위한 상태
    const [errorActionState, setErrorActionState] = useState<string | null>(null);
    const [isPending, startSignupTransition] = useTransition();


    // 폼 제출 핸들러 가로채기
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 기본 폼 제출(Form-Data 강제 전환) 동작 방지
        setErrorActionState(null);

        const currentForm = e.currentTarget;
        const formData = new FormData(currentForm);

        startSignupTransition(async () => {
            if (!isTeacher) {
                // 1. 수강생인 경우: 순수 JSON 객체로 변환하여 전송
                const studentJson = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    password: formData.get("password") as string,
                };

                const result = await studentSignupAction(studentJson);
                if (result && !result.success) {
                    setErrorActionState(result.message);
                }
            } else {
                // 2. 강사인의 경우: 파일이 있으므로 Form 타입(FormData) 그대로 전송
                // 필요 없는 passwordCheck 같은 데이터는 클린업해서 보내도 좋습니다.
                formData.delete("passwordCheck");

                const result = await teacherSignupAction(formData);
                if (result && !result.success) {
                    setErrorActionState(result.message);
                }
            }
        });
    };

    const leftNavBarBgColor = isTeacher ? "bg-mauve-200" : "bg-mauve-500";
    const rightNavBarBgColor = isTeacher ? "bg-mauve-500" : "bg-mauve-200";
    const leftNavBarTextColor = isTeacher ? "text-black" : "text-white";
    const rightNavBarTextColor = isTeacher ? "text-white" : "text-black";

    return (
        <div className="max-w-md mx-auto my-10 p-4 border border-slate-200">
            <h1 className="text-center text-2xl font-bold mb-6">회원가입</h1>

            {/* 수강생 / 강사 탭 */}
            <div className="grid grid-cols-2 mb-6">
                <div
                    className={`${leftNavBarBgColor} py-2 text-center cursor-pointer transition-colors`}
                    onClick={() => setIsTeacher(false)}
                >
                    <p className={`${leftNavBarTextColor} font-bold`}>수강생</p>
                </div>
                <div
                    className={`${rightNavBarBgColor} py-2 text-center cursor-pointer transition-colors`}
                    onClick={() => setIsTeacher(true)}
                >
                    <p className={`${rightNavBarTextColor} font-bold`}>강사</p>
                </div>
            </div>

            {/* 메인 폼 onSubmit으로 변경 */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-4 gap-y-4 items-center w-full"
            >
                {/* 이름 필드 */}
                <label className="text-right font-bold" htmlFor="name">이름</label>
                <input
                    className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
                    type="text"
                    placeholder="이름"
                    name="name"
                    id="name"
                    required
                />

                {/* 이메일 인증 영역 */}
                <EmailVerificationZone
                    isEmailVerified={isEmailVerified}
                    setIsEmailVerified={setIsEmailVerified}
                />

                {/* 비밀번호 필드 */}
                <label className="text-right font-bold" htmlFor="password">PW</label>
                <input
                    className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    id="password"
                    required
                />

                {/* 비밀번호 확인 필드 */}
                <label className="text-right font-bold" htmlFor="passwordCheck">PW 확인</label>
                <input
                    className="border border-slate-300 py-2 px-2 min-w-0 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
                    type="password"
                    placeholder="비밀번호 확인"
                    name="passwordCheck"
                    id="passwordCheck"
                    required
                />

                {/* 강사 전용 필드 */}
                {isTeacher && (
                    <>
                        <label className="text-right font-bold" htmlFor="category">희망 강의 분야</label>
                        <select
                            className="border border-slate-300 py-2 px-2 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
                            name="category"
                            id="category"
                        >
                            <option value="study">학문</option>
                            <option value="art">예체능</option>
                            <option value="health">헬스케어</option>
                            <option value="beauty">뷰티</option>
                            <option value="cook">요리</option>
                        </select>

                        <label className="text-right font-bold" htmlFor="proof">강사 인증 자료</label>
                        <input
                            type="file"
                            id="proof"
                            name="proof"
                            className="border border-slate-300 py-2 px-3 h-10 text-slate-700 focus:outline-none focus:border-slate-500 transition-colors"
                        />
                    </>
                )}

                {/* 에러 메시지 출력 */}
                {errorActionState && (
                    <p className="col-span-2 text-center text-sm text-red-500 font-semibold">
                        {errorActionState}
                    </p>
                )}

                {/* 최종 회원가입 버튼 */}
                <Button
                    type="submit"
                    className="col-span-2 w-full py-6 mt-2 bg-mauve-500 rounded-none"
                    disabled={!isEmailVerified || isPending}
                >
                    <p className="font-bold text-[17px]">
                        {isPending ? "가입 처리 중..." : "회원가입"}
                    </p>
                </Button>
            </form>
        </div>
    );
}