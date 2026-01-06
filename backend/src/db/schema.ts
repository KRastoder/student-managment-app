import { relations } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, smallint, text, timestamp, varchar,primaryKey } from "drizzle-orm/pg-core";


export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
    role : text("role").default('user'),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
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
			.$onUpdate(() => /* @__PURE__ */ new Date())
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
			.$onUpdate(() => /* @__PURE__ */ new Date())
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
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
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



export const student = pgTable("student", {
    indexNumber: varchar("index_number", { length: 10 }).primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 40 }),
    lastName: varchar("last_name", { length: 40 }),
    yearOfEnrollment: integer("year_of_enrollment"),
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
        language: varchar("language").notNull()
    },
    (table) => [
        primaryKey({ columns: [table.indexNumber, table.language] })
    ]
);


export const studentRelations = relations(student, ({ one }) => ({
    user: one(user, { fields: [student.userId], references: [user.id] }),
    physical: one(studentPhysicalPermit),
    childCare: one(studentChildCare),
    translator: one(studentTranslator),
}));

export const studentTranslatorRelations = relations(studentTranslator, ({ one, many }) => ({
    student: one(student, {
        fields: [studentTranslator.indexNumber],
        references: [student.indexNumber],
    }),
    languages: many(studentLanguages),
}));

export const studentLanguagesRelations = relations(studentLanguages, ({ one }) => ({
    translator: one(studentTranslator, {
        fields: [studentLanguages.indexNumber],
        references: [studentTranslator.indexNumber],
    }),
}));


