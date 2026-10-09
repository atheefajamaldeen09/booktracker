"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import { updateRating, updateReview } from "@/lib/actions/books";
import { useCanEdit } from "@/components/Viewer";

type Props = {
  bookId: number;
  bookTitle: string;
  initialRating: number | null;
  initialReview: string | null;
};

export default function RatingReview({
  bookId,
  bookTitle,
  initialRating,
  initialReview,
}: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating || 0);
  const [review, setReview] = useState(initialReview || "");
  const [isSavingRating, setIsSavingRating] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const canEdit = useCanEdit();

  const handleSaveRating = async () => {
    setIsSavingRating(true);
    setRatingSuccess(false);

    const result = await updateRating(bookId, rating);

    if (result.success) {
        setRatingSuccess(true);
        setTimeout(() => setRatingSuccess(false), 2000);
        router.refresh();
    }

    setIsSavingRating(false);
    };

  const handleSaveReview = async () => {
    setIsSavingReview(true);
    setReviewSuccess(false);

    const result = await updateReview(bookId, review);

    if (result.success) {
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 2000);
      router.refresh();
    }

    setIsSavingReview(false);
  };

  const hasRatingChanged = rating !== (initialRating || 0);
  const hasReviewChanged = review.trim() !== (initialReview || "").trim();

  // Guests get a read-only card with just the rating and notes
  if (!canEdit) {
    if (!initialRating && !initialReview) return null;
    return (
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "28px",
        }}
      >
        <h2 style={{ color: "var(--primary)", fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          ⭐ Rating & Review
        </h2>
        {initialRating ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: initialReview ? "16px" : 0 }}>
            <StarRating rating={initialRating} onRatingChange={() => {}} size="lg" readonly />
            <span style={{ color: "var(--text)", fontSize: "16px" }}>{initialRating} / 5</span>
          </div>
        ) : null}
        {initialReview && (
          <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
            {initialReview}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "20px",
        marginBottom: "28px",
      }}
    >
      <h2
        style={{
          color: "var(--primary)",
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        ⭐ Rating & Review
      </h2>

      {/* Rating Section */}
        <div style={{ marginBottom: "24px" }}>
        <label
            style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "block",
            marginBottom: "10px",
            }}
        >
            Your Rating
        </label>

        <div
            style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            }}
        >
            <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            {rating > 0 && (
            <span style={{ color: "var(--text)", fontSize: "16px" }}>
                {rating} / 5
            </span>
            )}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Save button - shows when rating changed */}
            {hasRatingChanged && (
            <button
                onClick={handleSaveRating}
                disabled={isSavingRating}
                style={{
                padding: "8px 16px",
                backgroundColor: "var(--primary)",
                color: "var(--on-primary)",
                border: "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                }}
            >
                {isSavingRating 
                ? "Saving..." 
                : rating === 0 
                    ? "Remove Rating" 
                    : "Save Rating"
                }
            </button>
            )}

            {/* Clear button - shows when there's a saved rating */}
            {initialRating !== null && initialRating > 0 && !hasRatingChanged && (
            <button
                onClick={() => setRating(0)}
                style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                }}
            >
                Clear Rating
            </button>
            )}

            {/* Success message */}
            {ratingSuccess && (
            <span style={{ color: "var(--success)", fontSize: "13px" }}>
                ✓ Saved!
            </span>
            )}
        </div>
        </div>

      {/* Review Section */}
      <div>
        <label
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "block",
            marginBottom: "10px",
          }}
        >
          Your Review / Notes
        </label>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder={`What did you think of ${bookTitle}? Write your thoughts here...`}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "12px 14px",
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text)",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "12px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ color: "var(--text-faint)", fontSize: "11px", margin: 0 }}>
            {review.length} characters
          </p>

          {hasReviewChanged && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={handleSaveReview}
                disabled={isSavingReview}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--primary)",
                  color: "var(--on-primary)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {isSavingReview ? "Saving..." : "Save Review"}
              </button>
              {reviewSuccess && (
                <span style={{ color: "var(--success)", fontSize: "13px" }}>
                  ✓ Saved!
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tip */}
      {!initialRating && !initialReview && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "var(--raised)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            💡 <strong style={{ color: "var(--primary)" }}>Tip:</strong> Rate and
            review books you&apos;ve finished to track what you loved and
            remember your thoughts later!
          </p>
        </div>
      )}
    </div>
  );
}