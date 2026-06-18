import SignupForm from "@/features/auth/components/SignupForm";

export default function Signup() {
    return (
        <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-4 py-10">
            <div className="p-4 flex flex-col gap-4 justify-center align-middle mx-auto">
                <SignupForm />
            </div>
        </div>
    );
}
