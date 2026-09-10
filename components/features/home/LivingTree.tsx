/**
 * A quiet, decorative system layer for the life-tree hero artwork.
 * It deliberately uses no timers or client-side state: the visual remains
 * lightweight and honours the user's reduced-motion preference in CSS.
 */
export function LivingTree() {
  return (
    <svg
      aria-hidden="true"
      className="living-tree"
      viewBox="0 0 1000 760"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="tree-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="tree-flow" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#efc66e" stopOpacity="0" />
          <stop offset="0.46" stopColor="#efc66e" stopOpacity="0.82" />
          <stop offset="1" stopColor="#a7d38e" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="living-tree__roots" filter="url(#tree-glow)">
        <path d="M612 690C584 638 586 590 610 514" />
        <path d="M612 690C640 636 662 592 645 500" />
        <path d="M612 690C562 663 518 643 492 603" />
        <path d="M612 690C675 664 731 642 754 588" />
      </g>
      <path className="living-tree__trunk" d="M625 565C613 474 620 367 628 246" />
      <g className="living-tree__branches">
        <path d="M628 330C559 309 512 258 478 184" />
        <path d="M627 330C694 304 746 256 780 181" />
        <path d="M626 278C583 229 554 184 556 119" />
        <path d="M630 277C671 231 707 187 704 112" />
      </g>
      <circle className="living-tree__ring living-tree__ring--one" cx="628" cy="442" r="52" />
      <circle className="living-tree__ring living-tree__ring--two" cx="628" cy="442" r="94" />
      <g className="living-tree__seeds" filter="url(#tree-glow)">
        <circle cx="770" cy="165" r="4" />
        <circle cx="823" cy="118" r="3" />
        <circle cx="868" cy="214" r="3" />
      </g>
      <path className="living-tree__flow" d="M612 690C634 566 607 416 628 246C678 232 714 200 780 181" />
    </svg>
  );
}
