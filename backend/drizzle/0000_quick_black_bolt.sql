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
	"name" varchar(40),
	"last_name" varchar(40),
	"year_of_enrollment" integer
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
	"language" varchar NOT NULL,
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
	"role" text DEFAULT 'user',
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
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_child_care" ADD CONSTRAINT "student_child_care_index_number_student_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_languages" ADD CONSTRAINT "student_languages_index_number_student_translator_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student_translator"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_physical_permit" ADD CONSTRAINT "student_physical_permit_index_number_student_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_translator" ADD CONSTRAINT "student_translator_index_number_student_index_number_fk" FOREIGN KEY ("index_number") REFERENCES "public"."student"("index_number") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");