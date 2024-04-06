import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

export default function Conversations() {
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
      <div className="block h-24 border-b-2 bg-indigo-900 p-6">
        <h1 className="flex justify-center text-4xl font-bold text-white">
          <Link to={'/'}>SafeSphere</Link>
        </h1>
      </div>
      <div className="flex justify-center h-screen bg-blue-200">
        <div className="block w-4/5 h-3/5 border-2 m-32 pl-8 rounded-lg bg-white">
          <button
            className="bg-indigo-900 w-64 text-white font-bold py-4 px-4 rounded mt-6"
            onClick={toggleTranscription}
          >
            {isRecording ? "Stop Transcription" : "Start Transcription"}
          </button>
          <h2 className="text-2xl font-bold mt-6">Conversation:</h2>
          <div className="overflow-scroll h-80 mt-4">
            {transcriptions.map((transcription, index) => (
              <div className="grid grid-cols-6 border-b-2 p-2" key={index}>
                {transcription.analysis.attributeScores.TOXICITY.summaryScore
                  .value < 0.7 && (
                  <p className="col-span-1">{transcription.timestamp}</p>
                )}
                {transcription.analysis.attributeScores.TOXICITY.summaryScore
                  .value < 0.7 && (
                  <p className="col-span-4">{transcription.text}</p>
                )}
                {transcription.analysis.attributeScores.TOXICITY.summaryScore
                  .value >= 0.7 && (
                  <p className="col-span-1 text-red-600 font-bold">
                    {transcription.timestamp}
                  </p>
                )}
                {transcription.analysis.attributeScores.TOXICITY.summaryScore
                  .value >= 0.7 && (
                  <p className="col-span-4 text-red-600 font-bold">
                    {transcription.text}
                  </p>
                )}
                {transcription.analysis.attributeScores.TOXICITY.summaryScore
                  .value >= 0.7 && (
                  <Link to={"/flagged"} state={transcription}>
                    <button className="bg-red-600 text-white font-bold py-4 px-4 rounded">
                      Flagged!
                    </button>
                  </Link>
                )}
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
