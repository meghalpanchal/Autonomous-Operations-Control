export type MachineHealth =
  | "HEALTHY"
  | "IDLE"
  | "WARNING"
  | "CRITICAL";

type MachineHealthInput = {
  status: string;
  temperature: number;
};

export function getMachineHealth(
  machine: MachineHealthInput,
): MachineHealth {
  if (machine.temperature >= 90) {
    return "CRITICAL";
  }

  if (machine.temperature >= 80) {
    return "WARNING";
  }

  if (machine.status.toUpperCase() === "IDLE") {
    return "IDLE";
  }

  return "HEALTHY";
}