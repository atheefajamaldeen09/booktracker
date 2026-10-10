"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSpineColors, fallbackColor } from "@/components/bookshelf/spineColors";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

/* ─────────────── shared bits ─────────────── */

const axisTick = { fill: "var(--text-faint)", fontSize: 12 };
const gridStroke = "var(--border-soft)";

export function ChartCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        padding: "20px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        <div>
          <h2 style={{ color: "var(--text)", fontSize: "18px", fontWeight: 600, margin: 0 }}>{title}</h2>
          {subtitle && (
            <p style={{ color: "var(--text-faint)", fontSize: "13px", margin: "4px 0 0 0" }}>{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string | number;
  unit: [string, string];
}) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0].value ?? 0);
  return (
    <div
      style={{
        backgroundColor: "var(--raised)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "8px 12px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "0 0 2px 0" }}>{label}</p>
      <p style={{ color: "var(--text)", fontSize: "14px", fontWeight: 600, margin: 0 }}>
        {value.toLocaleString()} {value === 1 ? unit[0] : unit[1]}
      </p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div
      style={{
        height: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "var(--text-faint)",
        fontSize: "14px",
        border: "1px dashed var(--border)",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      {message}
    </div>
  );
}

/* ─────────────── books per month ─────────────── */

export function BooksPerMonthChart({
  years,
  data,
  noMonth,
}: {
  years: number[];
  data: Record<number, { month: string; books: number }[]>;
  // Books finished that year in a month you don't remember
  noMonth: Record<number, number>;
}) {
  const [year, setYear] = useState(years[0]);
  const months = data[year] ?? [];
  const unplaced = noMonth[year] ?? 0;
  const total = months.reduce((sum, m) => sum + m.books, 0) + unplaced;

  return (
    <ChartCard
      title="Books per month"
      subtitle={`${total} ${total === 1 ? "book" : "books"} finished in ${year}${
        unplaced ? ` · ${unplaced} in an unknown month` : ""
      }`}
      action={
        years.length > 1 && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {years.slice(0, 6).map((y) => {
              const active = y === year;
              return (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  aria-pressed={active}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                    backgroundColor: active ? "var(--primary)" : "transparent",
                    color: active ? "var(--on-primary)" : "var(--text-muted)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {y}
                </button>
              );
            })}
          </div>
        )
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={months} margin={{ top: 20, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={gridStroke} />
          <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} interval={0} fontSize={11} />
          <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "var(--raised)", opacity: 0.6 }}
            content={<ChartTooltip unit={["book", "books"]} />}
          />
          <Bar dataKey="books" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={36}>
            <LabelList
              dataKey="books"
              position="top"
              style={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}
              formatter={(v: unknown) => (Number(v) > 0 ? String(v) : "")}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ─────────────── books per year ─────────────── */

export function BooksPerYearChart({ data }: { data: { year: string; books: number }[] }) {
  const hasData = data.some((d) => d.books > 0);
  return (
    <ChartCard title="Books per year" subtitle="Every year you've tracked">
      {!hasData ? (
        <EmptyChart message="Finish a book and your first year will show up here." />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 20, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={gridStroke} />
            <XAxis dataKey="year" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "var(--raised)", opacity: 0.6 }}
              content={<ChartTooltip unit={["book", "books"]} />}
            />
            <Bar dataKey="books" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={48}>
              <LabelList
                dataKey="books"
                position="top"
                style={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

/* ─────────────── pages over time ─────────────── */

export function PagesOverTimeChart({ data }: { data: { month: string; pages: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.pages, 0);
  return (
    <ChartCard title="Pages read" subtitle={`${total.toLocaleString()} pages in the last 12 months`}>
      {total === 0 ? (
        <EmptyChart message="Update your reading progress to start filling this in." />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="pages-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={gridStroke} />
            <XAxis
              dataKey="month"
              tick={{ ...axisTick, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={8}
            />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ stroke: "var(--text-faint)", strokeDasharray: "3 3" }}
              content={<ChartTooltip unit={["page", "pages"]} />}
            />
            <Area
              type="monotone"
              dataKey="pages"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#pages-fill)"
              dot={false}
              activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--surface)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

/* ─────────────── horizontal bar list (genres, shelves) ─────────────── */

export function BarList({
  title,
  subtitle,
  items,
  empty,
  color = "var(--primary)",
}: {
  title: string;
  subtitle?: string;
  items: { label: string; value: number; href?: string }[];
  empty: string;
  color?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ChartCard title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <EmptyChart message={empty} />
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item) => {
            const row = (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    fontSize: "14px",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontWeight: 600, flexShrink: 0 }}>{item.value}</span>
                </div>
                <div
                  style={{
                    height: "8px",
                    borderRadius: "9999px",
                    backgroundColor: "var(--raised)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.value / max) * 100}%`,
                      minWidth: item.value > 0 ? "8px" : 0,
                      height: "100%",
                      borderRadius: "9999px",
                      backgroundColor: color,
                    }}
                  />
                </div>
              </>
            );
            return (
              <li key={item.label}>
                {item.href ? (
                  <Link href={item.href} style={{ display: "block", textDecoration: "none" }}>
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      )}
    </ChartCard>
  );
}

/* ─────────────── most read authors ─────────────── */

export function AuthorList({ authors }: { authors: { name: string; books: number; avgRating: number | null }[] }) {
  return (
    <ChartCard title="Most read authors" subtitle="The voices you keep coming back to">
      {authors.length === 0 ? (
        <EmptyChart message="Your favourite authors will appear once you've finished a few books." />
      ) : (
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {authors.map((a, i) => (
            <li
              key={a.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "12px",
                backgroundColor: i === 0 ? "var(--raised)" : "transparent",
                border: `1px solid ${i === 0 ? "var(--border)" : "transparent"}`,
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: i === 0 ? "var(--primary)" : "var(--raised)",
                  color: i === 0 ? "var(--on-primary)" : "var(--text-muted)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {i + 1}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    color: "var(--text)",
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.name}
                </p>
                <p style={{ color: "var(--text-faint)", fontSize: "12px", margin: "2px 0 0 0" }}>
                  {a.books} {a.books === 1 ? "book" : "books"}
                  {a.avgRating !== null && (
                    <>
                      {" "}· <span style={{ color: "var(--star)" }}>★</span> {a.avgRating.toFixed(1)} avg
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </ChartCard>
  );
}

/* ─────────────── reading streak & calendar ─────────────── */

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CELL = 11;
const GAP = 3;

const CALENDAR_MODE_KEY = "reading-calendar-mode";

type CalendarDay = { date: string; pages: number; bookId: number | null };

// A year of reading as a calendar: one column per week, one square per day.
// Each square takes the colour of the book you read most that day (or, in the
// "Pages" look, gets darker the more pages you read). It opens scrolled to the
// most recent weeks.
export function StreakCard({
  current,
  longest,
  activeDays,
  books,
}: {
  current: number;
  longest: number;
  activeDays: CalendarDay[];
  books: { id: number; title: string; cover: string | null }[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const [mode, setMode] = useState<"covers" | "pages">("covers");
  useEffect(() => {
    try {
      // The remembered look can only be read once we're in the browser
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(CALENDAR_MODE_KEY) === "pages") setMode("pages");
    } catch {}
  }, []);
  const changeMode = (next: "covers" | "pages") => {
    setMode(next);
    try {
      localStorage.setItem(CALENDAR_MODE_KEY, next);
    } catch {}
  };
  const [selected, setSelected] = useState<string | null>(null);

  const bookById = new Map(books.map((b) => [b.id, b]));
  const spineColors = useSpineColors(books.map((b) => b.cover));
  const colorOf = (bookId: number | null) => {
    const book = bookId !== null ? bookById.get(bookId) : undefined;
    if (!book) return null;
    return ((book.cover && spineColors[book.cover]) || fallbackColor(book.title)).spine;
  };

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < activeDays.length; i += 7) weeks.push(activeDays.slice(i, i + 7));
  const maxPages = Math.max(1, ...activeDays.map((d) => d.pages));
  const daysRead = activeDays.filter((d) => d.pages > 0).length;
  const thisYear = activeDays.length ? activeDays[activeDays.length - 1].date.slice(0, 4) : "";
  const daysThisYear = activeDays.filter((d) => d.pages > 0 && d.date.startsWith(thisYear)).length;

  const level = (pages: number) => {
    if (pages <= 0) return 0;
    const ratio = pages / maxPages;
    return ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
  };
  const shade = [
    "var(--raised)",
    "rgb(var(--primary-rgb) / 0.28)",
    "rgb(var(--primary-rgb) / 0.5)",
    "rgb(var(--primary-rgb) / 0.75)",
    "var(--primary)",
  ];
  const cellColor = (day: CalendarDay) =>
    (mode === "covers" && day.pages > 0 && colorOf(day.bookId)) || shade[level(day.pages)];
  const label = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
  const describe = (day: CalendarDay) => {
    if (day.pages <= 0) return `${label(day.date)} — no reading`;
    const book = day.bookId !== null ? bookById.get(day.bookId) : undefined;
    return `${label(day.date)} — ${day.pages} ${day.pages === 1 ? "page" : "pages"}${book ? ` of ${book.title}` : ""}`;
  };
  const selectedDay = selected ? activeDays.find((d) => d.date === selected) : undefined;

  // The books behind the most recent squares, newest first
  const recentBooks: number[] = [];
  for (let i = activeDays.length - 1; i >= 0 && recentBooks.length < 6; i--) {
    const id = activeDays[i].bookId;
    if (id !== null && activeDays[i].pages > 0 && !recentBooks.includes(id) && bookById.has(id)) recentBooks.push(id);
  }

  // A month name above the first week that starts in that month
  const monthLabels = weeks.map((week, w) => {
    const month = new Date(week[0].date).getUTCMonth();
    const prev = w > 0 ? new Date(weeks[w - 1][0].date).getUTCMonth() : -1;
    return month !== prev && w < weeks.length - 1 ? MONTH_NAMES[month] : "";
  });

  const figure = (value: number, caption: string, highlight = false) => (
    <div style={{ minWidth: "92px" }}>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "30px",
          fontWeight: 600,
          color: highlight ? "var(--text)" : "var(--text-muted)",
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value}
        {highlight && <span style={{ fontSize: "20px" }}> 🔥</span>}
      </p>
      <p style={{ color: "var(--text-faint)", fontSize: "12px", margin: "6px 0 0 0" }}>{caption}</p>
    </div>
  );

  const modeButton = (id: "covers" | "pages", text: string) => {
    const active = mode === id;
    return (
      <button
        onClick={() => changeMode(id)}
        aria-pressed={active}
        style={{
          padding: "5px 11px",
          borderRadius: "9999px",
          border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
          backgroundColor: active ? "var(--primary)" : "transparent",
          color: active ? "var(--on-primary)" : "var(--text-muted)",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {text}
      </button>
    );
  };

  return (
    <ChartCard
      title="Reading calendar"
      subtitle={
        mode === "covers"
          ? "Every day you read, coloured like the book you read most that day"
          : "Every day you logged pages or finished a book, over the last year"
      }
      action={
        <div style={{ display: "flex", gap: "4px" }}>
          {modeButton("covers", "Book colours")}
          {modeButton("pages", "Pages")}
        </div>
      }
    >
      <div style={{ display: "flex", gap: "22px", marginBottom: "18px", flexWrap: "wrap" }}>
        {figure(current, current === 1 ? "day in a row" : "days in a row", true)}
        {figure(longest, "longest streak")}
        {figure(daysThisYear, `reading days in ${thisYear}`)}
        {figure(daysRead, "in the last year")}
      </div>

      <div ref={scrollRef} style={{ overflowX: "auto", paddingBottom: "6px" }}>
        <div style={{ display: "inline-flex", gap: "6px" }}>
          {/* Weekday labels */}
          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateRows: `14px repeat(7, ${CELL}px)`,
              rowGap: `${GAP}px`,
              color: "var(--text-faint)",
              fontSize: "10px",
              lineHeight: `${CELL}px`,
            }}
          >
            <span />
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: `${GAP}px` }}>
            {weeks.map((week, w) => (
              <div
                key={week[0].date}
                style={{ display: "grid", gridTemplateRows: `14px repeat(7, ${CELL}px)`, rowGap: `${GAP}px` }}
              >
                <span style={{ color: "var(--text-faint)", fontSize: "10px", whiteSpace: "nowrap", width: `${CELL}px` }}>
                  {monthLabels[w]}
                </span>
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={describe(day)}
                    onClick={() => setSelected(day.date === selected ? null : day.date)}
                    style={{
                      width: `${CELL}px`,
                      height: `${CELL}px`,
                      borderRadius: "3px",
                      backgroundColor: cellColor(day),
                      cursor: "pointer",
                      outline: day.date === selected ? "2px solid var(--text)" : "none",
                      outlineOffset: "1px",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p
        style={{
          color: selectedDay ? "var(--text)" : "var(--text-faint)",
          fontSize: "12px",
          margin: "10px 0 0 0",
          minHeight: "16px",
        }}
      >
        {selectedDay ? describe(selectedDay) : "Tap a square to see what you read that day."}
      </p>

      {mode === "covers" ? (
        recentBooks.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: "10px" }}>
            {recentBooks.map((id) => (
              <span
                key={id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  maxWidth: "180px",
                  color: "var(--text-muted)",
                  fontSize: "11px",
                }}
              >
                <span
                  style={{ width: "10px", height: "10px", borderRadius: "2px", flexShrink: 0, backgroundColor: colorOf(id)! }}
                />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {bookById.get(id)!.title}
                </span>
              </span>
            ))}
          </div>
        )
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "4px",
            marginTop: "10px",
            color: "var(--text-faint)",
            fontSize: "11px",
          }}
        >
          Less
          {shade.map((c) => (
            <span key={c} style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: c }} />
          ))}
          More
        </div>
      )}
    </ChartCard>
  );
}

/* ─────────────── reading time (from the timer) ─────────────── */

const hoursAndMinutes = (minutes: number) =>
  minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`;

export function ReadingTimeCard({
  sessions,
  minutes,
  pagesPerHour,
  averageSession,
}: {
  sessions: number;
  minutes: number;
  pages: number;
  pagesPerHour: number | null;
  averageSession: number | null;
}) {
  const rows = [
    { label: "Time spent reading", value: hoursAndMinutes(minutes) },
    { label: "Reading speed", value: pagesPerHour !== null ? `${pagesPerHour} pages / hour` : "—" },
    { label: "Average session", value: averageSession !== null ? hoursAndMinutes(averageSession) : "—" },
    { label: "Timed sessions", value: String(sessions) },
  ];
  return (
    <ChartCard title="Reading time" subtitle="From sessions you timed with the reading timer">
      {sessions === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0, lineHeight: 1.55 }}>
          Start the ⏱️ reading timer on a book you&apos;re reading, and your reading speed and time will show up here.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {rows.map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px" }}>
              <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
}
