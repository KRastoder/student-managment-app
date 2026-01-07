import { Router } from "express";
import type { Request, Response } from "express";
import registerCompany from "../services/company/companyRegisterService.ts";
import type { CompanyRegistrationInput } from "../types/types.ts";

const companyRouter: Router = Router();

companyRouter.post(
	"/register",
	async (req: Request<{}, {}, CompanyRegistrationInput>, res: Response) => {
		try {
			const { username, email, password, image, companyName, phoneNumber } =
				req.body;

			if (!username || !email || !password || !companyName || !phoneNumber) {
				return res.status(400).json({ message: "Required fields missing!" });
			}

			const result = await registerCompany({
				username,
				email,
				password,
				image,
				companyName,
				phoneNumber,
			});

			if (!result.success) {
				return res.status(400).json({
					message: result.error ?? "Registration failed",
					details: result.details,
				});
			}

			return res.status(201).json({
				message: "Company registered successfully",
				userId: result.userId,
			});
		} catch (err) {
			return res.status(500).json({ message: "Server error" });
		}
	},
);

export default companyRouter;
