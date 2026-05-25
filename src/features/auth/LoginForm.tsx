import { Button } from "@/components/ui/button";

export default function LoginForm() {
    const nothingInFieldError = '';

    return (
        <form action="" className="flex flex-col gap-4">
            <input
                type="email"
                name="email"
                className="border border-slate-300 py-2 px-2"
                placeholder="이메일 입력"
            />
            <div className="max-w-md">
                <input
                    type="password"
                    name="password"
                    className="border border-slate-300 py-2 px-2 w-full"
                    placeholder="비밀번호 입력"
                />
                {nothingInFieldError ? (<p className="text-right mr-2 text-red-600 font-medium">{nothingInFieldError}</p>) : ("")}
            </div>
            <Button variant="default" className="w-auto py-6 cursor-pointer">로그인</Button>
        </form>
    );
}