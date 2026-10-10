"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Hammer, LayoutGrid, Lightbulb } from "lucide-react";
import { chooseNook, placeNookPiece } from "@/lib/actions/nooks";
import { NOOKS, PIECES_PER_BOOK, PIECES_PER_KIT, nookById, type NookId, type NookProgress } from "@/lib/nooks";
import { MONTH_NAMES } from "@/lib/finishDate";
import { useCanEdit } from "@/components/Viewer";
import NookArt from "./NookArt";
import styles from "./NookBuilder.module.css";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
// "March 2026", the same on the server and in the browser
const monthOf = (iso: string) => {
  const d = new Date(iso);
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export default function NookBuilder({ progress }: { progress: NookProgress }) {
  const canEdit = useCanEdit();
  // Kept in step with the server by hand, so each piece appears the moment you place it
  const [state, setState] = useState(progress);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The piece that just went in, and the nook that was just finished
  const [justPlaced, setJustPlaced] = useState<string | null>(null);
  const [justFinished, setJustFinished] = useState<NookId | null>(null);
  const artRef = useRef<HTMLDivElement>(null);
  // Looking through the other kits while one is still on the workbench
  const [browsing, setBrowsing] = useState(false);

  // Web Animations rather than CSS, so pieces drop in even with reduced
  // motion switched on in the system settings
  useEffect(() => {
    const art = artRef.current;
    if (!justPlaced || !art) return;
    if (justPlaced === "lights") {
      art.animate([{ filter: "brightness(0.55)" }, { filter: "brightness(1.3)", offset: 0.5 }, { filter: "brightness(1)" }], {
        duration: 900,
        easing: "ease-out",
      });
      return;
    }
    const piece = art.querySelector<SVGGElement>(`[data-piece="${justPlaced}"]`);
    if (!piece) return;
    piece.style.transformBox = "fill-box";
    piece.style.transformOrigin = "center";
    piece.animate(
      [
        { transform: "translateY(-26px) scale(1.12)", opacity: 0 },
        { transform: "translateY(3px) scale(0.98)", opacity: 1, offset: 0.7 },
        { transform: "translateY(0) scale(1)", opacity: 1 },
      ],
      { duration: 520, easing: "cubic-bezier(.3,1.3,.5,1)" }
    );
  }, [justPlaced, state.placed]);

  const building = state.current ? nookById(state.current) : null;
  const finished = justFinished ? nookById(justFinished) : null;
  const doneIds = state.done.map((d) => d.id);
  const kitsLeft = NOOKS.filter((n) => !doneIds.includes(n.id));
  // The kits on show: everything unbuilt, minus the one you're building
  const kitsShown = kitsLeft.filter((n) => n.id !== state.current);
  const windowShopping = !!building && browsing;

  const place = async () => {
    if (!building || busy || state.available < 1) return;
    const piece = building.pieces[state.placed];
    const last = state.placed + 1 >= building.pieces.length;
    const before = state;
    setBusy(true);
    setError(null);
    setJustPlaced(piece.id);
    setState(
      last
        ? { ...state, current: null, placed: 0, available: state.available - 1, done: [...state.done, { id: building.id, finishedOn: new Date().toISOString() }] }
        : { ...state, placed: state.placed + 1, available: state.available - 1 }
    );
    if (last) setJustFinished(building.id);
    const result = await placeNookPiece();
    setBusy(false);
    if (!result.success) {
      setState(before);
      setJustFinished(null);
      setError(result.error ?? "Couldn't place that piece");
    }
  };

  const open = async (id: NookId) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await chooseNook(id);
    setBusy(false);
    if (!result.success) return setError(result.error ?? "Couldn't open that kit");
    setJustFinished(null);
    setJustPlaced(null);
    setBrowsing(false);
    setState({ ...state, current: id, placed: 0 });
  };

  const inHand = (
    <p className={styles.inHand}>
      <span className={styles.count}>{state.available}</span>
      {state.available === 1 ? "piece" : "pieces"} waiting to be placed
    </p>
  );

  return (
    <div className={styles.wrap}>
      {/* ── The nook you're building, or the one you just finished ── */}
      {(building || finished) && !windowShopping && (
        <section className={styles.bench}>
          <div className={styles.art} ref={artRef}>
            {building ? <NookArt nook={building.id} placed={state.placed} /> : <NookArt nook={finished!.id} />}
          </div>

          {building ? (
            <div className={styles.side}>
              <p className={styles.eyebrow}>On your workbench</p>
              <h2 className={styles.name}>{building.name}</h2>
              <p className={styles.blurb}>{building.blurb}</p>

              <div className={styles.track} aria-hidden>
                <span style={{ width: `${(state.placed / building.pieces.length) * 100}%` }} />
              </div>
              <p className={styles.trackLabel}>
                {state.placed} of {building.pieces.length} pieces in place
              </p>

              {canEdit && (
                <>
                  <button className={styles.primary} onClick={place} disabled={busy || state.available < 1}>
                    {building.pieces[state.placed].id === "lights" ? <Lightbulb size={16} /> : <Hammer size={16} />}
                    {building.pieces[state.placed].id === "lights" ? "Switch on the lights" : `Add: ${building.pieces[state.placed].name}`}
                  </button>
                  {inHand}
                  {state.available < 1 && (
                    <p className={styles.note}>Every book you finish earns another piece.</p>
                  )}
                </>
              )}
              {error && <p className={styles.error}>{error}</p>}
              {kitsShown.length > 0 && (
                <button className={styles.plain} onClick={() => setBrowsing(true)}>
                  <LayoutGrid size={15} /> See the other kits
                </button>
              )}

              <ol className={styles.pieces}>
                {building.pieces.map((p, i) => (
                  <li key={p.id} data-done={i < state.placed || undefined} data-next={i === state.placed || undefined}>
                    <span className={styles.tick}>{i < state.placed ? <Check size={12} /> : i + 1}</span>
                    {p.name}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className={styles.side}>
              <p className={styles.eyebrow}>Finished!</p>
              <h2 className={styles.name}>{finished!.name}</h2>
              <p className={styles.blurb}>
                Every piece is in and the lights are on. It now stands between the books on your shelf.
              </p>
              <Link href="/bookshelf" className={styles.primary} style={{ textDecoration: "none" }}>
                See it on my bookshelf
              </Link>
              {kitsLeft.length > 0 && <p className={styles.note}>{"Pick your next kit below whenever you're ready."}</p>}
            </div>
          )}
        </section>
      )}

      {/* ── Kits to choose from ── */}
      {(!building || windowShopping) && (
        <section>
          {windowShopping && (
            <button className={styles.plain} style={{ marginTop: 0, marginBottom: "18px" }} onClick={() => setBrowsing(false)}>
              <ArrowLeft size={15} /> Back to my workbench
            </button>
          )}
          <h2 className={styles.heading}>
            {windowShopping ? "The other kits" : state.done.length === 0 ? "Choose your first kit" : kitsLeft.length > 0 ? "Choose your next kit" : "Every kit is built!"}
          </h2>
          <p className={styles.lead}>
            {windowShopping
              ? `Have a look at what's waiting. You can open one of these once ${building!.name} is finished.`
              : kitsLeft.length > 0
              ? `Each kit has ${PIECES_PER_KIT} pieces. Every book you finish earns ${PIECES_PER_BOOK === 1 ? "one" : PIECES_PER_BOOK}, and you start with a couple to get going.`
              : "You've finished every nook there is. More kits will arrive on this shelf later."}
          </p>
          {canEdit && !windowShopping && kitsLeft.length > 0 && inHand}
          {error && !windowShopping && <p className={styles.error}>{error}</p>}
          <div className={styles.kits}>
            {kitsShown.map((kit) => (
              <div key={kit.id} className={styles.kit}>
                <div className={styles.kitArt}>
                  {/* The picture on the box: finished, lights off */}
                  <NookArt nook={kit.id} placed={kit.pieces.length - 1} />
                </div>
                <h3 className={styles.kitName}>{kit.name}</h3>
                <p className={styles.kitBlurb}>{kit.blurb}</p>
                {windowShopping ? (
                  <p className={styles.locked}>Finish {building!.name} first</p>
                ) : (
                  canEdit && (
                    <button className={styles.primary} onClick={() => open(kit.id)} disabled={busy}>
                      Open this kit
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Finished nooks ── */}
      {state.done.length > 0 && (
        <section>
          <h2 className={styles.heading}>Your collection</h2>
          <p className={styles.lead}>
            {plural(state.done.length, "nook")} built. They stand on <Link href="/bookshelf">your bookshelf</Link>, between the books.
          </p>
          <div className={styles.collection}>
            {state.done.map((d) => (
              <div key={d.id} className={styles.finishedNook}>
                <NookArt nook={d.id} />
                <p>
                  {nookById(d.id)?.name}
                  <small>{monthOf(d.finishedOn)}</small>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
