"use server";

import { success } from "better-auth";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (!response) {
      throw new Error("No response from authentication server");
    }

    try {
      // Try to send Inngest event but don't block signup if it fails
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    } catch (inngestError) {
      // Log but don't fail the signup
      console.warn("Failed to send user creation event:", inngestError);
    }

    return { success: true, data: response };
  } catch (error) {
    console.error("Signup failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Sign up failed";
    return { success: false, error: errorMessage };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
    });
    return { success: true, data: response };
  } catch (error) {
    console.log("Sign-in failed", error);
    return { success: false, error: "Sign-in failed" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.log("Sign out failed", error);
    return { success: false, error: "Sign out failed" };
  }
};
