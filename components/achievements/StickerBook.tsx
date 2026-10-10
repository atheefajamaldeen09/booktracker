"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ACHIEVEMENTS, CHAPTERS, type AchievementDef, type AchievementStatus } from "@/lib/achievements";
import { StickerArt, StickerDefs } from "./BadgeArt";
import styles from "./StickerBook.module.css";

const SEEN_KEY = "sticker-book-seen";
const PER_PAGE = 4;

// Page 0 is the first page; each chapter then takes as many pages as it needs
type Page =
  | { kind: "intro" }
  | { kind: "chapter"; chapter: (typeof CHAPTERS)[number]; defs: AchievementDef[]; part: number };
const PAGES: Page[] = [
  { kind: "intro" },
  ...CHAPTERS.flatMap((chapter) => {
    const defs = ACHIEVEMENTS.filter((a) => a.chapter === chapter.id);
    return Array.from({ length: Math.ceil(defs.length / PER_PAGE) }, (_, part) => ({
      kind: "chapter" as const,
      chapter,
      defs: defs.slice(part * PER_PAGE, (part + 1) * PER_PAGE),
      part,
    }));
  }),
];
// Tabs: the first page, then the first page of each chapter
const TABS = [
  { label: "Start", color: "#efe5d2", page: 0 },
  ...CHAPTERS.map((c) => ({
    label: c.tab,
    color: c.tape,
    page: PAGES.findIndex((p) => p.kind === "chapter" && p.chapter.id === c.id),
  })),
];
const chapterOf = (index: number) => {
  const p = PAGES[index];
  return p && p.kind === "chapter" ? p.chapter.id : null;
};
const TURN_MS = 750;

// Phones show one page at a time, bigger screens an open spread
const NARROW = "(max-width: 760px)";
function useNarrow() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(NARROW);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(NARROW).matches,
    () => false
  );
}

// Each sticker sits a little crooked, the same way every visit
const tilt = (id: string) => {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 13) - 6) * 1.2;
};

function progressText(def: AchievementDef, current: number) {
  if (def.hours) return `${Math.floor(current / 60)}h / ${def.target! / 60}h`;
  return `${current.toLocaleString()} / ${def.target!.toLocaleString()}`;
}

function Sticker({
  def,
  status,
  isNew,
  played,
}: {
  def: AchievementDef;
  status: AchievementStatus;
  isNew: boolean;
  played: Set<string>;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // A new sticker gets pressed onto the page the first time you see it
  useEffect(() => {
    if (!isNew || !ref.current || played.has(def.id)) return;
    played.add(def.id);
    ref.current.animate(
      [
        { transform: "scale(1.5) rotate(-25deg)", opacity: 0 },
        { transform: "scale(0.92) rotate(4deg)", opacity: 1, offset: 0.7 },
        { transform: "scale(1) rotate(0deg)", opacity: 1 },
      ],
      { duration: 650, delay: 350, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "backwards" }
    );
  }, [isNew, played, def.id]);

  // A little wiggle when you tap one
  const wiggle = () =>
    ref.current?.animate(
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(-8deg) scale(1.08)" },
        { transform: "rotate(6deg) scale(1.08)" },
        { transform: "rotate(0deg) scale(1)" },
      ],
      { duration: 450, easing: "ease-out" }
    );

  const current = status.current ?? 0;
  return (
    <div className={styles.slot}>
      {status.earned && isNew && <span className={styles.newBadge}>new!</span>}
      <div className={styles.spot}>
        {status.earned ? (
          <button
            ref={ref}
            className={styles.sticker}
            style={{ rotate: `${tilt(def.id)}deg` }}
            onClick={wiggle}
            aria-label={`${def.name} sticker`}
          >
            <StickerArt id={def.id} color={def.color} label={def.label} />
          </button>
        ) : (
          <>
            <span className={styles.empty} />
            <span className={styles.ghost}>
              <StickerArt id={def.id} color={def.color} label={def.label} />
            </span>
            <span className={styles.lock} aria-hidden>
              ?
            </span>
          </>
        )}
      </div>
      <p className={styles.name}>{def.name}</p>
      <p className={styles.desc}>{def.description}</p>
      {status.earned ? (
        (status.earnedOn || status.note) && (
          <p className={styles.earnedOn} title={[status.note, status.earnedOn].filter(Boolean).join(" · ")}>
            {status.earnedOn ?? status.note}
          </p>
        )
      ) : def.target && def.target > 1 ? (
        <div className={styles.progress}>
          <span className={styles.progressTrack}>
            <span style={{ width: `${Math.min(100, (current / def.target) * 100)}%` }} />
          </span>
          {progressText(def, current)}
        </div>
      ) : null}
    </div>
  );
}

export default function StickerBook({ statuses }: { statuses: AchievementStatus[] }) {
  const narrow = useNarrow();
  const byId = new Map(statuses.map((s) => [s.id, s]));
  const earnedIds = statuses.filter((s) => s.earned).map((s) => s.id);
  const earnedKey = earnedIds.join(",");

  // Stickers earned since your last visit
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const checkedSeen = useRef(false);
  useEffect(() => {
    // Only once: checking marks them as seen
    if (checkedSeen.current) return;
    checkedSeen.current = true;
    const earned = earnedKey ? earnedKey.split(",") : [];
    try {
      const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- what you've seen is only known in the browser
      setNewIds(new Set(earned.filter((id) => !seen.includes(id))));
      localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(new Set([...seen, ...earned]))));
    } catch {
      // Storage blocked: nothing is marked new
    }
  }, [earnedKey]);
  // Stickers that have already done their "pressed on" animation this visit
  const [played] = useState(() => new Set<string>());

  // ── Pages: 0 is the first page, then one per chapter ──
  const pageCount = PAGES.length;
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<{ to: number } | null>(null);
  const leafRef = useRef<HTMLDivElement>(null);

  const renderPage = (index: number, side: "left" | "right" | "single"): ReactNode => {
    const sideClass = side === "left" ? styles.left : side === "right" ? styles.right : "";
    if (index < 0 || index >= pageCount) return <div className={`${styles.page} ${sideClass}`} />;
    return (
      <div className={`${styles.page} ${sideClass}`}>
        <div className={styles.pageInner}>
          {PAGES[index].kind === "intro" ? (
            <IntroPage statuses={statuses} newCount={newIds.size} />
          ) : (
            <ChapterPage
              page={PAGES[index] as Extract<Page, { kind: "chapter" }>}
              byId={byId}
              newIds={newIds}
              played={played}
            />
          )}
          <span className={styles.pageNumber}>{index + 1}</span>
        </div>
      </div>
    );
  };

  const spreadOf = (p: number) => Math.floor(p / 2);
  const goTo = (to: number) => {
    if (turn || to === page || to < 0 || to >= pageCount) return;
    // Same spread: nothing to turn
    if (!narrow && spreadOf(to) === spreadOf(page)) return setPage(to);
    setTurn({ to });
  };

  // Turn the page, then settle on the new one
  useLayoutEffect(() => {
    const leaf = leafRef.current;
    if (!turn || !leaf) return;
    const forward = turn.to > page;
    const frames = narrow
      ? forward
        ? [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }]
        : [{ transform: "rotateY(-180deg)" }, { transform: "rotateY(0deg)" }]
      : forward
      ? [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }]
      : [{ transform: "rotateY(0deg)" }, { transform: "rotateY(180deg)" }];
    const animation = leaf.animate(frames, {
      duration: TURN_MS,
      easing: "cubic-bezier(.45,.05,.35,1)",
      fill: "forwards",
    });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setPage(turn.to);
      setTurn(null);
    };
    animation.finished.then(finish, finish);
    // A hidden tab never reports the turn as finished, so don't wait forever
    const fallback = setTimeout(finish, TURN_MS + 100);
    return () => {
      done = true;
      clearTimeout(fallback);
      animation.cancel();
    };
  }, [turn, page, narrow]);

  // Arrow keys turn pages too
  const goRef = useRef(goTo);
  useEffect(() => {
    goRef.current = goTo;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") goRef.current(narrow ? page + 1 : (spreadOf(page) + 1) * 2);
      if (e.key === "ArrowLeft") goRef.current(narrow ? page - 1 : (spreadOf(page) - 1) * 2);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, narrow]);

  // Swipe on phones
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    const step = narrow ? 1 : 2;
    const base = narrow ? page : spreadOf(page) * 2;
    goTo(dx < 0 ? base + step : base - step);
  };

  // ── What's on the paper right now ──
  let base: ReactNode;
  let leaf: ReactNode = null;
  if (narrow) {
    if (turn) {
      const forward = turn.to > page;
      // Forward: the old page lifts away to reveal the new one.
      // Back: the earlier page turns back over the current one.
      base = renderPage(forward ? turn.to : page, "single");
      leaf = (
        <div ref={leafRef} className={styles.leaf} style={{ transform: forward ? undefined : "rotateY(-180deg)" }}>
          <div className={styles.face}>{renderPage(forward ? page : turn.to, "single")}</div>
          <div className={`${styles.face} ${styles.back}`}>
            <div className={styles.page} />
          </div>
        </div>
      );
    } else {
      base = renderPage(page, "single");
    }
  } else {
    const from = spreadOf(page) * 2;
    if (turn) {
      const to = spreadOf(turn.to) * 2;
      const forward = to > from;
      base = (
        <>
          {renderPage(forward ? from : to, "left")}
          {renderPage(forward ? to + 1 : from + 1, "right")}
        </>
      );
      leaf = (
        <div ref={leafRef} className={styles.leaf} data-side={forward ? "right" : "left"}>
          <div className={styles.face}>{renderPage(forward ? from + 1 : from, forward ? "right" : "left")}</div>
          <div className={`${styles.face} ${styles.back}`}>
            {renderPage(forward ? to : to + 1, forward ? "left" : "right")}
          </div>
        </div>
      );
    } else {
      base = (
        <>
          {renderPage(from, "left")}
          {renderPage(from + 1, "right")}
        </>
      );
    }
  }

  const shownPage = turn ? turn.to : page;
  const atStart = narrow ? page === 0 : spreadOf(page) === 0;
  const atEnd = narrow ? page === pageCount - 1 : spreadOf(page) === spreadOf(pageCount - 1);
  const step = narrow ? 1 : 2;
  const baseIndex = narrow ? page : spreadOf(page) * 2;

  return (
    <div className={`${styles.wrap} ${narrow ? styles.single : ""}`}>
      <StickerDefs />

      <div className={styles.tabs} role="tablist" aria-label="Chapters">
        {TABS.map((tab, i) => {
          // The chapters on the page you're on (both pages of a spread)
          const showing = narrow ? [shownPage] : [spreadOf(shownPage) * 2, spreadOf(shownPage) * 2 + 1];
          const active = i === 0 ? showing.includes(0) : showing.some((p) => chapterOf(p) === CHAPTERS[i - 1].id);
          return (
            <button
              key={tab.label}
              role="tab"
              className={styles.tab}
              aria-current={active}
              aria-selected={active}
              style={{ "--tab": tab.color } as CSSProperties}
              onClick={() => goTo(tab.page)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className={styles.cover} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className={styles.spread}>
          {base}
          {leaf}
        </div>
      </div>

      <div className={styles.nav}>
        <button className={styles.navButton} onClick={() => goTo(baseIndex - step)} disabled={atStart || !!turn}>
          ← Back
        </button>
        <span className={styles.navCount}>
          {narrow ? `Page ${shownPage + 1} of ${pageCount}` : `Pages ${spreadOf(shownPage) * 2 + 1}–${Math.min(pageCount, spreadOf(shownPage) * 2 + 2)} of ${pageCount}`}
        </span>
        <button className={styles.navButton} onClick={() => goTo(baseIndex + step)} disabled={atEnd || !!turn}>
          Next →
        </button>
      </div>
    </div>
  );
}

function ChapterPage({
  page,
  byId,
  newIds,
  played,
}: {
  page: Extract<Page, { kind: "chapter" }>;
  byId: Map<string, AchievementStatus>;
  newIds: Set<string>;
  played: Set<string>;
}) {
  const { chapter, defs, part } = page;
  return (
    <>
      <div className={styles.chapterHead}>
        <span className={styles.tape} style={{ "--tape": chapter.tape } as CSSProperties} />
        <h2 className={styles.chapterTitle}>{chapter.title}</h2>
        <p className={styles.chapterSub}>{part === 0 ? chapter.subtitle : "continued"}</p>
      </div>
      <div className={styles.grid}>
        {defs.map((def) => (
          <Sticker
            key={def.id}
            def={def}
            status={byId.get(def.id) ?? { id: def.id, earned: false }}
            isNew={newIds.has(def.id)}
            played={played}
          />
        ))}
      </div>
    </>
  );
}

function IntroPage({ statuses, newCount }: { statuses: AchievementStatus[]; newCount: number }) {
  const earned = statuses.filter((s) => s.earned).length;
  const byId = new Map(statuses.map((s) => [s.id, s]));

  // The locked stickers you're closest to
  const upNext = ACHIEVEMENTS.filter((a) => a.target && a.target > 1 && !byId.get(a.id)?.earned)
    .map((a) => ({ def: a, current: byId.get(a.id)?.current ?? 0 }))
    .sort((a, b) => b.current / b.def.target! - a.current / a.def.target!)
    .slice(0, 3);

  const toGo = (def: AchievementDef, current: number) => {
    const left = def.hours ? Math.ceil((def.target! - current) / 60) : def.target! - current;
    const unit = def.unit ?? "more";
    const plural = left === 1 || unit === "series" ? unit : `${unit}s`;
    return `${left.toLocaleString()} more ${plural}`;
  };


  return (
    <>
      <span className={styles.tape} style={{ "--tape": "#e3a3a0", top: "14px", left: "-14px", width: "110px", transform: "rotate(-32deg)" } as CSSProperties} />
      <span className={styles.tape} style={{ "--tape": "#8fa58a", top: "14px", right: "-14px", width: "110px", transform: "rotate(32deg)" } as CSSProperties} />

      <h2 className={styles.introTitle}>My Sticker Book</h2>
      <p className={styles.introSub}>a collection of little reading wins</p>

      {newCount > 0 && (
        <p className={styles.newNote}>
          ✨ {newCount} new {newCount === 1 ? "sticker" : "stickers"} since your last visit!
        </p>
      )}

      <div className={styles.bookplate}>
        <p className={styles.bookplateLabel}>Stickers collected</p>
        <p className={styles.bookplateCount}>
          {earned} <span style={{ fontSize: "24px", opacity: 0.6 }}>of {ACHIEVEMENTS.length}</span>
        </p>
        <div className={styles.dots}>
          {ACHIEVEMENTS.map((a) => (
            <span
              key={a.id}
              title={a.name}
              style={byId.get(a.id)?.earned ? { background: a.color, borderColor: a.color } : undefined}
            />
          ))}
        </div>
      </div>

      {upNext.length > 0 && (
        <div className={styles.upNext}>
          <p className={styles.upNextTitle}>Almost there…</p>
          {upNext.map(({ def, current }) => (
            <div key={def.id} className={styles.upNextItem}>
              <StickerArt id={def.id} color={def.color} size={34} />
              <span>
                <strong>{toGo(def, current)}</strong> for {def.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
