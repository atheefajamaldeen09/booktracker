"use client";

import { useState } from "react";
import Link from "next/link";
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
}: {
  years: number[];
  data: Record<number, { month: string; books: number }[]>;
}) {
  const [year, setYear] = useState(years[0]);
  const months = data[year] ?? [];
  const total = months.reduce((sum, m) => sum + m.books, 0);

  return (
    <ChartCard
      title="Books per month"
      subtitle={`${total} ${total === 1 ? "book" : "books"} finished in ${year}`}
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

/* ─────────────── reading streak ─────────────── */

export function StreakCard({
  current,
  longest,
  activeDays,
}: {
  current: number;
  longest: number;
  activeDays: { date: string; pages: number }[];
}) {
  // Columns are weeks, rows are days — like a calendar heatmap
  const weeks: { date: string; pages: number }[][] = [];
  for (let i = 0; i < activeDays.length; i += 7) weeks.push(activeDays.slice(i, i + 7));
  const maxPages = Math.max(1, ...activeDays.map((d) => d.pages));

  const level = (pages: number) => {
    if (pages <= 0) return 0;
    const ratio = pages / maxPages;
    return ratio > 0.66 ? 3 : ratio > 0.33 ? 2 : 1;
  };
  const shade = ["var(--raised)", "rgb(var(--primary-rgb) / 0.35)", "rgb(var(--primary-rgb) / 0.65)", "var(--primary)"];

  return (
    <ChartCard title="Reading streak" subtitle="Days you logged pages or finished a book">
      <div style={{ display: "flex", gap: "24px", marginBottom: "18px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "34px", fontWeight: 600, color: "var(--text)", margin: 0, lineHeight: 1 }}>
            {current} <span style={{ fontSize: "22px" }}>🔥</span>
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "6px 0 0 0" }}>
            {current === 1 ? "day" : "days"} in a row
          </p>
        </div>
        <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "34px", fontWeight: 600, color: "var(--text-muted)", margin: 0, lineHeight: 1 }}>
            {longest}
          </p>
          <p style={{ color: "var(--text-faint)", fontSize: "13px", margin: "6px 0 0 0" }}>longest streak</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "4px" }}>
        {weeks.map((week, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 0 12px", maxWidth: "20px" }}>
            {week.map((day) => (
              <div
                key={day.date}
                title={`${new Date(day.date).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" })} — ${
                  day.pages > 0 ? `${day.pages} pages` : "no reading"
                }`}
                style={{
                  aspectRatio: "1",
                  borderRadius: "3px",
                  backgroundColor: shade[level(day.pages)],
                }}
              />
            ))}
          </div>
        ))}
      </div>
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
    </ChartCard>
  );
}
