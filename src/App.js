import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

function App() {
  const [data, setData] = useState("");
  const [transcriptions, setTranscriptions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
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
        ({ transcript, analysisResult, timestamp }) => {
          console.log("transcript", transcript);
          console.log("analysisResult", analysisResult);
          setTranscriptions((prevTranscriptions) => [
            ...prevTranscriptions,
            { text: transcript, analysis: analysisResult, timestamp },
          ]);
        }
      );

      socketRef.current.on("recordingStatus", ({ recording }) => {
        setIsRecording(recording);
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

  const toggleTranscription = async () => {
    if (isRecording) {
      handleStopTranscription();
    } else {
      handleStartTranscription();
    }
  };

  const handleStartTranscription = () => {
    socketRef.current.emit("startTranscription");
  };

  const handleStopTranscription = () => {
    socketRef.current.emit("stopTranscription");
  };

  return (
    <div>
      <p>{data}</p>
      <button onClick={toggleTranscription}>
        {isRecording ? "Stop Transcription" : "Start Transcription"}
      </button>
      <h2>Live Transcription</h2>
      {transcriptions.map((transcription, index) => (
        <div key={index}>
          <p>{transcription.timestamp}</p>
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
