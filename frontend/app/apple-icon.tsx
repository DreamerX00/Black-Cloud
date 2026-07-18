import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #6d5cff, #050505 70%), #050505",
          borderRadius: 40,
          color: "#F5F5F7",
          fontSize: 96,
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
