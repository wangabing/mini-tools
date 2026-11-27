import { useRef, useState } from "react";
import { messageFor } from "./mediaBrowser";

export function useMediaTask() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function run(task: () => unknown | Promise<unknown>) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try { await task(); }
    catch (failure) { setError(messageFor(failure)); }
    finally {
      running.current = false;
      setBusy(false);
    }
  }

  return { busy, error, message, setError, setMessage, run };
}
