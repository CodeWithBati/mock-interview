"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
const ONE_WEEK = 60 * 60 * 24 * 7;

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
    });
  } catch (error: any) {
    console.log("error while creating a user", error);
    if (error.code === "auth/email-already-in-use") {
      return {
        error: "Email already in use",
        success: false,
      };
    }

    return {
      error: error.message,
      success: false,
    };
  }
}

export async function SignIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    



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
