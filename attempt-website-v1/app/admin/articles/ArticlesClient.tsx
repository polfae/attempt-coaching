"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Article,
  createArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} from "@/lib/firestore";
import { AdminFormField } from "@/components/AdminFormField";

type ArticleForm = {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string;
  author: string;
  body: string;
  status: "draft" | "published" | "scheduled";
  scheduledAt: string;
  seoTitle: string;
  seoDescription: string;
};

type ArticleValidationErrors = Partial<Record<keyof ArticleForm, string>>;
type ArticleSortKey = "title" | "scheduledAt" | "publishedAt" | "updatedAt";
type SortDirection = "asc" | "desc";

const categories = [
  "Technique",
  "Programming",
  "Strength Training",
  "Mobility",
  "Competition",
  "Nutrition",
];

const maxArticlePosterSize = 8 * 1024 * 1024;

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  subtitle: "",
  excerpt: "",
  featuredImage: "",
  category: "Technique",
  tags: "",
  author: "Pól Hendrikur Andreasen",
  body: "<p>Start writing...</p>",
  status: "draft",
  scheduledAt: "",
  seoTitle: "",
  seoDescription: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function displayDate(value?: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function articleTimestamp(value: unknown) {
  if (!value) return Number.POSITIVE_INFINITY;

  if (typeof value === "string") {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
  }

  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
  }

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const date = (value as { toDate?: () => Date }).toDate?.();
    const time = date?.getTime();
    return typeof time === "number" && !Number.isNaN(time)
      ? time
      : Number.POSITIVE_INFINITY;
  }

  return Number.POSITIVE_INFINITY;
}

function toDatetimeLocalValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function datetimeLocalToIso(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function statusForPublishDate(value: string) {
  if (!value) return "published" as const;
  const scheduledTime = new Date(value).getTime();
  return scheduledTime > Date.now() ? ("scheduled" as const) : ("published" as const);
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (
    /^(https?:|mailto:|tel:|#|\/)/i.test(trimmed)
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeArticleHtml(html: string) {
  if (typeof document === "undefined") return html;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  wrapper.querySelectorAll("a[href]").forEach((link) => {
    const href = normalizeUrl(link.getAttribute("href") ?? "");
    if (!href) return;

    link.setAttribute("href", href);

    if (/^https?:\/\//i.test(href)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  return wrapper.innerHTML;
}

function getArticleText(body: string) {
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidIsoDate(value?: string) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function timestampForExistingArticle(article?: Article) {
  return isValidIsoDate(article?.publishedAt) ? article?.publishedAt ?? "" : "";
}

function isPermissionError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "permission-denied"
  );
}

function articleFirestoreError(error: unknown, action: string) {
  if (isPermissionError(error)) {
    return `Firestore blocked ${action}. Make sure the deployed Firestore rules include the articles collection and that your signed-in user is active in the admins collection.`;
  }

  return error instanceof Error
    ? error.message
    : `Could not ${action}.`;
}

function articleToForm(article: Article): ArticleForm {
  return {
    title: article.title ?? "",
    slug: article.slug ?? "",
    subtitle: article.subtitle ?? "",
    excerpt: article.excerpt ?? "",
    featuredImage: article.featuredImage ?? "",
    category: article.category ?? "Technique",
    tags: article.tags?.join(", ") ?? "",
    author: article.author ?? "Pól Hendrikur Andreasen",
    body: article.body || "<p>Start writing...</p>",
    status: article.status ?? "draft",
    scheduledAt: toDatetimeLocalValue(
      article.scheduledAt || (article.status === "scheduled" ? article.publishedAt : ""),
    ),
    seoTitle: article.seoTitle ?? "",
    seoDescription: article.seoDescription ?? "",
  };
}

export function ArticlesClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "published">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: ArticleSortKey; direction: SortDirection }>({
    key: "updatedAt",
    direction: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<ArticleValidationErrors>({});
  const [formMessage, setFormMessage] = useState("");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
  });
  const [uploadProgress, setUploadProgress] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const selectedArticle = articles.find((article) => article.id === selectedId);

  async function loadArticles() {
    setLoading(true);
    setListError("");

    try {
      const data = await getArticles();
      setArticles(data as Article[]);
    } catch (error) {
      setArticles([]);
      setListError(articleFirestoreError(error, "loading articles"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = form.body;
    }
  }, []);

  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    function updateFormattingState() {
      const selection = window.getSelection();
      const editor = editorRef.current;

      if (
        !selection ||
        !editor ||
        selection.rangeCount === 0 ||
        !editor.contains(selection.anchorNode)
      ) {
        return;
      }

      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
      });
    }

    document.addEventListener("selectionchange", updateFormattingState);
    return () => {
      document.removeEventListener("selectionchange", updateFormattingState);
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const nextArticles = articles.filter((article) => {
      const statusMatch = filter === "all" || article.status === filter;
      const searchable = [
        article.title,
        article.category,
        article.author,
        article.excerpt,
        article.tags?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return statusMatch && searchable.includes(search.toLowerCase());
    });

    return nextArticles.sort((a, b) => {
      const direction = sort.direction === "asc" ? 1 : -1;

      if (sort.key === "title") {
        return direction * (a.title ?? "").localeCompare(b.title ?? "");
      }

      const aTime =
        sort.key === "updatedAt"
          ? articleTimestamp(a.updatedAt)
          : articleTimestamp(a[sort.key]);
      const bTime =
        sort.key === "updatedAt"
          ? articleTimestamp(b.updatedAt)
          : articleTimestamp(b[sort.key]);

      if (aTime === bTime) return (a.title ?? "").localeCompare(b.title ?? "");
      if (aTime === Number.POSITIVE_INFINITY) return 1;
      if (bTime === Number.POSITIVE_INFINITY) return -1;
      return direction * (aTime - bTime);
    });
  }, [articles, filter, search, sort]);

  function toggleSort(key: ArticleSortKey) {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  function sortLabel(key: ArticleSortKey, label: string) {
    const isActive = sort.key === key;
    return `${label}${isActive ? (sort.direction === "asc" ? " ↑" : " ↓") : ""}`;
  }

  function updateField<K extends keyof ArticleForm>(
    key: K,
    value: ArticleForm[K],
  ) {
    setDirty(true);
    setFormMessage("");
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === "title" && !selectedId) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  }

  function startCreate() {
    if (dirty && !window.confirm("Discard unsaved article changes?")) return;
    setSelectedId(null);
    setForm(emptyForm);
    setErrors({});
    setFormMessage("");
    setDirty(false);
    if (editorRef.current) editorRef.current.innerHTML = emptyForm.body;
  }

  function startEdit(article: Article) {
    if (dirty && !window.confirm("Discard unsaved article changes?")) return;
    setSelectedId(article.id ?? null);
    const nextForm = articleToForm(article);
    setForm(nextForm);
    setErrors({});
    setFormMessage("");
    setDirty(false);
    if (editorRef.current) editorRef.current.innerHTML = nextForm.body;
  }

  function saveEditorSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }

  function restoreEditorSelection() {
    const range = savedRangeRef.current;
    if (!range) return;

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function editorCommand(command: string, value?: string) {
    restoreEditorSelection();
    document.execCommand(command, false, value);
    if (command === "createLink") applyLinkAttributes();
    syncEditorBody();
    saveEditorSelection();
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
    });
  }

  function applyLinkAttributes() {
    const editor = editorRef.current;
    if (!editor) return;

    editor.querySelectorAll("a[href]").forEach((link) => {
      const href = normalizeUrl(link.getAttribute("href") ?? "");
      if (!href) return;

      link.setAttribute("href", href);
      if (/^https?:\/\//i.test(href)) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  function syncEditorBody() {
    applyLinkAttributes();
    const html = normalizeArticleHtml(editorRef.current?.innerHTML || "");
    updateField("body", html);
  }

  function buildPayload(nextStatus = form.status): Article {
    const selectedIso = datetimeLocalToIso(form.scheduledAt);
    const existingPublishedAt = timestampForExistingArticle(selectedArticle);
    const immediatePublishedAt = existingPublishedAt || new Date().toISOString();
    const publishStatus =
      nextStatus === "published" ? statusForPublishDate(selectedIso) : nextStatus;
    const publishedAt =
      nextStatus === "published"
        ? selectedIso || immediatePublishedAt
        : existingPublishedAt;
    const publishAtMillis = publishedAt
      ? new Date(publishedAt).getTime()
      : undefined;

    return {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      subtitle: form.subtitle.trim(),
      excerpt: form.excerpt.trim(),
      featuredImage: form.featuredImage.trim(),
      category: form.category,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: form.author.trim() || "Pól Hendrikur Andreasen",
      body: normalizeArticleHtml(form.body),
      status: publishStatus,
      scheduledAt: selectedIso,
      publishedAt,
      ...(publishAtMillis ? { publishAtMillis } : {}),
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
    };
  }

  function hasDuplicateSlug(slug: string) {
    return articles.some(
      (article) => article.slug === slug && article.id !== selectedId,
    );
  }

  function validateArticle(
    payload: Article,
    status: "draft" | "published" | "scheduled",
  ): ArticleValidationErrors {
    const nextErrors: ArticleValidationErrors = {};
    const bodyText = getArticleText(payload.body);

    if (!payload.title) {
      nextErrors.title = "Add a title before saving this article.";
    }

    if (!payload.slug) {
      nextErrors.slug = "Add a URL slug for this article.";
    } else if (hasDuplicateSlug(payload.slug)) {
      nextErrors.slug = "Another article already uses this slug.";
    }

    if (status === "published" || status === "scheduled") {
      if (form.scheduledAt && !isValidIsoDate(datetimeLocalToIso(form.scheduledAt))) {
        nextErrors.scheduledAt =
          "Add a valid schedule date and time, or leave the field empty.";
      }

      if (!payload.excerpt) {
        nextErrors.excerpt = "Add a short excerpt before publishing.";
      }

      if (!payload.category) {
        nextErrors.category = "Choose a category before publishing.";
      }

      if (!payload.author) {
        nextErrors.author = "Add an author before publishing.";
      }

      if (!bodyText || bodyText === "Start writing...") {
        nextErrors.body = "Write the article body before publishing.";
      }

      if (!payload.publishedAt || !isValidIsoDate(payload.publishedAt)) {
        nextErrors.scheduledAt =
          "Add a valid publication date and time.";
      }
    }

    return nextErrors;
  }

  function scrollToFirstError(nextErrors: ArticleValidationErrors) {
    const firstKey = Object.keys(nextErrors)[0] as keyof ArticleForm | undefined;
    if (!firstKey) return;

    const fieldSelectors: Partial<Record<keyof ArticleForm, string>> = {
      title: "#articleTitle",
      slug: "#articleSlug",
      excerpt: "#articleExcerpt",
      featuredImage: "#articleImage",
      category: "#articleCategory",
      tags: "#articleTags",
      author: "#articleAuthor",
      scheduledAt: "#articleScheduledAt",
      body: ".richEditor",
      seoTitle: "#articleSeoTitle",
      seoDescription: "#articleSeoDescription",
    };

    window.requestAnimationFrame(() => {
      const selector = fieldSelectors[firstKey];
      if (!selector) return;
      const target = document.querySelector(selector);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    });
  }

  function validationSummary(nextErrors: ArticleValidationErrors) {
    const count = Object.keys(nextErrors).length;
    if (count === 0) return "";
    if (count === 1) return Object.values(nextErrors)[0] ?? "";
    return `${count} fields need attention: ${Object.values(nextErrors).join(" ")}`;
  }

  async function preserveDraftAfterPublishFailure(payload: Article) {
    const draftPayload: Article = {
      ...payload,
      status: "draft",
      scheduledAt: form.scheduledAt,
      publishedAt: selectedArticle?.publishedAt ?? "",
    };

    if (!draftPayload.title || !draftPayload.slug || hasDuplicateSlug(draftPayload.slug)) {
      return false;
    }

    if (selectedId) {
      await updateArticle(selectedId, draftPayload);
      await loadArticles();
      return true;
    }

    const created = await createArticle(draftPayload);
    await loadArticles();
    const newId = "id" in created ? created.id : undefined;
    if (newId) setSelectedId(newId);
    setDirty(false);
    return true;
  }

  async function saveArticle(
    event?: FormEvent<HTMLFormElement>,
    statusOverride?: "draft" | "published" | "scheduled",
  ) {
    event?.preventDefault();
    const nextStatus = statusOverride ?? form.status;
    const payload = buildPayload(nextStatus);
    const nextErrors = validateArticle(payload, nextStatus);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaving(true);

      let draftSaved = false;
      try {
        if (nextStatus === "published") {
          draftSaved = await preserveDraftAfterPublishFailure(payload);
        }
      } catch (error) {
        const message = articleFirestoreError(error, "saving the draft backup");
        setFormMessage(`${validationSummary(nextErrors)} Draft backup failed: ${message}`);
        scrollToFirstError(nextErrors);
        setSaving(false);
        return;
      }

      setFormMessage(
        `${validationSummary(nextErrors)}${
          draftSaved ? " Your latest changes were saved as a draft." : ""
        }`,
      );
      scrollToFirstError(nextErrors);
      setSaving(false);
      return;
    }

    setSaving(true);
    setFormMessage("");

    try {
      if (selectedId) {
        await updateArticle(selectedId, payload);
      } else {
        await createArticle(payload);
      }

      await loadArticles();
      setDirty(false);
      startCreate();
      setFormMessage(
        payload.status === "scheduled"
          ? "Article scheduled successfully."
          : payload.status === "published"
            ? "Article published successfully."
            : "Draft saved successfully.",
      );
    } catch (error) {
      setFormMessage(
        articleFirestoreError(
          error,
          nextStatus === "published" ? "publishing this article" : "saving this draft",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePosterUpload(file: File | null) {
    if (!file) return;

    setFormMessage("");

    if (!file.type.startsWith("image/")) {
      setFormMessage("Choose an image file for the article poster.");
      return;
    }

    if (file.size > maxArticlePosterSize) {
      setFormMessage("Article poster images must be smaller than 8 MB.");
      return;
    }

    setSaving(true);
    setUploadProgress("Uploading poster image...");

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/admin/article-poster", {
        method: "POST",
        body: data,
      });

      const result = (await response.json()) as {
        path?: string;
        error?: string;
      };

      if (!response.ok || !result.path) {
        throw new Error(result.error || "Could not upload the poster image.");
      }

      updateField("featuredImage", result.path);
      setFormMessage("Poster image uploaded and added to the article.");
    } catch (error) {
      console.error(error);
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Could not upload the poster image.",
      );
    } finally {
      setSaving(false);
      setUploadProgress("");
      if (posterInputRef.current) posterInputRef.current.value = "";
    }
  }

  async function removeArticle(article: Article) {
    if (!article.id) return;

    const confirmed = window.confirm(
      `Delete "${article.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setSaving(true);
    await deleteArticle(article.id);
    await loadArticles();
    setSaving(false);

    if (selectedId === article.id) startCreate();
  }

  async function duplicateArticle(article: Article) {
    const baseSlug = `${article.slug}-copy`;
    let nextSlug = baseSlug;
    let index = 2;

    while (articles.some((item) => item.slug === nextSlug)) {
      nextSlug = `${baseSlug}-${index}`;
      index += 1;
    }

    await createArticle({
      ...article,
      id: undefined,
      title: `${article.title} Copy`,
      slug: nextSlug,
      status: "draft",
      scheduledAt: "",
      publishedAt: "",
    });

    await loadArticles();
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="adminCard">
        <div className="adminSearchBar">
          <AdminFormField
            id="articleSearch"
            label="Search articles"
            value={search}
            onChange={setSearch}
            placeholder="Search by title, category, tag, author..."
          />

          <div className="adminSegmented">
            {(["all", "draft", "scheduled", "published"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="btn btnPrimary" type="button" onClick={startCreate}>
            New Article
          </button>
        </div>
      </div>

      <div className="adminCmsLayout">
        <div className="adminCard articleTableCard">
          {loading ? (
            <div style={{ padding: 22 }}>Loading articles...</div>
          ) : listError ? (
            <div style={{ padding: 22 }}>
              <p className="adminErrorText">{listError}</p>
            </div>
          ) : (
            <div className="adminTableScroll" aria-label="Articles overview">
              <table className="adminTable articleAdminTable">
                <thead>
                  <tr>
                    <th>
                      <button
                        className={`adminSortHeader${sort.key === "title" ? " active" : ""}`}
                        type="button"
                        onClick={() => toggleSort("title")}
                      >
                        {sortLabel("title", "Article")}
                      </button>
                    </th>
                    <th>Status</th>
                    <th>
                      <button
                        className={`adminSortHeader${sort.key === "scheduledAt" ? " active" : ""}`}
                        type="button"
                        onClick={() => toggleSort("scheduledAt")}
                      >
                        {sortLabel("scheduledAt", "Scheduled")}
                      </button>
                    </th>
                    <th>
                      <button
                        className={`adminSortHeader${sort.key === "publishedAt" ? " active" : ""}`}
                        type="button"
                        onClick={() => toggleSort("publishedAt")}
                      >
                        {sortLabel("publishedAt", "Published")}
                      </button>
                    </th>
                    <th>
                      <button
                        className={`adminSortHeader${sort.key === "updatedAt" ? " active" : ""}`}
                        type="button"
                        onClick={() => toggleSort("updatedAt")}
                      >
                        {sortLabel("updatedAt", "Updated")}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.id ?? article.slug}>
                      <td>
                        <button
                          className="adminLinkButton articleTitleButton"
                          type="button"
                          onClick={() => startEdit(article)}
                        >
                          <strong>{article.title}</strong>
                        </button>
                      </td>
                      <td>
                        <span className="status">{article.status}</span>
                      </td>
                      <td>{displayDate(article.scheduledAt)}</td>
                      <td>{displayDate(article.publishedAt)}</td>
                      <td>{displayDate((article.updatedAt as any)?.toDate?.() ?? undefined)}</td>
                      <td>
                        <div className="adminTableActions">
                          <button type="button" onClick={() => duplicateArticle(article)}>
                            Duplicate
                          </button>
                          <button type="button" onClick={() => removeArticle(article)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <form className="adminCard" onSubmit={(event) => saveArticle(event)} noValidate>
          <div className="adminCardHeader">
            <h2>{selectedId ? "Edit Article" : "Create Article"}</h2>
            <p>{dirty ? "Unsaved changes" : "All changes saved"}</p>
          </div>

          {formMessage && (
            <div
              className={`adminFormMessage${
                Object.keys(errors).length ? " adminFormMessageError" : ""
              }`}
              role="status"
            >
              {formMessage}
            </div>
          )}

          <div className="grid2">
            <AdminFormField
              id="articleTitle"
              label="Title"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              required
              error={errors.title}
            />
            <AdminFormField
              id="articleSlug"
              label="Slug"
              value={form.slug}
              onChange={(value) => updateField("slug", slugify(value))}
              required
              error={errors.slug}
            />
          </div>

          <AdminFormField
            id="articleSubtitle"
            label="Subtitle"
            value={form.subtitle}
            onChange={(value) => updateField("subtitle", value)}
          />
          <AdminFormField
            id="articleExcerpt"
            label="Short excerpt"
            type="textarea"
            value={form.excerpt}
            onChange={(value) => updateField("excerpt", value)}
            maxLength={180}
            error={errors.excerpt}
          />
          <div className={`field adminField${errors.featuredImage ? " hasError" : ""}`}>
            <div className="adminFieldLabelRow">
              <label>Article poster image</label>
            </div>
            <input
              ref={posterInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={(event) => {
                handlePosterUpload(event.target.files?.[0] ?? null);
              }}
            />
            <div className={`articlePosterPanel${form.featuredImage ? " hasImage" : ""}`}>
              {form.featuredImage ? (
                <img src={form.featuredImage} alt="" />
              ) : (
                <div className="articlePosterEmpty">
                  <strong>No poster image added</strong>
                  <span>Use a wide image that represents the article.</span>
                </div>
              )}
              <div className="articlePosterActions">
                <button
                  className="btn adminActionButton"
                  type="button"
                  onClick={() => posterInputRef.current?.click()}
                  disabled={saving}
                >
                  {form.featuredImage ? "Change Image" : "Upload Image"}
                </button>
                {form.featuredImage && (
                  <button
                    className="btn btnGhost"
                    type="button"
                    onClick={() => updateField("featuredImage", "")}
                    disabled={saving}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {uploadProgress ? (
              <p className="adminHelpText">{uploadProgress}</p>
            ) : (
              <p className="adminHelpText">
                Images are saved to the project in public/articles.
                {form.featuredImage ? ` Current path: ${form.featuredImage}` : ""}
              </p>
            )}
            {errors.featuredImage && (
              <p className="adminErrorText">{errors.featuredImage}</p>
            )}
          </div>

          <div className="grid2">
            <div className={`field adminField${errors.category ? " hasError" : ""}`}>
              <label htmlFor="articleCategory">Category</label>
              <select
                id="articleCategory"
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? "articleCategory-error" : undefined}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="adminErrorText" id="articleCategory-error">
                  {errors.category}
                </p>
              )}
            </div>
            <AdminFormField
              id="articleTags"
              label="Tags"
              value={form.tags}
              onChange={(value) => updateField("tags", value)}
              placeholder="snatch, technique, beginner"
              error={errors.tags}
            />
          </div>

          <div className="grid2">
            <AdminFormField
              id="articleAuthor"
              label="Author"
              value={form.author}
              onChange={(value) => updateField("author", value)}
              error={errors.author}
            />
            <div className={`field adminField${errors.scheduledAt ? " hasError" : ""}`}>
              <label htmlFor="articleScheduledAt">
                Schedule date and time
              </label>
              <input
                id="articleScheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) => updateField("scheduledAt", event.target.value)}
                aria-invalid={Boolean(errors.scheduledAt)}
                aria-describedby={
                  errors.scheduledAt
                    ? "articleScheduledAt-error articleScheduledAt-help"
                    : "articleScheduledAt-help"
                }
              />
              {errors.scheduledAt && (
                <p className="adminErrorText" id="articleScheduledAt-error">
                  {errors.scheduledAt}
                </p>
              )}
              <p className="adminHelpText" id="articleScheduledAt-help">
                Leave empty to publish immediately. Existing published articles keep their current public date unless you enter a new one.
              </p>
            </div>
          </div>

          <div className={`field adminField${errors.body ? " hasError" : ""}`}>
            <label>Article body</label>
            <div className="richToolbar">
              <button type="button" onMouseDown={saveEditorSelection} onClick={() => editorCommand("formatBlock", "p")}>P</button>
              <button type="button" onMouseDown={saveEditorSelection} onClick={() => editorCommand("formatBlock", "h2")}>H2</button>
              <button type="button" onMouseDown={saveEditorSelection} onClick={() => editorCommand("formatBlock", "h3")}>H3</button>
              <button
                type="button"
                className={activeFormats.bold ? "active" : ""}
                aria-pressed={activeFormats.bold}
                onMouseDown={saveEditorSelection}
                onClick={() => editorCommand("bold")}
              >
                B
              </button>
              <button
                type="button"
                className={activeFormats.italic ? "active" : ""}
                aria-pressed={activeFormats.italic}
                onMouseDown={saveEditorSelection}
                onClick={() => editorCommand("italic")}
              >
                I
              </button>
              <button type="button" onMouseDown={saveEditorSelection} onClick={() => editorCommand("insertUnorderedList")}>Bullets</button>
              <button type="button" onMouseDown={saveEditorSelection} onClick={() => editorCommand("insertOrderedList")}>Numbers</button>
              <button type="button" onMouseDown={saveEditorSelection} onClick={() => editorCommand("formatBlock", "blockquote")}>Quote</button>
              <button
                type="button"
                onMouseDown={saveEditorSelection}
                onClick={() => {
                  const url = window.prompt("Link URL");
                  if (url) editorCommand("createLink", normalizeUrl(url));
                }}
              >
                Link
              </button>
              <button type="button" onMouseDown={saveEditorSelection} onClick={() => editorCommand("insertHorizontalRule")}>Divider</button>
            </div>
            <div
              className={`richEditor${errors.body ? " hasError" : ""}`}
              contentEditable
              ref={editorRef}
              onInput={syncEditorBody}
              onKeyUp={saveEditorSelection}
              onMouseUp={saveEditorSelection}
              onBlur={saveEditorSelection}
              aria-invalid={Boolean(errors.body)}
              aria-describedby={errors.body ? "articleBody-error" : undefined}
              suppressContentEditableWarning
            />
            {errors.body && (
              <p className="adminErrorText" id="articleBody-error">
                {errors.body}
              </p>
            )}
          </div>

          <div className="grid2">
            <AdminFormField
              id="articleSeoTitle"
              label="SEO title"
              value={form.seoTitle}
              onChange={(value) => updateField("seoTitle", value)}
              error={errors.seoTitle}
            />
            <AdminFormField
              id="articleSeoDescription"
              label="SEO description"
              type="textarea"
              value={form.seoDescription}
              onChange={(value) => updateField("seoDescription", value)}
              maxLength={160}
              error={errors.seoDescription}
            />
          </div>

          <div className="adminFormActions">
            <button className="btn btnGhost" type="button" onClick={startCreate}>
              Clear
            </button>
            <button
              className="btn adminActionButton"
              type="button"
              onClick={() => saveArticle(undefined, "draft")}
              disabled={saving}
            >
              Save Draft
            </button>
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => saveArticle(undefined, "published")}
              disabled={saving}
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
