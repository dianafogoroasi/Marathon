import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#f97316",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 100,
            fontWeight: 900,
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          M
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: 6,
            textTransform: "uppercase",
            marginTop: -6,
          }}
        >
          arathon
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
