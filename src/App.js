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

      socketRef.current.on(
        "transcriptionAnalysis",
        ({ transcript, analysisResult }) => {
          console.log("transcript", transcript);
          console.log("analysisResult", analysisResult);
          setTranscriptions((prevTranscriptions) => [
            ...prevTranscriptions,
            { text: transcript, analysis: analysisResult },
          ]);
        }
      );
    }

    // disconnect the socket when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleStartTranscription = () => {
    socketRef.current.emit("startTranscription");
  };

  const handleStopTranscription = () => {
    socketRef.current.emit("stopTranscription");
    setTranscriptions([]);
  };

  return (
    <div>
      <p>{data}</p>
      <button onClick={handleStartTranscription}>Start Transcription</button>
      <button onClick={handleStopTranscription}>Stop Transcription</button>
      <h2>Live Transcription</h2>
      {transcriptions.map((transcription, index) => (
        <div key={index}>
          <p>{transcription.text}</p>
          <p>
            Analysis Score:{" "}
            {transcription.analysis.attributeScores.TOXICITY.summaryScore.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
