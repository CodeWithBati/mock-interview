"use server";

import { getCurrentUser } from "@/lib/actions/auth.actions";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import ProfileDropdown from "./ProfileDropdown";

export default async function Navbar() {
  const user = await getCurrentUser();

  // Since "/" is protected, user should always be authenticated
  // If user is null (edge case), redirect will handle it in layout/page
  return (
    <nav className="flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={38} height={32} />
        <h2 className="text-primary-100">PrepWise</h2>
      </Link>
      {user && (
        <ProfileDropdown
          photoURL={"/user-avatar.png"}
          email={user.email || "User"}
        />
      )}
    </nav>
  );
}
