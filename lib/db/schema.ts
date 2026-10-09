import {
  pgTable,
  text,
  integer,
  real,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

// Books table — stores every book you add
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  cover: text("cover"),
  genres: text("genres").array(),
  pageCount: integer("page_count"),
  publicationYear: integer("publication_year"),
  isbn: text("isbn"),
  shelf: text("shelf").notNull().default("tbr"),
  // shelf can be: tbr, reading, read, wishlist, dnf
  dateAdded: timestamp("date_added").defaultNow(),
  dateStarted: timestamp("date_started"),
  dateCompleted: timestamp("date_completed"),
  currentPage: integer("current_page").default(0),
  rating: real("rating"),
  review: text("review"),
  dnfPage: integer("dnf_page"),
  dnfReason: text("dnf_reason"),
});

// Series table — stores series information
export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  totalBooks: integer("total_books"),
});

// Book series junction — links books to series
export const bookSeries = pgTable("book_series", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => books.id, {
    onDelete: "cascade",
  }),
  seriesId: integer("series_id").references(() => series.id, {
    onDelete: "cascade",
  }),
  positionInSeries: integer("position_in_series").notNull(),
});

// Reading sessions table — logs every time you update progress
export const readingSessions = pgTable("reading_sessions", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => books.id, {
    onDelete: "cascade",
  }),
  date: timestamp("date").defaultNow(),
  pagesRead: integer("pages_read").notNull(),
  currentPageAfter: integer("current_page_after").notNull(),
});

// Goals table — stores your annual reading goals
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  targetBooks: integer("target_books").notNull(),
  booksRead: integer("books_read").default(0),
});

// Tags table — your custom tags like cozy read, gifted etc
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color"),
});

// Book tags junction — links tags to books
export const bookTags = pgTable("book_tags", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => books.id, {
    onDelete: "cascade",
  }),
  tagId: integer("tag_id").references(() => tags.id, {
    onDelete: "cascade",
  }),
});

// App settings — small key/value pairs, e.g. the secret guest-link token
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
