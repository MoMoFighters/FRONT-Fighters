import AuthPageShell from "@/features/auth/components/AuthPageShell";
import SignupForm from "@/features/auth/components/SignupForm";

export default function Signup() {
    return (
        <AuthPageShell
            title="모모시티 회원가입"
            description="간단한 계정 생성 후 강의를 둘러보고 나만의 도시를 세워보세요."
            compact
        >
            <SignupForm />
        </AuthPageShell>
    );
}
