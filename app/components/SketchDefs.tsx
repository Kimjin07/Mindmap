/**
 * Global SVG <defs> rendered once. The gold gradient and the hand-drawn
 * "sketch" displacement filter are referenced by id (url(#...)) from every
 * other inline SVG in the document.
 */
export default function SketchDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: "absolute" }}
    >
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c6a2e" />
          <stop offset="45%" stopColor="#d8c06a" />
          <stop offset="80%" stopColor="#f3e29a" />
          <stop offset="100%" stopColor="#fff6cf" />
        </linearGradient>

        <linearGradient id="goldSoft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6f5f2a" />
          <stop offset="100%" stopColor="#cdb763" />
        </linearGradient>

        {/* hand-drawn wobble */}
        <filter id="sketch" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="sketchSoft" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="2"
            seed="3"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
        </filter>

        {/* faint glow so strokes read like pencil on black */}
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
