"use server";

import { getCurrentUser } from "@/lib/actions/auth.actions";
import Image from "next/image";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold text-primary-100 mb-6">Your Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={user.photoURL || "/user-avatar.png"}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full object-cover size-[80px]"
          />
          <div>
            <h2 className="text-lg font-semibold">{user.name || "User"}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
