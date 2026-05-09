import React from "react";

const PINK = "#FF1B6B";

export const ClownLogoSvg: React.FC<{ size: number }> = ({ size }) => {
  return (
    <svg
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <path
        d="M 270 870
           L 200 620
           L 175 410
           L 200 270
           L 255 165
           L 300 280
           L 355 120
           L 395 250
           L 425 95
           L 455 230
           L 488 70
           L 488 215
           L 488 870 Z"
        fill="black"
      />
      <path
        d="M 730 870
           L 800 620
           L 825 410
           L 800 270
           L 745 165
           L 700 280
           L 645 120
           L 605 250
           L 575 95
           L 545 230
           L 512 70
           L 512 215
           L 512 870 Z"
        fill="black"
      />
      <path
        d="M 295 800
           Q 235 760 225 600
           Q 225 360 290 295
           L 488 295
           L 488 820 Z"
        fill="white"
      />
      <path
        d="M 705 800
           Q 765 760 775 600
           Q 775 360 710 295
           L 512 295
           L 512 820 Z"
        fill="white"
      />
      <polygon points="380,440 415,485 380,530 345,485" fill="black" />
      <polygon points="620,440 655,485 620,530 585,485" fill="black" />
      <path
        d="M 375 690 Q 500 790 625 690"
        stroke="black"
        strokeWidth={22}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={500} cy={605} r={68} fill={PINK} />
      <circle cx={478} cy={585} r={14} fill="white" />
    </svg>
  );
};
