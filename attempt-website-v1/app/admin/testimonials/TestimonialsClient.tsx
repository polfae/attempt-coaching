"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  Testimonial,
  updateTestimonial,
} from "@/lib/firestore";

type TestimonialForm = {
  name: string;
  quote: string;
  athleteContext: string;
  photoUrl: string;
  visible: boolean;
  featured: boolean;
};

const emptyForm: TestimonialForm = {
  name: "",
  quote: "",
  athleteContext: "",
  photoUrl: "",
  visible: true,
  featured: false,
};

export function TestimonialsClient() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadTestimonials() {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data as Testimonial[]);
    setLoading(false);
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  const selectedTestimonial = testimonials.find(
    (item) => item.id === selectedId,
  );

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      const searchable = [item.name, item.quote, item.athleteContext]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search.toLowerCase());
    });
  }, [testimonials, search]);

  function updateField<K extends keyof TestimonialForm>(
    key: K,
    value: TestimonialForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startCreate() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  function startEdit(item: Testimonial) {
    setSelectedId(item.id ?? null);
    setForm({
      name: item.name ?? "",
      quote: item.quote ?? "",
      athleteContext: item.athleteContext ?? "",
      photoUrl: item.photoUrl ?? "",
      visible: item.visible !== false,
      featured: item.featured === true,
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);

    const payload: Testimonial = {
      name: form.name,
      quote: form.quote,
      athleteContext: form.athleteContext,
      photoUrl: form.photoUrl,
      visible: form.visible,
      featured: form.featured,
    };

    if (selectedId) {
      await updateTestimonial(selectedId, payload);
    } else {
      await createTestimonial(payload);
    }

    await loadTestimonials();
    setSaving(false);
    startCreate();
  }

  async function removeTestimonial(item: Testimonial) {
    if (!item.id) return;

    const confirmed = window.confirm(`Delete testimonial from "${item.name}"?`);

    if (!confirmed) return;

    setSaving(true);
    await deleteTestimonial(item.id);
    await loadTestimonials();
    setSaving(false);

    if (selectedId === item.id) {
      startCreate();
    }
  }

  async function quickToggle(item: Testimonial, key: "visible" | "featured") {
    if (!item.id) return;

    await updateTestimonial(item.id, {
      [key]: !item[key],
    });

    await loadTestimonials();
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
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="testimonialSearch">Search testimonials</label>
            <input
              id="testimonialSearch"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, quote, athlete context..."
            />
          </div>

          <button
            className="btn btnPrimary"
            type="button"
            onClick={startCreate}
          >
            New Testimonial
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(360px, 0.95fr) minmax(420px, 1.05fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div className="adminCard" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 22 }}>Loading testimonials...</div>
          ) : (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Athlete</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredTestimonials.map((item) => {
                  const isSelected = selectedTestimonial?.id === item.id;

                  return (
                    <tr
                      key={item.id ?? item.name}
                      style={{
                        background: isSelected ? "#f0fbff" : "transparent",
                      }}
                    >
                      <td
                        onClick={() => startEdit(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <strong>{item.name}</strong>
                        <br />
                        <span style={{ color: "#656b78" }}>
                          {item.athleteContext || "No context"}
                        </span>
                        <p style={{ margin: "8px 0 0", color: "#656b78" }}>
                          “{item.quote}”
                        </p>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="status"
                          onClick={() => quickToggle(item, "visible")}
                          style={{ border: 0, cursor: "pointer" }}
                        >
                          {item.visible === false ? "hidden" : "visible"}
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="status"
                          onClick={() => quickToggle(item, "featured")}
                          style={{ border: 0, cursor: "pointer" }}
                        >
                          {item.featured ? "featured" : "normal"}
                        </button>
                      </td>

                      <td>
                        {item.id && (
                          <button
                            type="button"
                            onClick={() => removeTestimonial(item)}
                            style={{
                              border: 0,
                              background: "transparent",
                              color: "#8a1f1f",
                              cursor: "pointer",
                              fontWeight: 800,
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loading && !filteredTestimonials.length && (
            <div style={{ padding: 22, color: "#656b78" }}>
              No testimonials match your search.
            </div>
          )}
        </div>

        <form className="adminCard form" onSubmit={onSubmit}>
          <div>
            <h2 style={{ margin: 0, color: "#16181d" }}>
              {selectedId ? "Edit Testimonial" : "Create Testimonial"}
            </h2>
            <p style={{ marginBottom: 0 }}>
              Add athlete quotes, proof, and coaching feedback here.
            </p>
          </div>

          <div className="field">
            <label htmlFor="name">Athlete name</label>
            <input
              id="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="athleteContext">Athlete context</label>
            <input
              id="athleteContext"
              value={form.athleteContext}
              onChange={(event) =>
                updateField("athleteContext", event.target.value)
              }
              placeholder="Example: Intermediate lifter · First competition prep"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="quote">Quote</label>
            <textarea
              id="quote"
              value={form.quote}
              onChange={(event) => updateField("quote", event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="photoUrl">Photo URL</label>
            <input
              id="photoUrl"
              value={form.photoUrl}
              onChange={(event) => updateField("photoUrl", event.target.value)}
              placeholder="https://..."
            />
          </div>

          <label className="checkboxRow" style={{ color: "#545b68" }}>
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(event) => updateField("visible", event.target.checked)}
            />
            <span>Visible on public website</span>
          </label>

          <label className="checkboxRow" style={{ color: "#545b68" }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
            />
            <span>Featured testimonial</span>
          </label>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : selectedId
                  ? "Save Testimonial"
                  : "Create Testimonial"}
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
