import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ClownLogoSvg } from "./ClownLogoSvg";

const COLORS = {
  pink: "#FF1B6B",
  cyan: "#22D3EE",
  yellow: "#FACC15",
  purple: "#7C3AED",
  lime: "#A3E635",
  orange: "#FB923C",
  black: "#0A0A0F",
  white: "#FFFFFF",
};

const PALETTE = [
  COLORS.pink,
  COLORS.purple,
  COLORS.cyan,
  COLORS.yellow,
  COLORS.lime,
  COLORS.orange,
];

const BEAT = 15;

const useScale = () => {
  const { width } = useVideoConfig();
  return width / 1920;
};

const useBeat = () => {
  const frame = useCurrentFrame();
  const phase = (frame % BEAT) / BEAT;
  return { phase, pulse: Math.pow(1 - phase, 2) };
};

const StrobeBg: React.FC<{ speed?: number; intensity?: number }> = ({
  speed = 5,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const idx = Math.floor(frame / speed) % PALETTE.length;
  const next = (idx + 1) % PALETTE.length;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${PALETTE[idx]} 0%, ${PALETTE[next]} 70%, ${COLORS.black} 100%)`,
        opacity: intensity,
      }}
    />
  );
};

const SparkleField: React.FC<{ count?: number; seed?: string }> = ({
  count = 35,
  seed = "sparkle",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = useScale();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`${seed}-x-${i}`) * width;
        const y = random(`${seed}-y-${i}`) * height;
        const size = (4 + random(`${seed}-s-${i}`) * 10) * s;
        const phase = random(`${seed}-p-${i}`) * Math.PI * 2;
        const twinkle = (Math.sin(frame / 6 + phase) + 1) / 2;
        const color = PALETTE[i % PALETTE.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: 0.2 + twinkle * 0.7,
              transform: `scale(${0.5 + twinkle * 0.8})`,
              boxShadow: `0 0 ${20 * s}px ${color}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SpeedLines: React.FC<{ count?: number }> = ({ count = 28 }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360 + frame * 0.5;
        const dash = (frame * 22 + i * 30) % 220;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 1600 * s,
              height: 8 * s,
              background: "rgba(255,255,255,0.85)",
              transform: `rotate(${angle}deg) translateX(${(280 + dash) * s}px)`,
              transformOrigin: "left center",
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Lightning: React.FC<{ active: boolean }> = ({ active }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { width, height } = useVideoConfig();
  if (!active) return null;
  const flash = frame % 14 < 2 ? 1 : 0;
  if (flash === 0) return null;
  const seed = Math.floor(frame / 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: COLORS.white, opacity: 0.18 }} />
      {Array.from({ length: 3 }).map((_, i) => {
        const startX = random(`lx-${seed}-${i}`) * width;
        const points: string[] = [];
        let x = startX;
        let y = 0;
        for (let j = 0; j < 14; j++) {
          points.push(`${x},${y}`);
          x += (random(`ld-${seed}-${i}-${j}`) - 0.5) * 80 * s;
          y += height / 14;
        }
        return (
          <svg
            key={i}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <polyline
              points={points.join(" ")}
              stroke={COLORS.cyan}
              strokeWidth={5 * s}
              fill="none"
              opacity={0.85}
              filter={`drop-shadow(0 0 ${15 * s}px ${COLORS.cyan})`}
            />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

const HaloRing: React.FC<{ size: number; color?: string }> = ({
  size,
  color = COLORS.pink,
}) => {
  const { pulse } = useBeat();
  const ringScale = 1 + pulse * 0.4;
  const ringOpacity = 0.15 + pulse * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${Math.max(4, size * 0.025)}px solid ${color}`,
        boxShadow: `0 0 ${size * 0.15}px ${color}, inset 0 0 ${size * 0.08}px ${color}`,
        transform: `scale(${ringScale})`,
        opacity: ringOpacity,
      }}
    />
  );
};

const ScanLines: React.FC<{ opacity?: number }> = ({ opacity = 0.12 }) => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)",
      pointerEvents: "none",
      opacity,
      mixBlendMode: "overlay",
    }}
  />
);

const ClownLogo: React.FC<{
  size?: number;
  glow?: number;
  rotate?: number;
  chromatic?: number;
}> = ({ size = 600, glow = 0, rotate = 0, chromatic = 0 }) => {
  const [pngFailed, setPngFailed] = React.useState(false);
  const src = staticFile("logo.png");
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    objectFit: "contain",
    position: "absolute",
    inset: 0,
  };
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    transform: `rotate(${rotate}deg)`,
    filter: `drop-shadow(0 0 ${glow * 30}px ${COLORS.pink}) drop-shadow(0 0 ${glow * 60}px ${COLORS.cyan}) drop-shadow(0 0 ${glow * 25}px ${COLORS.yellow})`,
  };

  if (pngFailed) {
    return (
      <div style={wrapperStyle}>
        {chromatic > 0 && (
          <>
            <div
              style={{
                ...baseStyle,
                transform: `translateX(${-chromatic}px)`,
                filter: "url(#redOnly)",
                mixBlendMode: "screen",
                opacity: 0.85,
              }}
            >
              <ClownLogoSvg size={size} />
            </div>
            <div
              style={{
                ...baseStyle,
                transform: `translateX(${chromatic}px)`,
                filter: "url(#cyanOnly)",
                mixBlendMode: "screen",
                opacity: 0.85,
              }}
            >
              <ClownLogoSvg size={size} />
            </div>
          </>
        )}
        <div style={baseStyle}>
          <ClownLogoSvg size={size} />
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      {chromatic > 0 && (
        <>
          <Img
            src={src}
            onError={() => setPngFailed(true)}
            style={{
              ...baseStyle,
              transform: `translateX(${-chromatic}px)`,
              filter: "url(#redOnly)",
              mixBlendMode: "screen",
              opacity: 0.85,
            }}
          />
          <Img
            src={src}
            onError={() => setPngFailed(true)}
            style={{
              ...baseStyle,
              transform: `translateX(${chromatic}px)`,
              filter: "url(#cyanOnly)",
              mixBlendMode: "screen",
              opacity: 0.85,
            }}
          />
        </>
      )}
      <Img src={src} onError={() => setPngFailed(true)} style={baseStyle} />
    </div>
  );
};

const ChromaticFilters: React.FC = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }}>
    <defs>
      <filter id="redOnly">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="cyanOnly">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  </svg>
);

const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = frame < 3 ? 1 - frame / 3 : 0;
  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        opacity,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    />
  );
};

const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const pulse = spring({ frame, fps, config: { damping: 8, stiffness: 80 } });
  const flash = frame > 35 ? interpolate(frame, [35, 44], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const ringPulses = [0, 12, 24].map((delay) => {
    const local = Math.max(0, frame - delay);
    const r = interpolate(local, [0, 30], [50, 800], { extrapolateRight: "clamp" });
    const op = interpolate(local, [0, 30], [0.9, 0], { extrapolateRight: "clamp" });
    return { r: r * s, op };
  });
  return (
    <AbsoluteFill
      style={{ background: COLORS.black, alignItems: "center", justifyContent: "center" }}
    >
      <SparkleField count={20} seed="cold" />
      {ringPulses.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: r.r,
            height: r.r,
            borderRadius: "50%",
            border: `${4 * s}px solid ${COLORS.pink}`,
            opacity: r.op,
            boxShadow: `0 0 ${30 * s}px ${COLORS.pink}`,
          }}
        />
      ))}
      <div
        style={{
          width: (60 + pulse * 600) * s,
          height: (60 + pulse * 600) * s,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.pink} 0%, transparent 70%)`,
          opacity: 1 - pulse * 0.3,
          filter: `blur(${20 * s}px)`,
        }}
      />
      <AbsoluteFill style={{ background: COLORS.white, opacity: flash }} />
    </AbsoluteFill>
  );
};

const Shake: React.FC<{
  intensity: number;
  seed?: string;
  children: React.ReactNode;
}> = ({ intensity, seed = "shake", children }) => {
  const frame = useCurrentFrame();
  const x = (random(`${seed}-x-${Math.floor(frame / 2)}`) - 0.5) * 2 * intensity;
  const y = (random(`${seed}-y-${Math.floor(frame / 2)}`) - 0.5) * 2 * intensity;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px)` }}>
      {children}
    </div>
  );
};

const LogoSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const drop = spring({ frame, fps, config: { damping: 9, mass: 1.2, stiffness: 110 } });
  const y = interpolate(drop, [0, 1], [-1300 * s, 0]);
  const overshoot = Math.sin(frame / 4) * Math.max(0, 1 - frame / 40) * 35 * s;
  const chromatic = Math.max(0, 35 - frame * 0.7) * s;
  const shakeIntensity = frame >= 22 ? Math.max(0, 30 - (frame - 22) * 1.5) * s : 0;
  const bgOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const beat = useBeat();
  const beatScale = 1 + beat.pulse * 0.04;
  const logoSize = 640 * s;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <StrobeBg speed={3} intensity={bgOpacity} />
      <SparkleField count={45} seed="slam" />
      <Lightning active={frame > 22 && frame < 70} />
      <SpeedLines />
      <Confetti seed="slam" count={70} burstFrame={20} radial />
      <Shake intensity={shakeIntensity}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `translateY(${y + overshoot}px) scale(${beatScale})` }}>
            <div
              style={{
                position: "relative",
                width: logoSize,
                height: logoSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HaloRing size={logoSize * 1.4} color={COLORS.pink} />
              <HaloRing size={logoSize * 1.7} color={COLORS.cyan} />
              <ClownLogo size={logoSize} glow={1} chromatic={chromatic} />
            </div>
          </div>
        </AbsoluteFill>
      </Shake>
      <ScanLines />
    </AbsoluteFill>
  );
};

const directions = ["up", "down", "left", "right"] as const;

const BrandText: React.FC<{ text: string; startFrame: number }> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: "'Impact', 'Arial Black', system-ui, sans-serif",
        fontSize: 240 * s,
        fontWeight: 900,
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        WebkitTextStroke: `${5 * s}px ${COLORS.black}`,
        color: COLORS.white,
        display: "flex",
        gap: 6 * s,
        textShadow: `${10 * s}px ${10 * s}px 0 ${COLORS.pink}, ${20 * s}px ${20 * s}px 0 ${COLORS.cyan}`,
        textAlign: "center",
        lineHeight: 1,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {text.split("").map((ch, i) => {
        const localFrame = frame - startFrame - i * 3;
        const pop = spring({ frame: Math.max(0, localFrame), fps, config: { damping: 6, stiffness: 200 } });
        const dir = directions[i % directions.length];
        const offset = (1 - pop) * 200 * s;
        const tx =
          dir === "left" ? -offset : dir === "right" ? offset : 0;
        const ty = dir === "up" ? -offset : dir === "down" ? offset : 0;
        const wiggle = Math.sin((frame + i * 7) / 5) * 6;
        const bobY = Math.sin((frame + i * 11) / 7) * 8 * s * (pop > 0.99 ? 1 : 0);
        const hueShift = (frame * 2 + i * 30) % 360;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translate(${tx}px, ${ty + bobY}px) scale(${pop}) rotate(${wiggle}deg)`,
              opacity: pop,
              filter: `hue-rotate(${hueShift}deg)`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </h1>
  );
};

const TaglineMarquee: React.FC<{ text: string; startFrame: number }> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const localFrame = Math.max(0, frame - startFrame);
  const slide = interpolate(localFrame, [0, 200], [200 * s, -200 * s]);
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const beat = useBeat();
  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slide}px) scale(${1 + beat.pulse * 0.03})`,
        background: COLORS.yellow,
        color: COLORS.black,
        padding: `${18 * s}px ${44 * s}px`,
        fontFamily: "'Impact', 'Arial Black', sans-serif",
        fontSize: 56 * s,
        fontWeight: 900,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        border: `${6 * s}px solid ${COLORS.black}`,
        boxShadow: `${8 * s}px ${8 * s}px 0 ${COLORS.pink}, 0 0 ${30 * s}px ${COLORS.yellow}`,
        textAlign: "center",
        maxWidth: "92%",
      }}
    >
      {text}
    </div>
  );
};

const BrandReveal: React.FC<{ brand: string; tagline: string }> = ({ brand, tagline }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const logoScale = interpolate(frame, [0, 20], [1, 0.4], { extrapolateRight: "clamp" });
  const logoY = interpolate(frame, [0, 20], [0, -290 * s], { extrapolateRight: "clamp" });
  const tilt = Math.sin(frame / 8) * 5;
  const beat = useBeat();
  const sceneScale = 1 + beat.pulse * 0.015;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden", transform: `scale(${sceneScale})` }}>
      <StrobeBg speed={4} />
      <SparkleField count={40} seed="brand" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            transform: `translateY(${logoY}px) scale(${logoScale}) rotate(${tilt}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HaloRing size={620 * s * 1.3} color={COLORS.pink} />
          <ClownLogo size={620 * s} glow={0.9} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: 140 * s }}>
        <BrandText text={brand} startFrame={10} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 140 * s }}>
        <TaglineMarquee text={tagline} startFrame={45} />
      </AbsoluteFill>
      <ScanLines opacity={0.08} />
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{
  seed: string;
  count: number;
  burstFrame: number;
  radial?: boolean;
}> = ({ seed, count, burstFrame, radial = false }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = useScale();
  const localFrame = Math.max(0, frame - burstFrame);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        let sx: number, sy: number, vx: number, vy: number;
        if (radial) {
          const angle = (i / count) * Math.PI * 2 + random(`${seed}-a-${i}`) * 0.5;
          const speed = (8 + random(`${seed}-sp-${i}`) * 8) * s;
          sx = width / 2;
          sy = height / 2;
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        } else {
          sx = random(`${seed}-x-${i}`) * width;
          sy = random(`${seed}-y-${i}`) * -200 * s;
          vx = (random(`${seed}-vx-${i}`) - 0.5) * 6 * s;
          vy = (4 + random(`${seed}-vy-${i}`) * 6) * s;
        }
        const rot = random(`${seed}-r-${i}`) * 360;
        const spin = (random(`${seed}-s-${i}`) - 0.5) * 14;
        const size = (12 + random(`${seed}-sz-${i}`) * 26) * s;
        const color = PALETTE[i % PALETTE.length];
        const x = sx + vx * localFrame;
        const y = sy + vy * localFrame + 0.4 * s * localFrame * localFrame;
        if (y > height + 100 || x < -100 || x > width + 100) return null;
        const shapeType = i % 3;
        const radius = shapeType === 0 ? 3 : shapeType === 1 ? "50%" : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: shapeType === 1 ? size : size * 0.6,
              background: color,
              transform: `rotate(${rot + spin * localFrame}deg)`,
              borderRadius: typeof radius === "number" ? radius : radius,
              boxShadow: `0 0 ${14 * s}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SwirlConfetti: React.FC<{ seed: string; count: number }> = ({ seed, count }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = useScale();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const baseAngle = (i / count) * Math.PI * 2;
        const speed = 0.04 + random(`${seed}-sp-${i}`) * 0.04;
        const radius = (200 + random(`${seed}-r-${i}`) * 400) * s;
        const angle = baseAngle + frame * speed;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        const size = (10 + random(`${seed}-sz-${i}`) * 18) * s;
        const color = PALETTE[i % PALETTE.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${18 * s}px ${color}`,
              transform: `rotate(${frame * 4 + i * 30}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const HypeScene: React.FC<{ hype: string }> = ({ hype }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const beat = useBeat();
  const sceneScale = 1 + beat.pulse * 0.05;
  const flashOn = Math.floor(frame / 6) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: `scale(${sceneScale})`,
      }}
    >
      <StrobeBg speed={3} />
      <SpeedLines count={20} />
      <SwirlConfetti seed="hype-swirl" count={30} />
      <Confetti seed="hype" count={70} burstFrame={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            transform: `scale(${1 + beat.pulse * 0.12})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HaloRing size={460 * s * 1.5} color={COLORS.yellow} />
          <ClownLogo size={460 * s} glow={1} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            marginTop: 380 * s,
            background: flashOn ? COLORS.white : COLORS.black,
            color: flashOn ? COLORS.black : COLORS.white,
            padding: `${22 * s}px ${64 * s}px`,
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 120 * s,
            fontWeight: 900,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            transform: `rotate(${Math.sin(frame / 5) * 3}deg) scale(${1 + beat.pulse * 0.06})`,
            border: `${10 * s}px solid ${flashOn ? COLORS.black : COLORS.pink}`,
            boxShadow: `0 0 ${80 * s}px ${COLORS.pink}, 0 0 ${40 * s}px ${COLORS.yellow}`,
            textAlign: "center",
            maxWidth: "92%",
          }}
        >
          {hype}
        </div>
      </AbsoluteFill>
      <ScanLines />
    </AbsoluteFill>
  );
};

const TypedText: React.FC<{ text: string; startFrame: number; size: number }> = ({
  text,
  startFrame,
  size,
}) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const charsToShow = Math.max(0, Math.floor((frame - startFrame) / 1.5));
  const visible = text.slice(0, charsToShow);
  const showCursor = charsToShow < text.length || (frame % 20 < 10);
  return (
    <div
      style={{
        fontFamily: "'Impact', 'Arial Black', sans-serif",
        fontSize: size * s,
        fontWeight: 900,
        color: COLORS.white,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        textShadow: `0 0 ${30 * s}px ${COLORS.pink}, 0 0 ${60 * s}px ${COLORS.cyan}`,
        textAlign: "center",
        maxWidth: "92%",
        whiteSpace: "nowrap",
      }}
    >
      {visible}
      {showCursor && <span style={{ color: COLORS.pink }}>|</span>}
    </div>
  );
};

const CtaOutro: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const settle = spring({ frame, fps, config: { damping: 14 } });
  const glow = 0.6 + Math.sin(frame / 8) * 0.4;
  const beat = useBeat();
  const haloRotate = frame * 1.5;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 50%, ${COLORS.purple} 0%, ${COLORS.black} 80%)`,
        overflow: "hidden",
      }}
    >
      <SparkleField count={50} seed="cta" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            transform: `scale(${0.8 + settle * 0.2 + beat.pulse * 0.04}) rotate(${Math.sin(frame / 12) * 2}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", transform: `rotate(${haloRotate}deg)` }}>
            <HaloRing size={520 * s * 1.4} color={COLORS.pink} />
          </div>
          <div style={{ position: "absolute", transform: `rotate(${-haloRotate * 0.7}deg)` }}>
            <HaloRing size={520 * s * 1.7} color={COLORS.cyan} />
          </div>
          <ClownLogo size={520 * s} glow={glow} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 130 * s,
          width: "100%",
          textAlign: "center",
        }}
      >
        <TypedText text={cta} startFrame={15} size={72} />
      </div>
    </AbsoluteFill>
  );
};

export type CashClownsPromoProps = {
  brand: string;
  tagline: string;
  hype: string;
  cta: string;
  enableAudio?: boolean;
};

export const CashClownsPromo: React.FC<CashClownsPromoProps> = ({
  brand,
  tagline,
  hype,
  cta,
  enableAudio = false,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <ChromaticFilters />

      {enableAudio && (
        <>
          <Audio src={staticFile("audio/music.mp3")} volume={0.65} />
          <Sequence from={42} durationInFrames={45}>
            <Audio src={staticFile("audio/boom.mp3")} volume={1} />
          </Sequence>
          <Sequence from={147} durationInFrames={30}>
            <Audio src={staticFile("audio/whoosh.mp3")} volume={0.8} />
          </Sequence>
          <Sequence from={267} durationInFrames={30}>
            <Audio src={staticFile("audio/whoosh.mp3")} volume={0.8} />
          </Sequence>
          <Sequence from={387} durationInFrames={45}>
            <Audio src={staticFile("audio/chime.mp3")} volume={1} />
          </Sequence>
        </>
      )}

      <Sequence from={0} durationInFrames={45}>
        <ColdOpen />
      </Sequence>

      <Sequence from={45} durationInFrames={105}>
        <LogoSlam />
      </Sequence>
      <Sequence from={45} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      <Sequence from={150} durationInFrames={120}>
        <BrandReveal brand={brand} tagline={tagline} />
      </Sequence>
      <Sequence from={150} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      <Sequence from={270} durationInFrames={120}>
        <HypeScene hype={hype} />
      </Sequence>
      <Sequence from={270} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      <Sequence from={390} durationInFrames={60}>
        <CtaOutro cta={cta} />
      </Sequence>
      <Sequence from={390} durationInFrames={5}>
        <FlashTransition />
      </Sequence>
    </AbsoluteFill>
  );
};
