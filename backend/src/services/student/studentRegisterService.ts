import { auth } from "../../../auth.ts";
import { db } from "../../index.ts";
import { student } from "../../db/schema.ts";

interface RegisterStudentInput {
  username: string;
  email: string;
  password: string;
  image?: string;
  name: string;
  lastname: string;
  indexNumber: string;
  yearOfEnrollment: number;
}

interface RegisterStudentResponse {
  success: boolean;
  userId?: string;
  error?: string;
  details?: unknown;
}

const registerStudent = async ({
  username,
  email,
  password,
  image,
  name,
  lastname,
  indexNumber,
  yearOfEnrollment,
}: RegisterStudentInput): Promise<RegisterStudentResponse> => {
  try {
    if (!email || !password || !name || !lastname || !indexNumber) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    if (indexNumber.length > 10) {
      return {
        success: false,
        error: "Index number must be 10 characters or less",
      };
    }

    const authResponse = await auth.api.signUpEmail({
      body: {
        name: username,
        email: email,
        password: password,
        image: image,
        role: "student",
      },
    });

    if (!authResponse || !authResponse.user || !authResponse.user.id) {
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    const studentRecord = await db
      .insert(student)
      .values({
        userId: authResponse.user.id,
        name: name,
        lastName: lastname,
        indexNumber: indexNumber,
        yearOfEnrollment: yearOfEnrollment,
      })
      .returning();

    if (!studentRecord || studentRecord.length === 0) {
      return {
        success: false,
        error: "Failed to create student record",
      };
    }

    return {
      success: true,
      userId: authResponse.user.id,
    };
  } catch (error) {
    console.error("Error registering student:", error);

    if (error instanceof Error) {
      if (error.message.includes("duplicate") || error.message.includes("already exists")) {
        return {
          success: false,
          error: "Email or index number already exists",
        };
      }

      if (error.message.includes("Invalid email")) {
        return {
          success: false,
          error: "Invalid email address",
        };
      }

      return {
        success: false,
        error: error.message,
        details: error,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred during registration",
      details: error,
    };
  }
};

export default registerStudent;
