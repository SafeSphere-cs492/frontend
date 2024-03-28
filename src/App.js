import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

  const handleTranscriptionStart = () => {
    // Assuming your backend is running on localhost:3000 and endpoint as /api/audio/transcribe-audio
    const apiUrl = "http://localhost:3000/api/audio/transcribe-audio";

    fetch(apiUrl, { method: "POST" })
      .then((response) => response.text())
      .then((data) => {
        console.log("Success:", data);
        // Handle success response
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error response
      });
  };

  const handleTranscriptionStop = () => {
    // Send a request to the backend to stop transcription
    fetch("http://localhost:3000/api/audio/stop-transcription", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetch("http://localhost:3000/getData")
      .then((response) => response.text())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <div>
      <p>{data}</p>
      <button onClick={handleTranscriptionStart}>Start Transcription</button>
      <button onClick={handleTranscriptionStop}>Stop Transcription</button>
    </div>
  );
}

export default App;
