CREATE TABLE "book_series" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer,
	"series_id" integer,
	"position_in_series" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer,
	"tag_id" integer
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"cover" text,
	"genres" text[],
	"page_count" integer,
	"publication_year" integer,
	"isbn" text,
	"shelf" text DEFAULT 'tbr' NOT NULL,
	"date_added" timestamp DEFAULT now(),
	"date_started" timestamp,
	"date_completed" timestamp,
	"current_page" integer DEFAULT 0,
	"rating" real,
	"review" text,
	"dnf_page" integer,
	"dnf_reason" text
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"target_books" integer NOT NULL,
	"books_read" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "reading_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer,
	"date" timestamp DEFAULT now(),
	"pages_read" integer NOT NULL,
	"current_page_after" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"total_books" integer
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text
);
--> statement-breakpoint
ALTER TABLE "book_series" ADD CONSTRAINT "book_series_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_series" ADD CONSTRAINT "book_series_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_tags" ADD CONSTRAINT "book_tags_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_tags" ADD CONSTRAINT "book_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;