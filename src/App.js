import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

function App() {
  const [data, setData] = useState("");
  const [transcriptions, setTranscriptions] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("connect", () => {
        setData(`You connected with id: ${socketRef.current.id}`);
      });

      // Emit event to start transcription
      socketRef.current.emit("startTranscription");

      socketRef.current.on("transcription", (newTranscription) => {
        setTranscriptions((prevTranscriptions) => [
          ...prevTranscriptions,
          newTranscription,
        ]);
      });
    }

    // disconnect the socket when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <p>{data}</p>
      <h2>Live Transcription</h2>
      {transcriptions.map((transcription, index) => (
        <p key={index}>{transcription}</p>
      ))}
    </div>
  );
}

export default App;
