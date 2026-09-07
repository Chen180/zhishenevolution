import { describe, expect, it } from "vitest";
import {
  THINKING_MODEL_LAYERS,
  getAllModels,
  getModelById,
  getModelsByLayer,
} from "../../lib/domain/thinking-models";

describe("thinking models data", () => {
  it("contains exactly 100 models with continuous ids", () => {
    const models = getAllModels();

    expect(models).toHaveLength(100);
    models.forEach((model, index) => {
      expect(model.id).toBe(index + 1);
    });
  });

  it("covers seven layers matching the source outline", () => {
    expect(THINKING_MODEL_LAYERS.map((layer) => layer.id)).toEqual([
      "cognition",
      "decision",
      "growth",
      "psychology",
      "society",
      "philosophy",
      "innovation",
    ]);

    for (const layer of THINKING_MODEL_LAYERS) {
      const models = getModelsByLayer(layer.id);
      expect(models).toHaveLength(layer.to - layer.from + 1);
      expect(models[0].id).toBe(layer.from);
      expect(models.at(-1)?.id).toBe(layer.to);
    }
  });

  it("has every field populated for each model", () => {
    for (const model of getAllModels()) {
      expect(model.name.length).toBeGreaterThan(0);
      expect(model.definition.length).toBeGreaterThan(0);
      expect(model.principle.length).toBeGreaterThan(0);
      expect(model.background.length).toBeGreaterThan(0);
      expect(model.story.length).toBeGreaterThan(0);
      expect(model.scenarios.length).toBeGreaterThan(0);
      expect(model.methods.length).toBeGreaterThan(0);
      expect(model.pitfalls.length).toBeGreaterThan(0);
      expect(model.books.main.length).toBeGreaterThan(0);
    }
  });

  it("resolves models by id", () => {
    expect(getModelById(1)?.name).toBe("第一性原理");
    expect(getModelById(100)?.id).toBe(100);
    expect(getModelById(101)).toBeUndefined();
  });
});
