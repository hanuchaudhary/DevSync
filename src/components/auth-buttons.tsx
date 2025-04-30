"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();
  const handleSignin = async () => {
    await signIn("github");
    router.push("/swipe");
  };
  return (
    <Button onClick={handleSignin} className="flex cursor-pointer gap-2">
      <Github size={18} />
      Sign in with GitHub
    </Button>
  );
}

export function LogoutButton() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <Button
      onClick={() => signOut()}
      variant="outline"
      className="flex gap-2 cursor-pointer"
    >
      <LogOut size={18} />
      Sign Out
    </Button>
  );
}
