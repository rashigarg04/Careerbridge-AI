import { useState, useEffect } from "react";
import api from "../services/api";

function ServerStatus() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await api.get("/health");
        setMessage(response.data.message);
        setStatus("success");
      } catch (error) {
        setMessage("Cannot reach the server. Is the backend running?");
        setStatus("error");
      }
    };

    checkServer();
  }, []);

  return (
    <p>
      <strong>Server status: </strong>
      {status === "loading" && "Checking..."}
      {status === "success" && `✅ ${message}`}
      {status === "error" && `❌ ${message}`}
    </p>
  );
}

export default ServerStatus;