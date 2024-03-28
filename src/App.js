import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

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
    </div>
  );
}

export default App;
