"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createProgram,
  deleteProgram,
  getPrograms,
  Program,
  updateProgram,
} from "@/lib/firestore";
import { AdminFormField } from "@/components/AdminFormField";

type ProgramForm = {
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  daysPerWeek: string;
  goal: string;
  price: string;
  imageUrl: string;
  productLink: string;
  downloadLink: string;
  visible: boolean;
  featured: boolean;
};

const emptyForm: ProgramForm = {
  title: "",
  slug: "",
  description: "",
  level: "",
  duration: "",
  daysPerWeek: "",
  goal: "",
  price: "",
  imageUrl: "",
  productLink: "",
  downloadLink: "",
  visible: true,
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProgramsClient() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadPrograms() {
    setLoading(true);
    const data = await getPrograms();
    setPrograms(data as Program[]);
    setLoading(false);
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  const selectedProgram = programs.find((program) => program.id === selectedId);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const searchable = [
        program.title,
        program.level,
        program.duration,
        program.goal,
        program.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search.toLowerCase());
    });
  }, [programs, search]);

  function updateField<K extends keyof ProgramForm>(
    key: K,
    value: ProgramForm[K],
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === "title" && !selectedId) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  }

  function startCreate() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  function startEdit(program: Program) {
    setSelectedId(program.id ?? null);
    setForm({
      title: program.title ?? "",
      slug: program.slug ?? "",
      description: program.description ?? "",
      level: program.level ?? "",
      duration: program.duration ?? "",
      daysPerWeek: program.daysPerWeek ?? "",
      goal: program.goal ?? "",
      price: program.price ?? "",
      imageUrl: program.imageUrl ?? "",
      productLink: program.productLink ?? "",
      downloadLink: program.downloadLink ?? "",
      visible: program.visible !== false,
      featured: program.featured === true,
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);

    const payload: Program = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      level: form.level,
      duration: form.duration,
      daysPerWeek: form.daysPerWeek,
      goal: form.goal,
      price: form.price,
      imageUrl: form.imageUrl,
      productLink: form.productLink,
      downloadLink: form.downloadLink,
      visible: form.visible,
      featured: form.featured,
    };

    if (selectedId) {
      await updateProgram(selectedId, payload);
    } else {
      await createProgram(payload);
    }

    await loadPrograms();
    setSaving(false);
    startCreate();
  }

  async function removeProgram(program: Program) {
    if (!program.id) return;

    const confirmed = window.confirm(
      `Delete "${program.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setSaving(true);
    await deleteProgram(program.id);
    await loadPrograms();
    setSaving(false);

    if (selectedId === program.id) {
      startCreate();
    }
  }

  async function quickToggle(program: Program, key: "visible" | "featured") {
    if (!program.id) return;

    await updateProgram(program.id, {
      [key]: !program[key],
    });

    await loadPrograms();
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="adminCard">
        <div className="adminSearchBar">
          <AdminFormField
            id="programSearch"
            label="Search programs"
            value={search}
            onChange={setSearch}
            placeholder="Search by title, level, duration, goal..."
            help="Filters the program list below without changing public content."
          />

          <button
            className="btn btnPrimary"
            type="button"
            onClick={startCreate}
          >
            New Program
          </button>
        </div>
      </div>

      <div className="adminCmsLayout">
        <div className="adminCard" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 22 }}>Loading programs...</div>
          ) : (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredPrograms.map((program) => {
                  const isSelected = selectedProgram?.id === program.id;

                  return (
                    <tr
                      key={program.id ?? program.slug}
                      style={{
                        background: isSelected ? "#f0fbff" : "transparent",
                      }}
                    >
                      <td
                        onClick={() => startEdit(program)}
                        style={{ cursor: "pointer" }}
                      >
                        <strong>{program.title}</strong>
                        <br />
                        <span style={{ color: "#656b78" }}>
                          {program.level} · {program.duration} · {program.price}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="status"
                          onClick={() => quickToggle(program, "visible")}
                          style={{ border: 0, cursor: "pointer" }}
                        >
                          {program.visible === false ? "hidden" : "visible"}
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="status"
                          onClick={() => quickToggle(program, "featured")}
                          style={{ border: 0, cursor: "pointer" }}
                        >
                          {program.featured ? "featured" : "normal"}
                        </button>
                      </td>

                      <td>
                        {program.id && (
                          <button
                            type="button"
                            onClick={() => removeProgram(program)}
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

          {!loading && !filteredPrograms.length && (
            <div style={{ padding: 22, color: "#656b78" }}>
              No programs match your search.
            </div>
          )}
        </div>

        <form className="adminCard form" onSubmit={onSubmit}>
          <div className="adminCardHeader">
            <h2>
              {selectedId ? "Edit Program" : "Create Program"}
            </h2>
            <p>
              Add digital programs here. Visible programs will show on the
              public Programs page.
            </p>
          </div>

          <div className="grid2">
            <AdminFormField
              id="title"
              label="Title"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              required
              help="Public program name shown on cards and detail pages."
            />

            <AdminFormField
              id="slug"
              label="Slug"
              value={form.slug}
              onChange={(value) => updateField("slug", slugify(value))}
              placeholder="beginner-weightlifting-program"
              required
            />
          </div>

          <AdminFormField
            id="description"
            label="Description"
            type="textarea"
            value={form.description}
            onChange={(value) => updateField("description", value)}
            required
            help="Short sales description shown on the Programs page."
          />

          <div className="grid2">
            <AdminFormField
              id="level"
              label="Level"
              value={form.level}
              onChange={(value) => updateField("level", value)}
              placeholder="Beginner / Intermediate / Advanced"
              required
              help="Training experience level this program is best suited for."
            />

            <AdminFormField
              id="duration"
              label="Duration"
              value={form.duration}
              onChange={(value) => updateField("duration", value)}
              placeholder="8 weeks"
              required
              help="How long the program runs."
            />
          </div>

          <div className="grid2">
            <AdminFormField
              id="daysPerWeek"
              label="Training days per week"
              value={form.daysPerWeek}
              onChange={(value) => updateField("daysPerWeek", value)}
              placeholder="4 days / week"
              required
              help="Shown as a practical training commitment."
            />

            <AdminFormField
              id="price"
              label="Price"
              value={form.price}
              onChange={(value) => updateField("price", value)}
              placeholder="499 DKK"
              required
              help="Display price only. Payments happen through the product link."
            />
          </div>

          <AdminFormField
            id="goal"
            label="Goal"
            value={form.goal}
            onChange={(value) => updateField("goal", value)}
            placeholder="Build technical consistency in the snatch and clean & jerk"
            required
            help="One clear outcome the program is built around."
          />

          <AdminFormField
            id="imageUrl"
            label="Image URL"
            value={form.imageUrl}
            onChange={(value) => updateField("imageUrl", value)}
            placeholder="https://..."
          />

          <div className="grid2">
            <AdminFormField
              id="productLink"
              label="Product/payment link"
              value={form.productLink}
              onChange={(value) => updateField("productLink", value)}
              placeholder="Shopify or checkout link later"
              help="Used by the Buy Program button when a program is available."
            />

            <AdminFormField
              id="downloadLink"
              label="Download link"
              value={form.downloadLink}
              onChange={(value) => updateField("downloadLink", value)}
              placeholder="Program PDF/file link later"
              help="Private or future delivery link. Keep blank if not needed."
            />
          </div>

          <label className="checkboxRow" style={{ color: "#545b68" }}>
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(event) => updateField("visible", event.target.checked)}
            />
            <span>Visible on public Programs page</span>
          </label>

          <label className="checkboxRow" style={{ color: "#545b68" }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
            />
            <span>Featured program</span>
          </label>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : selectedId
                  ? "Save Program"
                  : "Create Program"}
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
