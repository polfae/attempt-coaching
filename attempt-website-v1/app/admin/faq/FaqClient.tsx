"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createFaqItem,
  deleteFaqItem,
  FaqItem,
  getFaqItems,
  updateFaqItem,
} from "@/lib/firestore";

type FaqForm = {
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
};

const emptyForm: FaqForm = {
  question: "",
  answer: "",
  order: 1,
  isVisible: true,
};

function sortFaqItems(items: FaqItem[]) {
  return [...items].sort((a, b) => {
    const orderDiff = (a.order ?? 0) - (b.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return a.question.localeCompare(b.question);
  });
}

export function FaqClient() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FaqForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sortedItems = useMemo(() => sortFaqItems(items), [items]);
  const selectedItem = sortedItems.find((item) => item.id === selectedId);

  async function loadItems() {
    setLoading(true);
    const data = (await getFaqItems()) as FaqItem[];
    setItems(sortFaqItems(data));
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  function nextOrder() {
    const maxOrder = sortedItems.reduce(
      (max, item) => Math.max(max, Number(item.order) || 0),
      0,
    );
    return maxOrder + 10;
  }

  function startCreate() {
    setSelectedId(null);
    setForm({
      ...emptyForm,
      order: nextOrder(),
    });
    setError("");
    setMessage("");
  }

  function startEdit(item: FaqItem) {
    setSelectedId(item.id ?? null);
    setForm({
      question: item.question ?? "",
      answer: item.answer ?? "",
      order: Number(item.order) || nextOrder(),
      isVisible: item.isVisible !== false,
    });
    setError("");
    setMessage("");
  }

  function updateField<K extends keyof FaqForm>(key: K, value: FaqForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const question = form.question.trim();
    const answer = form.answer.trim();

    if (!question || !answer) {
      setError("Question and answer are required before saving.");
      return;
    }

    setSaving(true);

    const payload: FaqItem = {
      question,
      answer,
      order: Number(form.order) || nextOrder(),
      isVisible: form.isVisible,
    };

    if (selectedId) {
      await updateFaqItem(selectedId, payload);
      setMessage("FAQ item updated.");
    } else {
      await createFaqItem(payload);
      setMessage("FAQ item created.");
    }

    await loadItems();
    setSaving(false);
    startCreate();
  }

  async function removeItem(item: FaqItem) {
    if (!item.id) return;

    const confirmed = window.confirm(`Delete FAQ question "${item.question}"?`);
    if (!confirmed) return;

    setSaving(true);
    await deleteFaqItem(item.id);
    await loadItems();
    setSaving(false);

    if (selectedId === item.id) {
      startCreate();
    }
  }

  async function toggleVisibility(item: FaqItem) {
    if (!item.id) return;

    await updateFaqItem(item.id, {
      isVisible: item.isVisible === false,
    });
    await loadItems();
  }

  async function moveItem(index: number, direction: -1 | 1) {
    const current = sortedItems[index];
    const target = sortedItems[index + direction];

    if (!current?.id || !target?.id) return;

    setSaving(true);
    await Promise.all([
      updateFaqItem(current.id, { order: target.order }),
      updateFaqItem(target.id, { order: current.order }),
    ]);
    await loadItems();
    setSaving(false);
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="adminCard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            alignItems: "end",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#16181d" }}>FAQ items</h2>
            <p style={{ marginBottom: 0 }}>
              Manage public questions, answer text, order, and visibility.
            </p>
          </div>

          <button className="btn btnPrimary" type="button" onClick={startCreate}>
            Add Question
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(380px, 1fr) minmax(420px, 0.9fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div className="adminCard" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 22 }}>Loading FAQ items...</div>
          ) : sortedItems.length > 0 ? (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item, index) => {
                  const isSelected = selectedItem?.id === item.id;

                  return (
                    <tr
                      key={item.id ?? item.question}
                      style={{
                        background: isSelected ? "#f0fbff" : "transparent",
                      }}
                    >
                      <td
                        onClick={() => startEdit(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <strong>{item.question}</strong>
                        <p style={{ margin: "8px 0 0", color: "#656b78" }}>
                          {item.answer}
                        </p>
                      </td>
                      <td>{item.order}</td>
                      <td>
                        <button
                          type="button"
                          className="status"
                          onClick={() => toggleVisibility(item)}
                          style={{ border: 0, cursor: "pointer" }}
                        >
                          {item.isVisible === false ? "hidden" : "visible"}
                        </button>
                      </td>
                      <td>
                        <div className="adminTableActions">
                          <button
                            type="button"
                            onClick={() => moveItem(index, -1)}
                            disabled={index === 0 || saving}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(index, 1)}
                            disabled={index === sortedItems.length - 1 || saving}
                          >
                            Down
                          </button>
                          <button type="button" onClick={() => startEdit(item)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            style={{ color: "#8a1f1f" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ display: "grid", gap: 14, padding: 22 }}>
              <div>
                <h3 style={{ margin: 0, color: "#16181d" }}>
                  No FAQ items yet.
                </h3>
                <p style={{ marginBottom: 0 }}>
                  Add the first question to start building the public FAQ page.
                </p>
              </div>
              <button
                className="btn btnPrimary"
                type="button"
                onClick={startCreate}
                style={{ width: "fit-content" }}
              >
                Add Question
              </button>
            </div>
          )}
        </div>

        <form className="adminCard form" onSubmit={onSubmit}>
          <div>
            <h2 style={{ margin: 0, color: "#16181d" }}>
              {selectedId ? "Edit FAQ Item" : "Create FAQ Item"}
            </h2>
            <p style={{ marginBottom: 0 }}>
              Answers are saved as plain text. Paragraph breaks are preserved.
            </p>
          </div>

          {message && <div className="adminFormMessage">{message}</div>}
          {error && (
            <div className="adminFormMessage adminFormMessageError">{error}</div>
          )}

          <div className="field">
            <label htmlFor="faqQuestion">Question</label>
            <input
              id="faqQuestion"
              value={form.question}
              onChange={(event) => updateField("question", event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="faqAnswer">Answer</label>
            <textarea
              id="faqAnswer"
              value={form.answer}
              onChange={(event) => updateField("answer", event.target.value)}
              required
              rows={7}
            />
          </div>

          <div className="field">
            <label htmlFor="faqOrder">Display order</label>
            <input
              id="faqOrder"
              type="number"
              min="1"
              step="1"
              value={form.order}
              onChange={(event) =>
                updateField("order", Number(event.target.value))
              }
              required
            />
          </div>

          <label className="checkboxRow" style={{ color: "#545b68" }}>
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(event) =>
                updateField("isVisible", event.target.checked)
              }
            />
            <span>Visible on public FAQ page</span>
          </label>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : selectedId
                  ? "Save FAQ Item"
                  : "Create FAQ Item"}
            </button>

            {selectedId && (
              <button className="btn" type="button" onClick={startCreate}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
