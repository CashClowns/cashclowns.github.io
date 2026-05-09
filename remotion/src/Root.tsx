import { Composition } from "remotion";
import { CashClownsPromo } from "./CashClownsPromo";
import { HelloWorld } from "./HelloWorld";

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
        defaultProps={{
          brand: "Cash Clowns",
          tagline: "Funny Money. Serious Plays.",
          hype: "Join the Show",
          cta: "Follow @CashClowns",
        }}
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
