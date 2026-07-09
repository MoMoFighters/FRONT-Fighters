import SignupForm from "@/features/auth/components/SignupForm";

export default function Signup() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="flex flex-col justify-center gap-4 p-4">
                <SignupForm />
            </div>
        </div>
    );
}
