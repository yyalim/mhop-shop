import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {session ? `Welcome back, ${session.name}!` : "Welcome to Shop"}
        </h1>
        <p className="mt-3 text-gray-600">
          {session
            ? "You are signed in."
            : "Sign in or create an account to get started."}
        </p>
      </div>
    </main>
  );
}
