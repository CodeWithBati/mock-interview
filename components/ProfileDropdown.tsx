"use client";

import { useState } from "react";
import { SignOut } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ProfileDropdownProps {
  photoURL: string;
  email: string;
}

export default function ProfileDropdown({
  photoURL,
  email,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await SignOut();
    router.push("/sign-in");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
        aria-label="User menu"
      >
        <Image
          src={photoURL}
          alt="user avatar"
          width={120}
          height={120}
          className="rounded-full object-cover size-[40px]"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-2 z-10">
          <Link
            href="/profile"
            className="block px-4 py-2 text-white hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            User Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
