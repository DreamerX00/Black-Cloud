import { ImageResponse } from "next/og";

export const alt = "BlackCloud · Design cloud infrastructure in the space between certainty and chaos.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% 20%, #6d5cff33, transparent 55%), radial-gradient(circle at 85% 85%, #ff9d3c22, transparent 55%), #050505",
          color: "#F5F5F7",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6d5cff, #ff9d3c)",
              boxShadow: "0 0 40px #6d5cff88",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>BlackCloud</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#6d5cff",
              fontFamily: "monospace",
            }}
          >
            Cloud infrastructure · designed
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 0.98,
              maxWidth: 980,
            }}
          >
            Design the space between certainty and chaos.
          </div>
          <div style={{ fontSize: 26, color: "#A1A1AA", maxWidth: 900 }}>
            One graph. Five agents. AWS · Azure · GCP · Kubernetes.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 16,
            color: "#71717A",
          }}
        >
          <div>blackcloud.ai</div>
          <div>2026 · Council v3.2</div>
        </div>
      </div>
    ),
    size
  );
}
