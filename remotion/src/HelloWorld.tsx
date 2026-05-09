import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const HelloWorld: React.FC<{ titleText: string }> = ({ titleText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#ffd700",
          fontSize: 180,
          fontWeight: 800,
          transform: `scale(${scale})`,
          opacity,
          margin: 0,
        }}
      >
        {titleText}
      </h1>
    </AbsoluteFill>
  );
};
