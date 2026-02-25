import { useState } from "react";

const images = [
  { name: "nginx",      tag: "latest",    size: "142 MB", created: "3 days ago",  id: "ab12cd34ef56" },
  { name: "nginx",      tag: "1.24",      size: "138 MB", created: "2 weeks ago", id: "gh78ij90kl12" },
  { name: "postgres",   tag: "16",        size: "412 MB", created: "1 week ago",  id: "mn34op56qr78" },
  { name: "redis",      tag: "7-alpine",  size: "28 MB",  created: "5 days ago",  id: "st90uv12wx34" },
  { name: "ubuntu",     tag: "22.04",     size: "77 MB",  created: "1 month ago", id: "yz56ab78cd90" },
  { name: "node",       tag: "20-alpine", size: "175 MB", created: "4 days ago",  id: "ef12gh34ij56" },
  { name: "myapp",      tag: "v2.1",      size: "89 MB",  created: "12 hours ago",id: "kl78mn90op12" },
  { name: "myapp",      tag: "v1.9",      size: "85 MB",  created: "1 week ago",  id: "qr34st56uv78" },
  { name: "python",     tag: "3.12-slim", size: "124 MB", created: "3 weeks ago", id: "wx90yz12ab34" },
  { name: "alpine",     tag: "3.19",      size: "7 MB",   created: "2 months ago",id: "cd56ef78gh90" },
  { name: "golang",     tag: "1.22",      size: "842 MB", created: "1 week ago",  id: "ij12kl34mn56" },
  { name: "rust",       tag: "1.76",      size: "1.2 GB", created: "5 days ago",  id: "op78qr90st12" },
];

export default function Images() {
  const [pullInput, setPullInput] = useState("");

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Images</h1>
        <p>$ manoj-docker images --all</p>
      </div>

      {/* Pull bar */}
      <div className="card" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div className="search-bar" style={{ flex: 1 }}>
          <span style={{ fontSize: 11, color: "var(--accent)" }}>↓</span>
          <input
            placeholder="Pull image — e.g. ubuntu:22.04"
            value={pullInput}
            onChange={(e) => setPullInput(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Pull Image</button>
        <button className="btn btn-ghost">Build Image</button>
      </div>

      <div className="image-grid">
        {images.map((img) => (
          <div className="image-card" key={img.id}>
            <div className="image-card-name">{img.name}</div>
            <div className="image-card-tag">:{img.tag}</div>
            <div className="image-card-meta">
              <span>{img.size}</span>
              <span>{img.created}</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
              <button className="btn btn-success btn-sm" style={{ flex: 1 }}>▶ Run</button>
              <button className="btn btn-danger btn-sm btn-icon" title="Delete">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}