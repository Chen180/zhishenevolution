export type HealthStatus = {
  status: "ok";
  timestamp: string;
};

export function createHealthStatus(now: Date): HealthStatus {
  return {
    status: "ok",
    timestamp: now.toISOString(),
  };
}
