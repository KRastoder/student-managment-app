import { auth } from "../../../auth.ts";
import { db } from "../../index.ts";
import { company } from "../../db/schema.ts";
import type { CompanyRegistrationInput } from "../../types/types.ts";

interface RegisterCompanyResponse {
	success: boolean;
	userId?: string;
	error?: string;
	details?: unknown;
}

const registerCompany = async ({
	username,
	email,
	password,
	image,
	companyName,
	phoneNumber,
}: CompanyRegistrationInput): Promise<RegisterCompanyResponse> => {
	try {
		if (!email || !password || !companyName || !phoneNumber) {
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

		if (phoneNumber.length > 20) {
			return {
				success: false,
				error: "Phone number must be 20 characters or less",
			};
		}

		const authResponse = await auth.api.signUpEmail({
			body: {
				name: username,
				email,
				password,
				image,
				role: "company",
			},
		});

		if (!authResponse?.user?.id) {
			return {
				success: false,
				error: "Failed to create user account",
			};
		}

		const companyRecord = await db
			.insert(company)
			.values({
				id: authResponse.user.id,
				companyName,
				phoneNumber,
				email,
			})
			.returning();

		if (!companyRecord.length) {
			return {
				success: false,
				error: "Failed to create company record",
			};
		}

		return {
			success: true,
			userId: authResponse.user.id,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				error: error.message,
				details: error,
			};
		}

		return {
			success: false,
			error: "Unexpected error",
			details: error,
		};
	}
};

export default registerCompany;
