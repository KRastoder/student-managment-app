import { Router } from "express";
import type { Request, Response } from "express";
import registerStudent from "../services/student/studentRegisterService.ts";
import type { StudentRegistrationInput } from "../types/types.ts";

const studentRouter: Router = Router();

studentRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      image,
      name,
      lastName,
      indexNumber,
      yearOfEnrollment,
    }: StudentRegistrationInput = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !name ||
      !lastName ||
      !indexNumber ||
      !yearOfEnrollment
    ) {
      return res.status(400).json({ message: "Required fields missing!" });
    }

    const result = await registerStudent({
      username,
      email,
      password,
      image,
      name,
      lastname: lastName,
      indexNumber,
      yearOfEnrollment,
    });

    if (!result.success) {
      return res.status(400).json({
        message: result.error ?? "Registration failed",
        details: result.details,
      });
    }

    return res.status(201).json({
      message: "Student registered successfully",
      userId: result.userId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default studentRouter;
