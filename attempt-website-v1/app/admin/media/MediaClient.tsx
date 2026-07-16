"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  createMediaAsset,
  deleteMediaAsset,
  getMediaAssets,
  MediaAsset,
} from "@/lib/firestore";
import { hasFirebaseConfig, storage } from "@/lib/firebase";
import { AdminFormField } from "@/components/AdminFormField";

type MediaForm = {
  title: string;
  altText: string;
  usage: string;
};

const emptyForm: MediaForm = {
  title: "",
  altText: "",
  usage: "Homepage",
};

function formatBytes(size: number) {
  if (!size) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1,
  );

  return `${(size / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function sanitizeFileName(value: string) {
  const cleaned = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "media-file";
}

export function MediaClient() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [form, setForm] = useState<MediaForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadAssets() {
    setLoading(true);
    const data = await getMediaAssets();
    setAssets(data as MediaAsset[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchable = [
        asset.title,
        asset.altText,
        asset.usage,
        asset.fileName,
        asset.fileType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search.toLowerCase());
    });
  }, [assets, search]);

  function updateField<K extends keyof MediaForm>(key: K, value: MediaForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!hasFirebaseConfig || !storage) {
      setError("Firebase Storage is not configured yet.");
      return;
    }

    if (!file) {
      setError("Choose a file to upload.");
      return;
    }

    setSaving(true);

    try {
      const timestamp = Date.now();
      const fileName = sanitizeFileName(file.name);
      const storagePath = `public/media/${timestamp}-${fileName}`;
      const storageReference = ref(storage, storagePath);

      await uploadBytes(storageReference, file, {
        contentType: file.type,
      });

      const url = await getDownloadURL(storageReference);

      await createMediaAsset({
        title: form.title || file.name,
        altText: form.altText,
        usage: form.usage,
        fileName: file.name,
        fileType: file.type || "unknown",
        size: file.size,
        url,
        storagePath,
      });

      setForm(emptyForm);
      setFile(null);
      event.currentTarget.reset();
      await loadAssets();
    } catch (uploadError) {
      console.error(uploadError);
      setError("Upload failed. Check Firebase Storage permissions and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl(asset: MediaAsset) {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id ?? asset.url);

    setTimeout(() => {
      setCopiedId(null);
    }, 1600);
  }

  async function removeAsset(asset: MediaAsset) {
    if (!asset.id) return;

    const confirmed = window.confirm(
      `Delete "${asset.title}" from the media library?`,
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      if (storage && asset.storagePath) {
        await deleteObject(ref(storage, asset.storagePath));
      }
    } catch (storageError) {
      console.warn("Could not delete stored file. Removing metadata.", storageError);
    }

    await deleteMediaAsset(asset.id);
    await loadAssets();
    setSaving(false);
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <form className="adminCard form" onSubmit={onSubmit}>
        <div className="adminCardHeader">
          <h3>Upload media</h3>
          <p>
            Add images, videos, or PDFs for homepage visuals, programs,
            testimonials, and content pages.
          </p>
        </div>

        {!hasFirebaseConfig && (
          <p className="adminErrorText">
            Firebase is not configured, so uploads are disabled.
          </p>
        )}

        <div className="grid2">
          <AdminFormField
            id="mediaTitle"
            label="Title"
            value={form.title}
            onChange={(value) => updateField("title", value)}
            placeholder="Homepage hero image"
            help="Internal label used to find this asset later."
          />

          <div className="field">
            <label htmlFor="mediaUsage">Usage</label>
            <select
              id="mediaUsage"
              value={form.usage}
              onChange={(event) => updateField("usage", event.target.value)}
            >
              <option>Homepage</option>
              <option>Coaching page</option>
              <option>About page</option>
              <option>Program</option>
              <option>Testimonial</option>
              <option>SEO / social</option>
              <option>Other</option>
            </select>
            <p className="adminHelpText">
              Helps you remember where this file belongs.
            </p>
          </div>
        </div>

        <AdminFormField
          id="mediaAltText"
          label="Alt text"
          value={form.altText}
          onChange={(value) => updateField("altText", value)}
          placeholder="Describe the image for accessibility"
        />

        <div className="field">
          <label htmlFor="mediaFile">File</label>
          <input
            id="mediaFile"
            type="file"
            accept="image/*,video/*,application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
          />
          <p className="adminHelpText">
            Accepted: images, videos, and PDFs. Large files may take longer to upload.
          </p>
        </div>

        {error && <p className="adminErrorText">{error}</p>}

        <div className="adminSaveBar">
          <span>Uploaded files become available to copy and reuse below.</span>
          <button
            className="btn btnPrimary"
            type="submit"
            disabled={saving || !hasFirebaseConfig}
          >
            {saving ? "Uploading..." : "Upload Media"}
          </button>
        </div>
      </form>

      <div className="adminCard">
        <div className="adminSearchBar" style={{ marginBottom: 18 }}>
          <AdminFormField
            id="mediaSearch"
            label="Search media"
            value={search}
            onChange={setSearch}
            placeholder="Search title, filename, usage, alt text..."
            help="Filters the library below without changing files."
          />
        </div>

        {loading ? (
          <p>Loading media...</p>
        ) : filteredAssets.length ? (
          <table className="adminTable">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Usage</th>
                <th>File</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => {
                const copied = copiedId === (asset.id ?? asset.url);

                return (
                  <tr key={asset.id ?? asset.url}>
                    <td>
                      <strong>{asset.title}</strong>
                      <br />
                      <span style={{ color: "#656b78" }}>
                        {asset.altText || "No alt text"}
                      </span>
                      {asset.fileType.startsWith("image/") && (
                        <div style={{ marginTop: 10 }}>
                          <img
                            src={asset.url}
                            alt={asset.altText || asset.title}
                            style={{
                              width: 120,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 12,
                              border: "1px solid #dde1ea",
                            }}
                          />
                        </div>
                      )}
                    </td>

                    <td>
                      <span className="status">{asset.usage || "Other"}</span>
                    </td>

                    <td>
                      <strong>{asset.fileName}</strong>
                      <br />
                      <span style={{ color: "#656b78" }}>
                        {asset.fileType} · {formatBytes(asset.size)}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => copyUrl(asset)}
                          style={{ minHeight: 36 }}
                        >
                          {copied ? "Copied" : "Copy URL"}
                        </button>

                        {asset.id && (
                          <button
                            type="button"
                            onClick={() => removeAsset(asset)}
                            disabled={saving}
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No media assets found.</p>
        )}
      </div>
    </div>
  );
}
