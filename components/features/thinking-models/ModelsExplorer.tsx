"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  filterModelSummaries,
  type ModelSummary,
} from "@/lib/domain/model-filter";
import type { ThinkingModelLayer } from "@/lib/domain/thinking-models";
import { getLayerVisual } from "./layer-meta";
import styles from "./ThinkingModels.module.css";

interface ModelsExplorerProps {
  summaries: ModelSummary[];
  layers: ThinkingModelLayer[];
}

export function ModelsExplorer({ summaries, layers }: ModelsExplorerProps) {
  const [query, setQuery] = useState("");
  const [layerId, setLayerId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterModelSummaries(summaries, query, layerId),
    [summaries, query, layerId],
  );

  return (
    <>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="搜索模型名称、英文或定义…"
          aria-label="搜索思维模型"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className={styles.chips} role="group" aria-label="按层级筛选">
          <button
            type="button"
            className={
              layerId === null ? `${styles.chip} ${styles.chipActive}` : styles.chip
            }
            aria-pressed={layerId === null}
            onClick={() => setLayerId(null)}
          >
            全部
          </button>
          {layers.map((layer) => {
            const { color, Icon } = getLayerVisual(layer.id);
            const active = layerId === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                className={
                  active ? `${styles.chip} ${styles.chipActive}` : styles.chip
                }
                style={{ "--layer-color": color } as CSSProperties}
                aria-pressed={active}
                onClick={() => setLayerId(active ? null : layer.id)}
              >
                <Icon size={14} aria-hidden />
                {layer.name}
              </button>
            );
          })}
        </div>
        <p className={styles.resultCount}>共 {filtered.length} 个模型</p>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>没有匹配的模型</p>
      ) : (
        layers.map((layer) => {
          const models = filtered.filter((model) => model.layer === layer.id);
          if (models.length === 0) return null;
          const { color, Icon } = getLayerVisual(layer.id);
          return (
            <section
              key={layer.id}
              id={layer.id}
              className={styles.layer}
              style={{ "--layer-color": color } as CSSProperties}
            >
              <div className={styles.layerHeader}>
                <h2>
                  <span className={styles.layerBadge}>
                    <Icon size={20} aria-hidden />
                  </span>
                  {layer.name}
                </h2>
                <p>
                  {layer.theme} · 共 {models.length} 个模型
                </p>
              </div>
              <div className={styles.cardGrid}>
                {models.map((model) => (
                  <Link
                    key={model.id}
                    href={`/models/${model.id}`}
                    className={styles.card}
                  >
                    <span className={styles.cardTop}>
                      <Icon size={13} aria-hidden />
                      <span className={styles.cardNumber}>
                        {String(model.id).padStart(2, "0")}
                      </span>
                    </span>
                    <span className={styles.cardName}>{model.name}</span>
                    {model.nameEn ? (
                      <span className={styles.cardNameEn}>{model.nameEn}</span>
                    ) : null}
                    <span className={styles.cardDef}>{model.definition}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
