"use server";
import { auth, db, storage } from "@/firebase/admin";
import { cookies } from "next/headers";
const ONE_WEEK = 60 * 60 * 24 * 7;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function SignUp(prams: SignUpParams) {
  const { uid, name, email } = prams;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        error: "User already exists",
        success: false,
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
      photoURL: "/user-avatar.png", // Default avatar
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error: unknown) {
    console.log("error while creating a user", error);
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/email-already-in-use"
    ) {
      return {
        error: "Email already in use",
        success: false,
      };
    }

    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      success: false,
    };
  }
}

export async function SignIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to login",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // 7 days
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}

export async function SignOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return {
    success: true,
    message: "Logout successful",
  };
}

export async function updateUserProfile(uid: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const photo = formData.get("photo") as File | null;
    let photoURL: string | null = null;

    // Server-side file size validation
    if (photo && photo.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Image must be under 5MB",
      };
    }

    if (photo && photo.size > 0) {
      const bucket = storage.bucket();
      const fileName = `profile-pictures/${uid}-${Date.now()}`;
      const file = bucket.file(fileName);

      // Convert File to Buffer
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await file.save(buffer, {
        metadata: {
          contentType: photo.type,
        },
      });

      // Get public URL
      photoURL = await file
        .getSignedUrl({
          action: "read",
          expires: "03-09-2491", // Long expiration for profile pictures
        })
        .then((urls: string[]) => urls[0]);
    }

    const updateData: Partial<User> = { name };
    if (photoURL) {
      updateData.photoURL = photoURL;
    }

    await db.collection("users").doc(uid).update(updateData);

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error: unknown) {
    console.log("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
