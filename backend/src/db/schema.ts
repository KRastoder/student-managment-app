import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, smallint, text, timestamp, varchar, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	role: text("role", { enum: ['user', 'student', 'company'] }).default('user').notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const student = pgTable("student", {
	indexNumber: varchar("index_number", { length: 10 }).primaryKey(),
	userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 100 }),
	lastName: varchar("last_name", { length: 100 }),
	yearOfEnrollment: integer("year_of_enrollment"),
	deletedAt: timestamp("deleted_at"),
});

export const studentPhysicalPermit = pgTable("student_physical_permit", {
	indexNumber: varchar("index_number", { length: 10 })
		.primaryKey()
		.references(() => student.indexNumber, { onDelete: "cascade" }),
	hasWorkPermit: boolean("has_work_permit").default(false)
});

export const studentChildCare = pgTable("student_child_care", {
	indexNumber: varchar("index_number", { length: 10 })
		.primaryKey()
		.references(() => student.indexNumber, { onDelete: "cascade" }),
	howManyChildrenMax: smallint("how_many_children_max").notNull(),
	firstAidTraining: boolean("first_aid_training").default(false)
});

export const studentTranslator = pgTable("student_translator", {
	indexNumber: varchar("index_number", { length: 10 })
		.primaryKey()
		.references(() => student.indexNumber, { onDelete: "cascade" }),
});

export const studentLanguages = pgTable(
	"student_languages",
	{
		indexNumber: varchar("index_number", { length: 10 })
			.notNull()
			.references(() => studentTranslator.indexNumber, { onDelete: "cascade" }),
		language: varchar("language", { length: 50 }).notNull()
	},
	(table) => [
		primaryKey({ columns: [table.indexNumber, table.language] })
	]
);

export const company = pgTable("company", {
	id: text("id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
	companyName: varchar("company_name", { length: 200 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
	email: text("email").notNull().references(() => user.email, { onDelete: "cascade" }),
	deletedAt: timestamp("deleted_at"),
});

export const jobCategories = pgTable("job_categories", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	categoryName: varchar("category_name", { length: 100 }).notNull().unique(),
	minimalHourlyRate: integer("minimal_hourly_rate").notNull()
});

export const jobPostings = pgTable("job_postings", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	companyId: text("company_id").notNull().references(() => company.id, { onDelete: "cascade" }),
	categoryId: integer("category_id").notNull().references(() => jobCategories.id, { onDelete: "restrict" }),
	title: varchar("title", { length: 200 }).notNull(),
	description: text("description").notNull(),
	maxApplicants: integer("max_applicants"),
	expiresAt: timestamp("expires_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	index("job_postings_company_idx").on(table.companyId),
	index("job_postings_category_idx").on(table.categoryId),
]);

export const jobApplications = pgTable("job_applications", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	jobId: integer("job_id").notNull().references(() => jobPostings.id, { onDelete: "cascade" }),
	studentId: varchar("student_id", { length: 10 }).notNull().references(() => student.indexNumber, { onDelete: "cascade" }),
	status: text("status", { enum: ['pending', 'accepted', 'rejected', 'withdrawn'] }).default('pending').notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
}, (table) => [
	index("job_applications_student_idx").on(table.studentId),
	index("job_applications_job_idx").on(table.jobId),
	index("job_applications_status_idx").on(table.status),
	uniqueIndex("job_applications_unique_idx").on(table.studentId, table.jobId),
]);

export const contract = pgTable("contract", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	companyId: text("company_id").notNull().references(() => company.id, { onDelete: "cascade" }),
	studentId: varchar("student_id", { length: 10 }).notNull().references(() => student.indexNumber, { onDelete: "cascade" }),
	jobId: integer("job_id").notNull().references(() => jobPostings.id, { onDelete: "cascade" }),
	status: text("status", { enum: ['pending', 'active', 'completed', 'cancelled'] }).default('pending').notNull(),
	startDate: timestamp("start_date"),
	endDate: timestamp("end_date"),
	hourlyRate: integer("hourly_rate").notNull(),
	hoursPerWeek: integer("hours_per_week"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	deletedAt: timestamp("deleted_at"),
}, (table) => [
	index("contract_company_idx").on(table.companyId),
	index("contract_student_idx").on(table.studentId),
	index("contract_job_idx").on(table.jobId),
	index("contract_status_idx").on(table.status),
]);

export const userRelations = relations(user, ({ one, many }) => ({
	sessions: many(session),
	accounts: many(account),
	student: one(student, {
		fields: [user.id],
		references: [student.userId]
	}),
	company: one(company, {
		fields: [user.id],
		references: [company.id]
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const studentRelations = relations(student, ({ one, many }) => ({
	user: one(user, {
		fields: [student.userId],
		references: [user.id]
	}),
	physical: one(studentPhysicalPermit, {
		fields: [student.indexNumber],
		references: [studentPhysicalPermit.indexNumber]
	}),
	childCare: one(studentChildCare, {
		fields: [student.indexNumber],
		references: [studentChildCare.indexNumber]
	}),
	translator: one(studentTranslator, {
		fields: [student.indexNumber],
		references: [studentTranslator.indexNumber]
	}),
	jobApplications: many(jobApplications),
	contracts: many(contract),
}));

export const studentPhysicalPermitRelations = relations(studentPhysicalPermit, ({ one }) => ({
	student: one(student, {
		fields: [studentPhysicalPermit.indexNumber],
		references: [student.indexNumber]
	}),
}));

export const studentChildCareRelations = relations(studentChildCare, ({ one }) => ({
	student: one(student, {
		fields: [studentChildCare.indexNumber],
		references: [student.indexNumber]
	}),
}));

export const studentTranslatorRelations = relations(studentTranslator, ({ one, many }) => ({
	student: one(student, {
		fields: [studentTranslator.indexNumber],
		references: [student.indexNumber]
	}),
	languages: many(studentLanguages),
}));

export const studentLanguagesRelations = relations(studentLanguages, ({ one }) => ({
	translator: one(studentTranslator, {
		fields: [studentLanguages.indexNumber],
		references: [studentTranslator.indexNumber]
	}),
}));

export const companyRelations = relations(company, ({ one, many }) => ({
	user: one(user, {
		fields: [company.id],
		references: [user.id]
	}),
	jobPostings: many(jobPostings),
	contracts: many(contract),
}));

export const jobCategoriesRelations = relations(jobCategories, ({ many }) => ({
	jobPostings: many(jobPostings),
}));

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
	company: one(company, {
		fields: [jobPostings.companyId],
		references: [company.id]
	}),
	category: one(jobCategories, {
		fields: [jobPostings.categoryId],
		references: [jobCategories.id]
	}),
	applications: many(jobApplications),
	contracts: many(contract),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
	student: one(student, {
		fields: [jobApplications.studentId],
		references: [student.indexNumber]
	}),
	jobPosting: one(jobPostings, {
		fields: [jobApplications.jobId],
		references: [jobPostings.id]
	}),
}));

export const contractRelations = relations(contract, ({ one }) => ({
	student: one(student, {
		fields: [contract.studentId],
		references: [student.indexNumber]
	}),
	company: one(company, {
		fields: [contract.companyId],
		references: [company.id]
	}),
	jobPosting: one(jobPostings, {
		fields: [contract.jobId],
		references: [jobPostings.id]
	}),
}));