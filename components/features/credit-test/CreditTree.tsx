"use client";

import { useState } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { DimensionScore } from "@/lib/domain/credit-assessment";
import styles from "./CreditTree.module.css";

interface CreditTreeProps {
  dimensions: DimensionScore[];
}

type DimensionId = DimensionScore["id"];

interface LegendItem {
  id: DimensionId;
  label: string;
  color: string;
  markClass: string;
}

type TreeStyle = CSSProperties & {
  "--active-color"?: string;
  "--legend-color"?: string;
};

interface LeafPosition {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
}

interface CanopyMassPosition {
  x: number;
  y: number;
  rx: number;
  ry: number;
}

const LEAF_TOTAL = 112;
const GOLDEN_ANGLE = 137.508;

const leafPositions: LeafPosition[] = Array.from(
  { length: LEAF_TOTAL },
  (_, index) => {
    const progress = Math.sqrt((index + 4) / (LEAF_TOTAL + 4));
    const angle = ((index * GOLDEN_ANGLE - 90) * Math.PI) / 180;

    return {
      x: 360 + Math.cos(angle) * 245 * progress,
      y: 232 + Math.sin(angle) * 150 * progress,
      rx: 10 + (index % 4),
      ry: 5 + (index % 3),
      rotation: ((index * 47) % 130) - 65,
    };
  },
);

const canopyMassPositions: CanopyMassPosition[] = Array.from(
  { length: 34 },
  (_, index) => {
    const progress = Math.sqrt((index + 2) / 36);
    const angle = ((index * GOLDEN_ANGLE - 90) * Math.PI) / 180;

    return {
      x: 360 + Math.cos(angle) * 218 * progress,
      y: 242 + Math.sin(angle) * 126 * progress,
      rx: 34 + (index % 5) * 5,
      ry: 20 + (index % 4) * 4,
    };
  },
);

const fruitPositions = [
  [272, 195],
  [326, 155],
  [392, 174],
  [451, 207],
  [229, 247],
  [305, 256],
  [409, 253],
  [488, 265],
  [259, 310],
  [357, 303],
  [441, 323],
  [329, 354],
] as const;

const branchPaths = [
  "M356 516 C342 452 307 399 251 347 C204 304 170 258 143 203",
  "M362 506 C381 444 424 395 484 348 C529 313 557 270 579 213",
  "M358 478 C343 404 346 315 360 177",
  "M337 420 C293 371 238 350 178 341 C146 336 116 319 90 297",
  "M379 416 C433 365 493 350 565 358 C592 361 616 373 639 391",
  "M320 372 C285 323 251 287 208 253",
  "M396 368 C429 323 470 289 521 258",
  "M349 330 C320 287 296 252 287 212",
  "M370 325 C400 279 422 239 433 195",
  "M300 337 C266 303 225 287 181 282",
  "M416 341 C455 307 498 293 545 295",
] as const;

const rootPaths = [
  "M360 545 C326 581 290 623 245 684",
  "M360 545 C340 588 329 635 323 705",
  "M361 545 C383 593 397 640 412 704",
  "M360 546 C408 580 454 623 511 674",
  "M358 546 C294 568 231 591 165 627",
  "M363 546 C430 564 497 587 566 620",
  "M357 549 C275 554 205 566 128 587",
  "M364 548 C442 551 515 560 602 582",
  "M322 579 C293 591 274 611 254 639",
  "M397 582 C427 594 454 615 476 641",
  "M321 623 C296 643 280 665 269 692",
  "M410 622 C439 639 460 659 477 682",
  "M244 601 C216 606 192 617 169 635",
  "M511 598 C544 604 570 614 593 631",
  "M359 546 C355 599 356 649 357 716",
] as const;

const soilParticles = Array.from({ length: 26 }, (_, index) => ({
  x: 82 + ((index * 83) % 558),
  y: 561 + ((index * 29) % 126),
  radius: 1 + (index % 3),
  delay: `${-(index % 8) * 0.7}s`,
}));

const leafColors = [
  "url(#leafGold)",
  "url(#leafOlive)",
  "url(#leafGreen)",
  "url(#leafAmber)",
] as const;

const legendItems: LegendItem[] = [
  {
    id: "label",
    label: "叶片",
    color: "#d9ad57",
    markClass: styles.labelMark,
  },
  {
    id: "time",
    label: "年轮",
    color: "#6e98aa",
    markClass: styles.timeMark,
  },
  {
    id: "environment",
    label: "风雨",
    color: "#b9684d",
    markClass: styles.environmentMark,
  },
  {
    id: "personality",
    label: "根系",
    color: "#8d78a0",
    markClass: styles.personalityMark,
  },
  {
    id: "social",
    label: "树冠",
    color: "#7fa06d",
    markClass: styles.socialMark,
  },
  {
    id: "civilization",
    label: "果实",
    color: "#e0b84f",
    markClass: styles.civilizationMark,
  },
];

function getScore(
  dimensions: DimensionScore[],
  id: DimensionScore["id"],
) {
  return dimensions.find((dimension) => dimension.id === id)?.score ?? 0;
}

export function CreditTree({ dimensions }: CreditTreeProps) {
  const [hoveredDimension, setHoveredDimension] =
    useState<DimensionId | null>(null);
  const [selectedDimension, setSelectedDimension] =
    useState<DimensionId | null>(null);
  const personality = getScore(dimensions, "personality");
  const time = getScore(dimensions, "time");
  const environment = getScore(dimensions, "environment");
  const label = getScore(dimensions, "label");
  const social = getScore(dimensions, "social");
  const civilization = getScore(dimensions, "civilization");

  const leafCount = Math.round((label / 100) * leafPositions.length);
  const fruitCount = Math.round(
    (civilization / 100) * fruitPositions.length,
  );
  const rootCount = Math.max(
    3,
    Math.round((personality / 100) * rootPaths.length),
  );
  const branchCount = Math.max(
    3,
    Math.round((social / 100) * branchPaths.length),
  );
  const canopyMassCount = Math.round(
    ((label * 0.55 + social * 0.45) / 100) * canopyMassPositions.length,
  );
  const branchReach = 0.76 + (social / 100) * 0.24;
  const trunkWidth = 12 + personality / 8;
  const sceneBrightness = 0.28 + environment / 145;
  const activeDimensionId = hoveredDimension ?? selectedDimension;
  const activeDimension = dimensions.find(
    (dimension) => dimension.id === activeDimensionId,
  );
  const activeLegend = legendItems.find(
    (item) => item.id === activeDimensionId,
  );

  const getLayerClass = (id: DimensionId, baseClass: string) =>
    [
      baseClass,
      styles.interactiveLayer,
      activeDimensionId && activeDimensionId !== id
        ? styles.layerMuted
        : "",
      activeDimensionId === id ? styles.layerActive : "",
    ]
      .filter(Boolean)
      .join(" ");

  const previewLayer = (id: DimensionId) => ({
    onPointerEnter: () => setHoveredDimension(id),
    onPointerLeave: () =>
      setHoveredDimension((current) => (current === id ? null : current)),
  });

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal =
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const vertical =
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${horizontal * 5}px`,
    );
    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${vertical * 4}px`,
    );
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--pointer-x", "0px");
    event.currentTarget.style.setProperty("--pointer-y", "0px");
    setHoveredDimension(null);
  };

  return (
    <figure
      className={styles.frame}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {activeDimension && activeLegend ? (
        <div
          className={styles.dimensionDetail}
          style={
            {
              "--active-color": activeLegend.color,
            } as TreeStyle
          }
          aria-live="polite"
        >
          <span>
            {activeDimension.role} · {activeDimension.metric}
          </span>
          <strong>{activeDimension.name}</strong>
          <b>{activeDimension.score}</b>
          <small>{activeDimension.level}</small>
        </div>
      ) : null}
      <svg
        className={styles.tree}
        viewBox="0 0 720 730"
        role="img"
        aria-labelledby="credit-tree-title credit-tree-description"
      >
        <title id="credit-tree-title">你的六维信用生命树</title>
        <desc id="credit-tree-description">
          标签信用形成叶片，时间信用形成年轮，环境信用形成土壤与风雨，人格信用形成根系，社会信用形成树冠，文明信用形成果实与种子。
        </desc>

        <defs>
          <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#020505" />
            <stop offset="0.58" stopColor="#07100c" />
            <stop offset="1" stopColor="#171109" />
          </linearGradient>
          <radialGradient id="canopyAura" cx="50%" cy="44%" r="58%">
            <stop offset="0" stopColor="#f2bd55" stopOpacity="0.4" />
            <stop offset="0.48" stopColor="#b98126" stopOpacity="0.14" />
            <stop offset="1" stopColor="#111a10" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunGlow">
            <stop offset="0" stopColor="#fff3bd" stopOpacity="0.95" />
            <stop offset="0.25" stopColor="#eabf61" stopOpacity="0.82" />
            <stop offset="1" stopColor="#c98c2f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5e4122" />
            <stop offset="0.2" stopColor="#2d2114" />
            <stop offset="1" stopColor="#080705" />
          </linearGradient>
          <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3e2515" />
            <stop offset="0.34" stopColor="#916334" />
            <stop offset="0.57" stopColor="#d0a05b" />
            <stop offset="0.75" stopColor="#6e4527" />
            <stop offset="1" stopColor="#28180f" />
          </linearGradient>
          <linearGradient id="root" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c8954d" />
            <stop offset="0.45" stopColor="#895b2f" />
            <stop offset="1" stopColor="#3b2819" />
          </linearGradient>
          <linearGradient id="leafGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe38a" />
            <stop offset="0.42" stopColor="#c69735" />
            <stop offset="1" stopColor="#72531e" />
          </linearGradient>
          <linearGradient id="leafAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e7bd5e" />
            <stop offset="1" stopColor="#7d4e17" />
          </linearGradient>
          <linearGradient id="leafOlive" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a7b763" />
            <stop offset="1" stopColor="#425a28" />
          </linearGradient>
          <linearGradient id="leafGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#88a84e" />
            <stop offset="1" stopColor="#244321" />
          </linearGradient>
          <radialGradient id="leafMassGold" cx="46%" cy="38%" r="66%">
            <stop offset="0" stopColor="#b68b32" stopOpacity="0.9" />
            <stop offset="0.58" stopColor="#5d551e" stopOpacity="0.78" />
            <stop offset="1" stopColor="#172116" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="leafMassGreen" cx="46%" cy="38%" r="66%">
            <stop offset="0" stopColor="#657d31" stopOpacity="0.9" />
            <stop offset="0.58" stopColor="#334821" stopOpacity="0.8" />
            <stop offset="1" stopColor="#101b13" stopOpacity="0.32" />
          </radialGradient>
          <radialGradient id="fruitGold" cx="35%" cy="28%" r="68%">
            <stop offset="0" stopColor="#fff4b7" />
            <stop offset="0.26" stopColor="#eac45d" />
            <stop offset="0.68" stopColor="#a86a1c" />
            <stop offset="1" stopColor="#56310e" />
          </radialGradient>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="leafShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodColor="#000000"
              floodOpacity="0.7"
            />
          </filter>
          <filter id="treeShadow" x="-40%" y="-30%" width="180%" height="190%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="5"
              floodColor="#000000"
              floodOpacity="0.85"
            />
          </filter>
        </defs>

        <g className={styles.scene}>
        <rect width="720" height="730" fill="url(#nightSky)" />
        <ellipse
          className={getLayerClass("social", styles.canopyAura)}
          {...previewLayer("social")}
          cx="360"
          cy="242"
          rx="318"
          ry="210"
          fill="url(#canopyAura)"
          opacity={0.14 + social / 155}
        />
        <circle
          className={getLayerClass("environment", styles.sunAura)}
          {...previewLayer("environment")}
          cx="579"
          cy="115"
          r="78"
          fill="url(#sunGlow)"
          opacity={sceneBrightness}
        />
        <circle
          className={getLayerClass("environment", styles.sun)}
          {...previewLayer("environment")}
          cx="579"
          cy="115"
          r="25"
          fill="#e8bd65"
          opacity={0.64 + environment / 300}
        />

        <g
          className={getLayerClass("environment", styles.weather)}
          {...previewLayer("environment")}
          opacity={0.2 + environment / 170}
        >
          <path
            d="M56 171 C80 130 130 135 147 169 C179 160 208 180 211 211 H39 C27 190 35 174 56 171Z"
            fill="#24312f"
            opacity="0.72"
          />
          {Array.from({ length: 9 }, (_, index) => (
            <line
              className={styles.rain}
              key={index}
              x1={54 + index * 18}
              y1={215 + (index % 3) * 5}
              x2={43 + index * 18}
              y2={246 + (index % 3) * 5}
              stroke="#6a9da6"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ animationDelay: `${-(index % 6) * 0.2}s` }}
            />
          ))}
        </g>

        <g
          className={getLayerClass("environment", styles.soilLayer)}
          {...previewLayer("environment")}
        >
          <path
            d="M0 534 C128 507 229 519 360 523 C494 526 599 506 720 537 V730 H0Z"
            fill="url(#soil)"
            opacity={0.76 + environment / 430}
          />
          <path
            d="M0 539 C117 515 240 529 359 531 C481 533 602 513 720 540"
            fill="none"
            stroke="#d1a45f"
            strokeWidth="3"
            opacity={0.35 + environment / 220}
          />
          {soilParticles.map((particle, index) => (
            <circle
              key={`${particle.x}-${particle.y}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.radius}
              fill={index % 3 === 0 ? "#c79a54" : "#6f5533"}
              opacity={0.2 + environment / 220}
              style={{ animationDelay: particle.delay }}
            />
          ))}
        </g>

        <g
          className={getLayerClass("personality", styles.roots)}
          {...previewLayer("personality")}
          filter="url(#treeShadow)"
        >
          {rootPaths.map((path, index) => (
            <path
              className={styles.root}
              key={path}
              d={path}
              pathLength="1"
              fill="none"
              stroke="url(#root)"
              strokeWidth={
                index < 8
                  ? 7 + personality / 24
                  : 3 + personality / 35
              }
              strokeLinecap="round"
              opacity={index < rootCount ? 0.92 : 0.08}
              style={{ animationDelay: `${180 + index * 65}ms` }}
            />
          ))}
        </g>

        <g
          className={getLayerClass("social", styles.canopyMasses)}
          {...previewLayer("social")}
          filter="url(#leafShadow)"
        >
          {canopyMassPositions.map((mass, index) => (
            <ellipse
              key={`${mass.x}-${mass.y}`}
              cx={mass.x}
              cy={mass.y}
              rx={mass.rx}
              ry={mass.ry}
              fill={
                index % 3 === 0
                  ? "url(#leafMassGold)"
                  : "url(#leafMassGreen)"
              }
              opacity={index < canopyMassCount ? 0.78 : 0.035}
              style={{ animationDelay: `${-(index % 9) * 0.55}s` }}
            />
          ))}
        </g>

        <g
          className={getLayerClass("social", styles.branches)}
          {...previewLayer("social")}
          filter="url(#treeShadow)"
          transform={`translate(${360 - 360 * branchReach} 0) scale(${branchReach} 1)`}
        >
          {branchPaths.map((path, index) => (
            <path
              className={styles.branch}
              key={path}
              d={path}
              pathLength="1"
              fill="none"
              stroke="url(#trunk)"
              strokeWidth={
                index < 3
                  ? trunkWidth
                  : Math.max(5, trunkWidth - 5 - (index % 3))
              }
              strokeLinecap="round"
              opacity={index < branchCount ? 0.96 : 0.12}
              style={{ animationDelay: `${260 + index * 72}ms` }}
            />
          ))}
        </g>

        <g className={styles.trunk} filter="url(#treeShadow)">
          <path
            d={`M${335 - personality / 18} 548 C341 482 338 412 347 345 C350 319 370 319 374 346 C385 415 376 485 ${386 + personality / 18} 548Z`}
            fill="url(#trunk)"
          />
          <path
            d="M360 534 C351 477 356 423 360 363"
            fill="none"
            stroke="#e5bb72"
            strokeWidth={2 + personality / 42}
            strokeLinecap="round"
            opacity={0.24 + personality / 180}
          />
          <g
            className={getLayerClass("time", styles.rings)}
            {...previewLayer("time")}
          >
            <path
              d="M338 370 H382 V536 H338Z"
              fill="transparent"
              stroke="none"
            />
            {Array.from({ length: 7 }, (_, index) => (
              <path
                key={index}
                d={`M345 ${386 + index * 21} C354 ${394 + index * 21} 368 ${394 + index * 21} 378 ${386 + index * 21}`}
                fill="none"
                stroke="#d2a15d"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={
                  index < Math.max(1, Math.round(time / 15)) ? 0.66 : 0.12
                }
              />
            ))}
          </g>
        </g>

        <g
          className={getLayerClass("label", styles.leaves)}
          {...previewLayer("label")}
          filter="url(#leafShadow)"
        >
          {leafPositions.map((leaf, index) => {
            const visible = index < leafCount;

            return (
              <g
                className={styles.leaf}
                key={`${leaf.x}-${leaf.y}`}
                opacity={visible ? 0.96 : 0.075}
                style={{
                  animationDelay: `${-(index % 11) * 0.34}s`,
                  animationDuration: `${4.2 + (index % 5) * 0.55}s`,
                }}
                transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotation})`}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx={leaf.rx}
                  ry={leaf.ry}
                  fill={visible ? leafColors[index % leafColors.length] : "#3b442d"}
                />
                <path
                  d={`M${-leaf.rx + 2} 0 H${leaf.rx - 2}`}
                  stroke={visible ? "#f3d489" : "#667052"}
                  strokeWidth="0.8"
                  opacity="0.58"
                />
              </g>
            );
          })}
        </g>

        <g
          className={getLayerClass("civilization", styles.fruits)}
          {...previewLayer("civilization")}
          filter="url(#softGlow)"
        >
          {fruitPositions.map(([cx, cy], index) => {
            const visible = index < fruitCount;

            return (
              <g
                className={styles.fruit}
                key={`${cx}-${cy}`}
                opacity={visible ? 1 : 0.045}
                style={{
                  animationDelay: `${-(index % 6) * 0.48}s`,
                  animationDuration: `${3.4 + (index % 4) * 0.5}s`,
                }}
                transform={`translate(${cx} ${cy})`}
              >
                <path
                  d="M0 -9 C1 -15 5 -18 10 -20"
                  fill="none"
                  stroke="#927331"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle r={7 + (index % 3)} fill="url(#fruitGold)" />
                <circle
                  cx="-2.5"
                  cy="-2.5"
                  r="2"
                  fill="#fff4bd"
                  opacity="0.8"
                />
              </g>
            );
          })}
        </g>

        <g
          className={getLayerClass("civilization", styles.seeds)}
          {...previewLayer("civilization")}
          opacity={0.14 + civilization / 125}
        >
          <ellipse cx="536" cy="676" rx="8" ry="4" fill="#cf9b49" />
          <ellipse
            cx="555"
            cy="683"
            rx="8"
            ry="4"
            fill="#a66e2d"
            transform="rotate(-18 555 683)"
          />
          <path
            d="M584 688 C582 674 584 661 591 649 M590 663 C580 660 575 654 572 646 M588 670 C598 666 604 660 607 651"
            fill="none"
            stroke="#8da758"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <ellipse
            cx="592"
            cy="646"
            rx="8"
            ry="4"
            fill="#9ab35c"
            transform="rotate(-48 592 646)"
          />
        </g>
        </g>
      </svg>

      <figcaption className={styles.caption}>
        {legendItems.map((item) => {
          const dimension = dimensions.find(
            (candidate) => candidate.id === item.id,
          );

          return (
            <button
              className={styles.legendButton}
              key={item.id}
              type="button"
              aria-label={`${dimension?.name ?? item.label}，${dimension?.score ?? 0}分`}
              aria-pressed={selectedDimension === item.id}
              onClick={() =>
                setSelectedDimension((current) =>
                  current === item.id ? null : item.id,
                )
              }
              onPointerEnter={() => setHoveredDimension(item.id)}
              onPointerLeave={() => setHoveredDimension(null)}
              onFocus={() => setHoveredDimension(item.id)}
              onBlur={() => setHoveredDimension(null)}
              style={
                {
                  "--legend-color": item.color,
                } as TreeStyle
              }
            >
              <i className={item.markClass} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </figcaption>
    </figure>
  );
}
