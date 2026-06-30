import { ImageResponse } from "next/og";

export const alt = "꿈디코치 AI 강사비서";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fff8e7",
          color: "#030712",
          fontFamily: "Arial, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "2px solid #d7e3d6",
            borderRadius: 28,
            background: "#ffffff",
            padding: 56,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 28,
                fontWeight: 800,
                color: "#047857",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#047857",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 25,
                }}
              >
                AI
              </div>
              KKUMDI COACH
            </div>
            <div
              style={{
                borderRadius: 999,
                background: "#fde68a",
                padding: "14px 22px",
                fontSize: 24,
                fontWeight: 800,
                color: "#713f12",
              }}
            >
              Project Based
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 82, lineHeight: 1.04, fontWeight: 900, letterSpacing: 0 }}>
              <div>AI Instructor</div>
              <div>Assistant</div>
            </div>
            <div style={{ width: 820, fontSize: 32, lineHeight: 1.35, color: "#334155", fontWeight: 700 }}>
              Plan, collect field notes, create reports, blogs, and marketing content in one workflow.
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            {["Basic Info", "Photo Analysis", "Report", "Blog", "Marketing"].map((label) => (
              <div
                key={label}
                style={{
                  borderRadius: 14,
                  border: "2px solid #dbeafe",
                  background: "#f8fafc",
                  padding: "14px 18px",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
