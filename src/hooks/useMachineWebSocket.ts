import { useEffect, useState } from "react";

import type {
  MachineData,
  TelemetryPoint,
  ConnectionStatus,
} from "../types/machine";

export function useMachineWebSocket() {
  const [machines, setMachines] = useState<MachineData[]>([]);

  const [telemetryHistory, setTelemetryHistory] = useState<
    Record<string, TelemetryPoint[]>
  >({});

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | undefined;
    let isActive = true;

    const connectWebSocket = () => {
      if (!isActive) return;

      socket = new WebSocket("ws://localhost:8080");

      socket.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus("connected");
      };

      socket.onmessage = (event) => {
        const data: MachineData[] = JSON.parse(event.data);

        setMachines(data);

        setTelemetryHistory((previousHistory) => {
          const updatedHistory = { ...previousHistory };

          data.forEach((machine) => {
            const previousPoints =
              updatedHistory[machine.machineId] ?? [];

            const newPoint: TelemetryPoint = {
              timestamp: machine.timestamp,
              speed: machine.speed,
              temperature: machine.temperature,
            };

            updatedHistory[machine.machineId] = [
              ...previousPoints,
              newPoint,
            ].slice(-30);
          });

          return updatedHistory;
        });
      };

      socket.onclose = () => {
        if (!isActive) return;

        console.log("WebSocket disconnected");
        setConnectionStatus("reconnecting");

        reconnectTimer = window.setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      socket.onerror = () => {
        if (!isActive) return;

        setConnectionStatus("reconnecting");
      };
    };

    connectWebSocket();

    return () => {
      isActive = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      socket?.close();
    };
  }, []);

  return {
    machines,
    telemetryHistory,
    connectionStatus,
  };
}