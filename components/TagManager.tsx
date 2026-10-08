"use client";

import { useState } from "react";
import { useCanEdit } from "@/components/Viewer";
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
  { label: "Amber", value: "var(--primary)" },
  { label: "Gold", value: "var(--accent)" },
  { label: "Sage", value: "var(--success)" },
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
  // Guests just see the tags; the editor never opens
  const canEdit = useCanEdit();

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

  if (!canEdit && assignedTags.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Toggle Header */}
      <button
        onClick={() => canEdit && setIsOpen(!isOpen)}
        disabled={!canEdit}
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "transparent",
          border: "none",
          cursor: canEdit ? "pointer" : "default",
          color: "var(--text)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "600", fontSize: "14px" }}>
            🏷️ Tags
          </span>
          {/* Show assigned tags as preview when collapsed */}
          {!isOpen && assignedTags.length > 0 && (
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {assignedTags.slice(0, canEdit ? 3 : undefined).map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    backgroundColor: tag.color || "var(--primary)",
                    color: "var(--text)",
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
                <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>
                  +{assignedTags.length - 3} more
                </span>
              )}
            </div>
          )}
          {!isOpen && assignedTags.length === 0 && (
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
              No tags yet
            </span>
          )}
        </div>
        {canEdit && (
          <span style={{ color: "var(--text-muted)", fontSize: "18px" }}>
            {isOpen ? "−" : "+"}
          </span>
        )}
      </button>

      {/* Tag Panel */}
      {isOpen && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          {/* All available tags */}
          {allTags.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  color: "var(--text-muted)",
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
                            ? tag.color || "var(--primary)"
                            : "transparent",
                          border: `1px solid ${tag.color || "var(--primary)"}`,
                          borderRadius: "999px",
                          color: isAssigned
                            ? "var(--text)"
                            : tag.color || "var(--primary)",
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
                          color: "var(--text-faint)",
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
                color: "var(--text-muted)",
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
                border: "1px dashed var(--border)",
                borderRadius: "10px",
                color: "var(--text-muted)",
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
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: "var(--text-muted)",
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
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text)",
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
                          ? "3px solid var(--text)"
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
                      color: "var(--text)",
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
                      !newTagName.trim() || loading ? "var(--raised)" : "var(--primary)",
                    color: "var(--text)",
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
                    backgroundColor: "var(--raised)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
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