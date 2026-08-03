"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import {
  createTag,
  deleteTag,
  addTagToBook,
  removeTagFromBook,
} from "@/lib/actions/books";

type Tag = {
  id: number;
  name: string | null;
  color: string | null;
};

type Props = {
  bookId: number;
  allTags: Tag[];
  bookTags: Tag[];
};

const TAG_COLORS = [
  { label: "Amber", value: "#C8813A" },
  { label: "Gold", value: "#D4A853" },
  { label: "Sage", value: "#7A9E7E" },
  { label: "Teal", value: "#4AA8A0" },
  { label: "Rose", value: "#C4756A" },
  { label: "Lavender", value: "#9B7EC8" },
  { label: "Sky", value: "#5BA8D4" },
  { label: "Mauve", value: "#B5748A" },
];

export default function TagManager({
  bookId,
  allTags: initialAllTags,
  bookTags: initialBookTags,
}: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
  const [loading, setLoading] = useState(false);

  // Track tags in local state so UI updates immediately
  const [allTags, setAllTags] = useState<Tag[]>(initialAllTags);
  const [assignedTagIds, setAssignedTagIds] = useState<Set<number>>(
    new Set(initialBookTags.map((t) => t.id))
  );

  const assignedTags = allTags.filter((t) => assignedTagIds.has(t.id));

  const handleToggleTag = async (tag: Tag) => {
    setLoading(true);

    if (assignedTagIds.has(tag.id)) {
      // Remove tag
      setAssignedTagIds((prev) => {
        const next = new Set(prev);
        next.delete(tag.id);
        return next;
      });
      await removeTagFromBook(bookId, tag.id);
    } else {
      // Add tag
      setAssignedTagIds((prev) => new Set([...prev, tag.id]));
      await addTagToBook(bookId, tag.id);
    }

    setLoading(false);
    router.refresh();
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setLoading(true);

    const result = await createTag(newTagName.trim(), newTagColor);

    if (result.success && result.tag) {
      // Add new tag to local state immediately
      const newTag = {
        id: result.tag.id,
        name: result.tag.name,
        color: result.tag.color,
      };
      setAllTags((prev) => [...prev, newTag]);
    }

    setNewTagName("");
    setShowCreateForm(false);
    setLoading(false);
    router.refresh();
  };

  const handleDeleteTag = async (tagId: number) => {
    setLoading(true);
    // Remove from local state immediately
    setAllTags((prev) => prev.filter((t) => t.id !== tagId));
    setAssignedTagIds((prev) => {
      const next = new Set(prev);
      next.delete(tagId);
      return next;
    });
    await deleteTag(tagId);
    setLoading(false);
    router.refresh();
  };

  return (
    <div
      style={{
        backgroundColor: "#2A1C0F",
        border: "1px solid #4A3020",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#F5ECD7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>
            🏷️ Tags
          </span>
          {/* Show assigned tags as preview when collapsed */}
          {!isOpen && assignedTags.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {assignedTags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    backgroundColor: tag.color || "#C8813A",
                    color: "#F5ECD7",
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontWeight: "600",
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {assignedTags.length > 3 && (
                <span style={{ color: "#A89070", fontSize: "10px" }}>
                  +{assignedTags.length - 3} more
                </span>
              )}
            </div>
          )}
          {!isOpen && assignedTags.length === 0 && (
            <span style={{ color: "#A89070", fontSize: "12px" }}>
              No tags yet
            </span>
          )}
        </div>
        <span style={{ color: "#A89070", fontSize: "18px" }}>
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/* Tag Panel */}
      {isOpen && (
        <div style={{ padding: "16px", borderTop: "1px solid #4A3020" }}>
          {/* All available tags */}
          {allTags.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  color: "#A89070",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "10px",
                }}
              >
                Tap to add or remove
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {allTags.map((tag) => {
                  const isAssigned = assignedTagIds.has(tag.id);
                  return (
                    <div
                      key={tag.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <button
                        onClick={() => handleToggleTag(tag)}
                        disabled={loading}
                        style={{
                          padding: "4px 12px",
                          backgroundColor: isAssigned
                            ? tag.color || "#C8813A"
                            : "transparent",
                          border: `1px solid ${tag.color || "#C8813A"}`,
                          borderRadius: "999px",
                          color: isAssigned
                            ? "#F5ECD7"
                            : tag.color || "#C8813A",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: loading ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          opacity: loading ? 0.6 : 1,
                        }}
                      >
                        {isAssigned ? "✓ " : ""}
                        {tag.name}
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        disabled={loading}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "18px",
                          height: "18px",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: loading ? "not-allowed" : "pointer",
                          color: "#6B5040",
                          padding: 0,
                        }}
                        title="Delete tag"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {allTags.length === 0 && !showCreateForm && (
            <p
              style={{
                color: "#A89070",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              No tags yet. Create your first tag below.
            </p>
          )}

          {/* Create New Tag */}
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                backgroundColor: "transparent",
                border: "1px dashed #4A3020",
                borderRadius: "10px",
                color: "#A89070",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <Plus size={14} />
              Create new tag
            </button>
          ) : (
            <div
              style={{
                backgroundColor: "#1C1009",
                border: "1px solid #4A3020",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: "#A89070",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "10px",
                }}
              >
                New Tag
              </p>

              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name e.g. cozy read"
                maxLength={30}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2A1C0F",
                  border: "1px solid #4A3020",
                  borderRadius: "8px",
                  color: "#F5ECD7",
                  fontSize: "13px",
                  outline: "none",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                {TAG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewTagColor(color.value)}
                    title={color.label}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: color.value,
                      border:
                        newTagColor === color.value
                          ? "3px solid #F5ECD7"
                          : "2px solid transparent",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              {newTagName && (
                <div style={{ marginBottom: "12px" }}>
                  <span
                    style={{
                      backgroundColor: newTagColor,
                      color: "#F5ECD7",
                      fontSize: "12px",
                      fontWeight: "600",
                      padding: "4px 12px",
                      borderRadius: "999px",
                    }}
                  >
                    {newTagName}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || loading}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor:
                      !newTagName.trim() || loading ? "#3D2B18" : "#C8813A",
                    color: "#F5ECD7",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor:
                      !newTagName.trim() || loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Create Tag
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTagName("");
                  }}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "#3D2B18",
                    color: "#A89070",
                    border: "1px solid #4A3020",
                    borderRadius: "8px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}