CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"company_name" varchar(200) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"email" text NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "contract" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contract_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" text NOT NULL,
	"student_id" varchar(10) NOT NULL,
	"job_id" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"hourly_rate" integer NOT NULL,
	"hours_per_week" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "job_applications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"job_id" integer NOT NULL,
	"student_id" varchar(10) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "job_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_name" varchar(100) NOT NULL,
	"minimal_hourly_rate" integer NOT NULL,
	CONSTRAINT "job_categories_category_name_unique" UNIQUE("category_name")
);
--> statement-breakpoint
CREATE TABLE "job_postings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "job_postings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" text NOT NULL,
	"category_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"max_applicants" integer,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "student" (
	"index_number" varchar(10) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(100),
	"last_name" varchar(100),
	"year_of_enrollment" integer,
	"deleted_at" timestamp,
	CONSTRAINT "student_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "student_child_care" (
	"index_number" varchar(10) PRIMARY KEY NOT NULL,
	"how_many_children_max" smallint NOT NULL,
	"first_aid_training" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "student_languages" (
	"index_number" varchar(10) NOT NULL,
	"language" varchar(50) NOT NULL,
	CONSTRAINT "student_languages_index_number_language_pk" PRIMARY KEY("index_number","language")
);
--> statement-breakpoint
CREATE TABLE "student_physical_permit" (
	"index_number" varchar(10) PRIMARY KEY NOT NULL,
	"has_work_permit" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "student_translator" (
	"index_number" varchar(10) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_student_id_student_index_number_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_job_id_job_postings_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_job_postings_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_student_id_student_index_number_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_category_id_job_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."job_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_child_care" ADD CONSTRAINT "student_child_care_index_number_student_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_languages" ADD CONSTRAINT "student_languages_index_number_student_translator_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student_translator"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_physical_permit" ADD CONSTRAINT "student_physical_permit_index_number_student_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_translator" ADD CONSTRAINT "student_translator_index_number_student_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "contract_company_idx" ON "contract" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "contract_student_idx" ON "contract" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "contract_job_idx" ON "contract" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "contract_status_idx" ON "contract" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_applications_student_idx" ON "job_applications" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "job_applications_job_idx" ON "job_applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_applications_status_idx" ON "job_applications" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "job_applications_unique_idx" ON "job_applications" USING btree ("student_id","job_id");--> statement-breakpoint
CREATE INDEX "job_postings_company_idx" ON "job_postings" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "job_postings_category_idx" ON "job_postings" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");