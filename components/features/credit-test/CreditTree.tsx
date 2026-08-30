import type { DimensionScore } from "@/lib/domain/credit-assessment";
import styles from "./CreditTree.module.css";

interface CreditTreeProps {
  dimensions: DimensionScore[];
}

const leafPositions = [
  [238, 94],
  [205, 109],
  [270, 112],
  [173, 130],
  [232, 131],
  [301, 137],
  [144, 157],
  [194, 158],
  [262, 158],
  [329, 164],
  [123, 190],
  [170, 190],
  [220, 184],
  [279, 190],
  [349, 194],
  [143, 222],
  [193, 216],
  [245, 219],
  [303, 220],
  [333, 238],
  [170, 246],
  [221, 248],
  [273, 249],
  [304, 268],
] as const;

const fruitPositions = [
  [179, 149],
  [257, 131],
  [314, 172],
  [145, 198],
  [221, 202],
  [286, 221],
  [188, 238],
  [330, 229],
] as const;

const rootPaths = [
  "M238 358 C205 377 181 403 154 438",
  "M238 359 C222 395 218 421 216 458",
  "M240 359 C260 395 272 426 284 458",
  "M237 357 C194 365 156 376 115 403",
  "M241 357 C283 370 319 389 356 420",
  "M235 356 C183 356 139 356 92 370",
  "M243 356 C295 356 340 360 390 382",
] as const;

function getScore(
  dimensions: DimensionScore[],
  id: DimensionScore["id"],
) {
  return dimensions.find((dimension) => dimension.id === id)?.score ?? 0;
}

export function CreditTree({ dimensions }: CreditTreeProps) {
  const personality = getScore(dimensions, "personality");
  const time = getScore(dimensions, "time");
  const environment = getScore(dimensions, "environment");
  const label = getScore(dimensions, "label");
  const social = getScore(dimensions, "social");
  const civilization = getScore(dimensions, "civilization");
  const leafCount = Math.round((label / 100) * leafPositions.length);
  const fruitCount = Math.round((civilization / 100) * fruitPositions.length);
  const rootCount = Math.max(1, Math.round((personality / 100) * rootPaths.length));
  const ringCount = Math.max(1, Math.round((time / 100) * 5));
  const branchReach = 0.72 + (social / 100) * 0.28;

  return (
    <div className={styles.frame}>
      <svg
        className={styles.tree}
        viewBox="0 0 480 500"
        role="img"
        aria-labelledby="credit-tree-title credit-tree-description"
      >
        <title id="credit-tree-title">你的六维信用生命树</title>
        <desc id="credit-tree-description">
          根系、年轮、环境、叶片、树冠和果实分别反映六个信用维度的当前分数。
        </desc>

        <g
          className={styles.weather}
          style={{ opacity: 0.25 + environment / 140 }}
        >
          <circle cx="390" cy="74" r="24" fill="#d79a26" />
          <path
            d="M74 110 C91 83 128 88 137 113 C159 112 169 126 169 143 H70 C58 128 61 116 74 110Z"
            fill="#dce7e8"
          />
          <path
            d="M86 153 L78 173 M111 153 L103 173 M136 153 L128 173"
            stroke="#287c8e"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <path
          d="M56 357 C142 340 331 341 424 358"
          fill="none"
          stroke="#b98656"
          strokeWidth={6 + environment / 10}
          strokeLinecap="round"
          opacity={0.35 + environment / 180}
        />
        <path
          d="M76 374 C173 361 319 366 405 379"
          fill="none"
          stroke="#5e7f58"
          strokeWidth="3"
          strokeDasharray="8 10"
          opacity={0.35 + environment / 180}
        />

        <g className={styles.roots}>
          {rootPaths.map((path, index) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="#85543a"
              strokeWidth={index < 3 ? 10 : 6}
              strokeLinecap="round"
              opacity={index < rootCount ? 0.9 : 0.12}
            />
          ))}
        </g>

        <g
          className={styles.canopyBranches}
          transform={`translate(${240 - 240 * branchReach} 0) scale(${branchReach} 1)`}
        >
          <path
            d="M240 331 C230 286 198 250 145 215 C113 194 92 174 77 145"
            fill="none"
            stroke="#684a35"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M240 320 C260 270 301 247 354 220 C382 206 398 183 410 154"
            fill="none"
            stroke="#684a35"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M236 300 C225 254 226 194 239 126"
            fill="none"
            stroke="#684a35"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M216 275 C179 246 142 238 105 239 M262 272 C300 244 338 243 377 250"
            fill="none"
            stroke="#684a35"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>

        <path
          d="M222 354 C224 316 220 279 226 242 C230 216 249 216 254 243 C260 283 255 320 258 355Z"
          fill="#79543a"
          opacity="0.96"
        />

        <g className={styles.rings}>
          {Array.from({ length: 5 }, (_, index) => (
            <path
              key={index}
              d={`M229 ${276 + index * 15} C237 ${281 + index * 15} 247 ${281 + index * 15} 253 ${276 + index * 15}`}
              fill="none"
              stroke="#d7ad7b"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={index < ringCount ? 0.95 : 0.15}
            />
          ))}
        </g>

        <g className={styles.leaves}>
          {leafPositions.map(([cx, cy], index) => (
            <ellipse
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx="15"
              ry="10"
              transform={`rotate(${index % 2 === 0 ? -18 : 20} ${cx} ${cy})`}
              fill={index % 3 === 0 ? "#2f855a" : index % 3 === 1 ? "#3f9463" : "#64a66f"}
              opacity={index < leafCount ? 0.96 : 0.1}
            />
          ))}
        </g>

        <g className={styles.fruits}>
          {fruitPositions.map(([cx, cy], index) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="8"
              fill="#c24d36"
              stroke="#ffffff"
              strokeWidth="2"
              opacity={index < fruitCount ? 1 : 0.08}
            />
          ))}
        </g>
      </svg>

      <div className={styles.caption} aria-hidden="true">
        <span>根系</span>
        <span>年轮</span>
        <span>风雨</span>
        <span>叶片</span>
        <span>树冠</span>
        <span>果实</span>
      </div>
    </div>
  );
}
