import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#f97316",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 52, lineHeight: 1 }}>🏃</div>
        <div
          style={{
            color: "white",
            fontSize: 26,
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          marathon
        </div>
      </div>
    ),
    { ...size }
  );
}
