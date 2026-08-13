"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import Button from "@/components/Button";
import { updateRating, updateReview } from "@/lib/actions/books";

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

  return (
    <div
      style={{
        backgroundColor: "#2A1C0F",
        border: "1px solid #4A3020",
        borderRadius: "14px",
        padding: "20px",
        marginBottom: "28px",
      }}
    >
      <h2
        style={{
          color: "#C8813A",
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
            color: "#A89070",
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
            <span style={{ color: "#F5ECD7", fontSize: "16px" }}>
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
                backgroundColor: "#C8813A",
                color: "#F5ECD7",
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
                color: "#8B3A3A",
                border: "1px solid #8B3A3A",
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
            <span style={{ color: "#7A9E7E", fontSize: "13px" }}>
                ✓ Saved!
            </span>
            )}
        </div>
        </div>

      {/* Review Section */}
      <div>
        <label
          style={{
            color: "#A89070",
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
            backgroundColor: "#1C1009",
            border: "1px solid #4A3020",
            borderRadius: "10px",
            color: "#F5ECD7",
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
          <p style={{ color: "#6B5040", fontSize: "11px", margin: 0 }}>
            {review.length} characters
          </p>

          {hasReviewChanged && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={handleSaveReview}
                disabled={isSavingReview}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#C8813A",
                  color: "#F5ECD7",
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
                <span style={{ color: "#7A9E7E", fontSize: "13px" }}>
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
            backgroundColor: "#3D2B18",
            borderRadius: "10px",
            border: "1px solid #4A3020",
          }}
        >
          <p
            style={{
              color: "#A89070",
              fontSize: "12px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            💡 <strong style={{ color: "#C8813A" }}>Tip:</strong> Rate and
            review books you&apos;ve finished to track what you loved and
            remember your thoughts later!
          </p>
        </div>
      )}
    </div>
  );
}