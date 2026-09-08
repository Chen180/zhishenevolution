import { describe, expect, it } from "vitest";
import { CREDIT_DIMENSION_ORDER } from "../../lib/domain/credit-questions";
import { MODEL_RECOMMENDATIONS } from "../../lib/domain/model-recommendations";
import { getModelById } from "../../lib/domain/thinking-models";

describe("model recommendations", () => {
  it("covers every credit dimension", () => {
    expect(Object.keys(MODEL_RECOMMENDATIONS).sort()).toEqual(
      [...CREDIT_DIMENSION_ORDER].sort(),
    );
  });

  it("recommends three valid models per dimension", () => {
    for (const recommendation of Object.values(MODEL_RECOMMENDATIONS)) {
      expect(recommendation.reason.length).toBeGreaterThan(0);
      expect(recommendation.models).toHaveLength(3);

      const ids = recommendation.models.map((model) => model.id);
      expect(new Set(ids).size).toBe(3);

      for (const model of recommendation.models) {
        const fromData = getModelById(model.id);
        expect(fromData, `model ${model.id} should exist`).toBeDefined();
        expect(fromData?.name).toBe(model.name);
      }
    }
  });
});
