import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
  console.log("Frontend connected");

  const interval = setInterval(() => {
    const machines = [
      {
        machineId: "EX-001",
        name: "Excavator 01",
        status: "RUNNING",
        speed: Math.floor(Math.random() * 20),
        temperature: Math.floor(Math.random() * 20) + 60,
        timestamp: new Date().toISOString(),
      },
      {
        machineId: "TR-002",
        name: "Truck 02",
        status: "RUNNING",
        speed: Math.floor(Math.random() * 40),
        temperature: Math.floor(Math.random() * 15) + 55,
        timestamp: new Date().toISOString(),
      },
      {
        machineId: "DR-003",
        name: "Drill 03",
        status: "IDLE",
        speed: 0,
        temperature: Math.floor(Math.random() * 10) + 45,
        timestamp: new Date().toISOString(),
      },
    ];

    socket.send(JSON.stringify(machines));
  }, 1000);

  socket.on("close", () => {
    console.log("Frontend disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server running on ws://localhost:8080");