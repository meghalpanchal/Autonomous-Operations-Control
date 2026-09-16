export type MachineData = {
  machineId: string;
  name: string;
  status: string;
  speed: number;
  temperature: number;
  timestamp: string;
};

export type TelemetryPoint = {
  timestamp: string;
  speed: number;
  temperature: number;
};

export type ConnectionStatus =
  | "connected"
  | "reconnecting"
  | "disconnected";