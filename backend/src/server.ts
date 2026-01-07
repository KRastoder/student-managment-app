import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth.ts";
import studentRouter from "./routes/studentRouter.ts";
import companyRouter from "./routes/companyRouter.ts";

const app = express();
const PORT = 3000;
const authHandler = toNodeHandler(auth);

app.use(express.json());
app.use("/api/student", studentRouter);
app.use("/company", companyRouter);

app.use("/api/auth/", (req, res) => {
	return authHandler(req, res);
});

app.listen(PORT, () => {
	console.log(`Server running on PORT:${PORT}`);
});
