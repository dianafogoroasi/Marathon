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
          borderRadius: 40,
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Orange circle */}
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "#f97316",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {/* Running figure (simplified) */}
          <div style={{ fontSize: 64, lineHeight: 1 }}>🏃</div>
        </div>
        {/* O badge bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#111827",
            border: "3px solid #f97316",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f97316",
            fontSize: 18,
            fontWeight: 900,
            fontFamily: "sans-serif",
          }}
        >
          O
        </div>
      </div>
    ),
    { ...size }
  );
}
