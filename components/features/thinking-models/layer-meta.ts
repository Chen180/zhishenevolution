import {
  Brain,
  Eye,
  GitFork,
  Landmark,
  Lightbulb,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * 七个思维模型层级的视觉标识（主题色 + 图标）。
 * 展示层关注点，与 lib/domain 的数据层分离。
 */
export interface LayerVisual {
  color: string;
  Icon: LucideIcon;
}

const LAYER_VISUALS: Record<string, LayerVisual> = {
  cognition: { color: "#6e98aa", Icon: Brain },
  decision: { color: "#b9684d", Icon: GitFork },
  growth: { color: "#7fa06d", Icon: Sprout },
  psychology: { color: "#8d78a0", Icon: Eye },
  society: { color: "#d9ad57", Icon: Users },
  philosophy: { color: "#e0b84f", Icon: Landmark },
  innovation: { color: "#c96f5f", Icon: Lightbulb },
};

export function getLayerVisual(layerId: string): LayerVisual {
  return LAYER_VISUALS[layerId] ?? { color: "#c99b43", Icon: Lightbulb };
}
