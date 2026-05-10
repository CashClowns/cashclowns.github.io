import { Composition } from "remotion";
import { CashClownsPromo } from "./CashClownsPromo";
import { HelloWorld } from "./HelloWorld";

const promoDefaults = {
  brand: "ClownFlowAI",
  tagline: "The next generation of mouse jigglers is here.",
  hype: "Download Free",
  cta: "cashclowns.github.io/KeepAlive",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CashClownsPromo"
        component={CashClownsPromo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={promoDefaults}
      />
      <Composition
        id="CashClownsPromoVertical"
        component={CashClownsPromo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={promoDefaults}
      />
      <Composition
        id="CashClownsPromoSquare"
        component={CashClownsPromo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={promoDefaults}
      />
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ titleText: "CashClowns" }}
      />
    </>
  );
};
