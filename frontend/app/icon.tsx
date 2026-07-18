import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6d5cff, #ff9d3c)",
          borderRadius: 8,
          color: "#050505",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "system-ui",
        }}
      >
        ●
      </div>
    ),
    size
  );
}
