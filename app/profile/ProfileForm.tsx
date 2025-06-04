"use client";

import { useState } from "react";
import { updateUserProfile } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file && file.size > MAX_FILE_SIZE) {
      toast.error("Image must be under 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("photo", file);
      }

      const result = await updateUserProfile(user.id, formData);
      if (result.success) {
        toast.success("Profile updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border text-gray-900 border-gray-300 rounded-md p-2 focus:ring-primary-100 focus:border-primary-100"
          required
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email (read-only)
        </label>
        <input
          type="email"
          id="email"
          value={user.email || ""}
          disabled
          className="mt-1 block w-full border text-gray-800 border-gray-300 rounded-md p-2 bg-gray-100"
        />
      </div>
      <div>
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-700"
        >
          Profile Picture
        </label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-100 file:text-white hover:file:bg-primary-200"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary-100 hover:bg-primary-200 text-white py-2 px-4 rounded-md transition"
      >
        Update Profile
      </button>
    </form>
  );
}
