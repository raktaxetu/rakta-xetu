import { Header } from "@/components/shared/header";
import { auth } from "@/lib/auth";
import { PusherProvider } from "@/pusher-provider";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: Children) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.isUser) {
    redirect("/onboarding");
  }
  return (
    <PusherProvider>
      <section className="h-screen min-h-screen flex flex-col max-w-4xl mx-auto">
        <Header />
        <div className="p-4 flex-1 min-h-0">{children}</div>
      </section>
    </PusherProvider>
  );
}
