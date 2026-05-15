import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
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
            fontSize: 270,
            fontWeight: 900,
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: -12,
          }}
        >
          M
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 58,
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: 16,
            textTransform: "uppercase",
            marginTop: -16,
          }}
        >
          arathon
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
