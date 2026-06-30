import { AuthForm } from "@/features/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-10">
      <AuthForm mode="signup" />
    </main>
  );
}
