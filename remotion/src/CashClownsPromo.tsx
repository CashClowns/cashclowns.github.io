import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  pink: "#FF1B6B",
  cyan: "#22D3EE",
  yellow: "#FACC15",
  purple: "#7C3AED",
  lime: "#A3E635",
  black: "#0A0A0F",
  white: "#FFFFFF",
};

const PALETTE = [COLORS.pink, COLORS.purple, COLORS.cyan, COLORS.yellow, COLORS.lime];

const useScale = () => {
  const { width } = useVideoConfig();
  return width / 1920;
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

const SpeedLines: React.FC<{ count?: number }> = ({ count = 28 }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360;
        const dash = (frame * 18 + i * 30) % 220;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 1400 * s,
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

const ClownLogo: React.FC<{
  size?: number;
  glow?: number;
  rotate?: number;
  chromatic?: number;
}> = ({ size = 600, glow = 0, rotate = 0, chromatic = 0 }) => {
  const src = staticFile("logo.png");
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    objectFit: "contain",
    position: "absolute",
  };
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        filter: `drop-shadow(0 0 ${glow * 25}px ${COLORS.pink}) drop-shadow(0 0 ${glow * 50}px ${COLORS.cyan})`,
      }}
    >
      {chromatic > 0 && (
        <>
          <Img
            src={src}
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
      <Img src={src} style={baseStyle} />
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

const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const pulse = spring({ frame, fps, config: { damping: 8, stiffness: 80 } });
  const flash = frame > 35 ? interpolate(frame, [35, 44], [0, 1], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ background: COLORS.black, alignItems: "center", justifyContent: "center" }}>
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

const LogoSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const drop = spring({ frame, fps, config: { damping: 9, mass: 1.2, stiffness: 110 } });
  const y = interpolate(drop, [0, 1], [-1200 * s, 0]);
  const overshoot = Math.sin(frame / 4) * Math.max(0, 1 - frame / 40) * 30 * s;
  const chromatic = Math.max(0, 30 - frame * 0.7) * s;
  const shake = frame < 25 ? 0 : Math.sin(frame * 1.3) * Math.max(0, 8 - (frame - 25) * 0.4) * s;
  const bgOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <StrobeBg speed={3} intensity={bgOpacity} />
      <SpeedLines />
      <Confetti seed="slam" count={50} burstFrame={20} />
      <div style={{ transform: `translate(${shake}px, ${y + overshoot}px)` }}>
        <ClownLogo size={620 * s} glow={1} chromatic={chromatic} />
      </div>
    </AbsoluteFill>
  );
};

const BrandReveal: React.FC<{ brand: string; tagline: string }> = ({ brand, tagline }) => {
  const frame = useCurrentFrame();
  const s = useScale();
  const logoScale = interpolate(frame, [0, 20], [1, 0.45], { extrapolateRight: "clamp" });
  const logoY = interpolate(frame, [0, 20], [0, -260 * s], { extrapolateRight: "clamp" });
  const tilt = Math.sin(frame / 8) * 4;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <StrobeBg speed={4} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${logoY}px) scale(${logoScale}) rotate(${tilt}deg)` }}>
          <ClownLogo size={620 * s} glow={0.7} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: 120 * s }}>
        <BrandText text={brand} startFrame={10} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 140 * s }}>
        <TaglineMarquee text={tagline} startFrame={45} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BrandText: React.FC<{ text: string; startFrame: number }> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: "'Impact', 'Arial Black', system-ui, sans-serif",
        fontSize: 220 * s,
        fontWeight: 900,
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        WebkitTextStroke: `${4 * s}px ${COLORS.black}`,
        color: COLORS.white,
        display: "flex",
        gap: 6 * s,
        textShadow: `${8 * s}px ${8 * s}px 0 ${COLORS.pink}, ${16 * s}px ${16 * s}px 0 ${COLORS.cyan}`,
        textAlign: "center",
        lineHeight: 1,
      }}
    >
      {text.split("").map((ch, i) => {
        const localFrame = frame - startFrame - i * 3;
        const pop = spring({ frame: Math.max(0, localFrame), fps, config: { damping: 6, stiffness: 200 } });
        const wiggle = Math.sin((frame + i * 7) / 5) * 6;
        const hueShift = (frame + i * 20) % 360;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - pop) * 80 * s}px) scale(${pop}) rotate(${wiggle}deg)`,
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
  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slide}px)`,
        background: COLORS.yellow,
        color: COLORS.black,
        padding: `${16 * s}px ${40 * s}px`,
        fontFamily: "'Impact', 'Arial Black', sans-serif",
        fontSize: 56 * s,
        fontWeight: 900,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        border: `${6 * s}px solid ${COLORS.black}`,
        boxShadow: `${8 * s}px ${8 * s}px 0 ${COLORS.pink}`,
        textAlign: "center",
        maxWidth: "92%",
      }}
    >
      {text}
    </div>
  );
};

const Confetti: React.FC<{ seed: string; count: number; burstFrame: number }> = ({
  seed,
  count,
  burstFrame,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = useScale();
  const localFrame = Math.max(0, frame - burstFrame);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const sx = random(`${seed}-x-${i}`) * width;
        const sy = random(`${seed}-y-${i}`) * -200 * s;
        const vx = (random(`${seed}-vx-${i}`) - 0.5) * 6 * s;
        const vy = (4 + random(`${seed}-vy-${i}`) * 6) * s;
        const rot = random(`${seed}-r-${i}`) * 360;
        const spin = (random(`${seed}-s-${i}`) - 0.5) * 12;
        const size = (14 + random(`${seed}-sz-${i}`) * 24) * s;
        const color = PALETTE[i % PALETTE.length];
        const x = sx + vx * localFrame;
        const y = sy + vy * localFrame + 0.4 * s * localFrame * localFrame;
        if (y > height + 100) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size * 0.6,
              background: color,
              transform: `rotate(${rot + spin * localFrame}deg)`,
              borderRadius: 3,
              boxShadow: `0 0 ${12 * s}px ${color}`,
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
  const pulse = 1 + Math.sin(frame / 4) * 0.08;
  const flashOn = Math.floor(frame / 6) % 2 === 0;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <StrobeBg speed={3} />
      <Confetti seed="hype" count={70} burstFrame={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${pulse})` }}>
          <ClownLogo size={460 * s} glow={1} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            marginTop: 380 * s,
            background: flashOn ? COLORS.white : COLORS.black,
            color: flashOn ? COLORS.black : COLORS.white,
            padding: `${20 * s}px ${60 * s}px`,
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 110 * s,
            fontWeight: 900,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            transform: `rotate(${Math.sin(frame / 5) * 2}deg)`,
            border: `${8 * s}px solid ${flashOn ? COLORS.black : COLORS.pink}`,
            boxShadow: `0 0 ${60 * s}px ${COLORS.pink}`,
            textAlign: "center",
            maxWidth: "92%",
          }}
        >
          {hype}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CtaOutro: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const settle = spring({ frame, fps, config: { damping: 14 } });
  const glow = 0.6 + Math.sin(frame / 8) * 0.4;
  const ctaPop = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 10 } });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 50%, ${COLORS.purple} 0%, ${COLORS.black} 80%)`,
      }}
    >
      <div style={{ transform: `scale(${0.8 + settle * 0.2})` }}>
        <ClownLogo size={520 * s} glow={glow} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 140 * s,
          opacity: ctaPop,
          transform: `translateY(${(1 - ctaPop) * 40 * s}px)`,
          fontFamily: "'Impact', 'Arial Black', sans-serif",
          fontSize: 80 * s,
          fontWeight: 900,
          color: COLORS.white,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textShadow: `0 0 ${30 * s}px ${COLORS.pink}, 0 0 ${60 * s}px ${COLORS.cyan}`,
          textAlign: "center",
          maxWidth: "92%",
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};

export type CashClownsPromoProps = {
  brand: string;
  tagline: string;
  hype: string;
  cta: string;
};

export const CashClownsPromo: React.FC<CashClownsPromoProps> = ({
  brand,
  tagline,
  hype,
  cta,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <ChromaticFilters />
      <Sequence from={0} durationInFrames={45}>
        <ColdOpen />
      </Sequence>
      <Sequence from={45} durationInFrames={105}>
        <LogoSlam />
      </Sequence>
      <Sequence from={150} durationInFrames={120}>
        <BrandReveal brand={brand} tagline={tagline} />
      </Sequence>
      <Sequence from={270} durationInFrames={120}>
        <HypeScene hype={hype} />
      </Sequence>
      <Sequence from={390} durationInFrames={60}>
        <CtaOutro cta={cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
