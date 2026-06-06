import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/site-shell";

export default function LoginPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AuthForm />
      </section>
    </PageShell>
  );
}
