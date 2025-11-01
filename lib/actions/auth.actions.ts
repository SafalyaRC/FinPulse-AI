"use server";

import { success } from "better-auth";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import { sendWelcomeEmail } from "../nodemailer";

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
      // Send welcome email directly
      await sendWelcomeEmail({
        email,
        name: fullName,
        intro: `
          <p class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
            Welcome to FinPulse-AI! We're excited to help you stay on top of market movements and make informed investment decisions. Your account is now ready with the following preferences:
            <br><br>
            • Investment Goals: ${investmentGoals}
            <br>
            • Risk Tolerance: ${riskTolerance}
            <br>
            • Preferred Industry: ${preferredIndustry}
          </p>
        `,
      });
    } catch (emailError) {
      // Log but don't fail signup if email fails
      console.error("Failed to send welcome email:", emailError);
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
