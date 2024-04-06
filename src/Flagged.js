import { Link, useLocation } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";

export default function Flagged() {
  const {state} = useLocation()
  const datetime = new Date(state.timestamp)
  return (
    <div>
      <div className="block h-24 border-b-2 bg-indigo-900 p-6">
        <h1 className="flex justify-center text-4xl font-bold text-white">
          <Link to={"/"}>SafeSphere</Link>
        </h1>
      </div>
      <div className="flex justify-center h-screen bg-blue-200">
        <div className="block w-4/5 h-3/5 border-2 m-32 pl-8 rounded-lg bg-white">
          <h2 className="text-2xl font-bold mt-6">Flagged Message:</h2>
          <h3 className="text-md text-blue-400 mt-2">
            <Link to={"/"}>Go back</Link>
          </h3>
          <div className="grid grid-cols-6 border-b-2 p-2 mt-6">
            <p className="col-span-2 text-l">{datetime.toLocaleString()}</p>
            <p className="col-span-4 text-xl text-red-600 font-bold">
              {state.text}
            </p>
          </div>
          <div className="grid grid-cols-12 gap-2 mt-6">
            <h2 className="col-span-1">Toxicity</h2>
            <ProgressBar
              className="col-span-2"
              completed={Math.round(
                state.analysis.attributeScores.TOXICITY.summaryScore.value * 100
              )}
            />
            <div className="col-span-9"></div>
            <h2 className="col-span-1">Identity Attack</h2>
            <ProgressBar
              className="col-span-2"
              completed={Math.round(
                state.analysis.attributeScores.IDENTITY_ATTACK.summaryScore
                  .value * 100
              )}
            />
            <div className="col-span-9"></div>
            <h2 className="col-span-1">Insult</h2>
            <ProgressBar
              className="col-span-2"
              completed={Math.round(
                state.analysis.attributeScores.INSULT.summaryScore.value * 100
              )}
            />
            <div className="col-span-9"></div>
            <h2 className="col-span-1">Profanity</h2>
            <ProgressBar
              className="col-span-2"
              completed={Math.round(
                state.analysis.attributeScores.PROFANITY.summaryScore.value *
                  100
              )}
            />
            <div className="col-span-9"></div>
            <h2 className="col-span-1">Severe Toxicity</h2>
            <ProgressBar
              className="col-span-2"
              completed={Math.round(
                state.analysis.attributeScores.SEVERE_TOXICITY.summaryScore
                  .value * 100
              )}
            />
            <div className="col-span-9"></div>
            <h2 className="col-span-1">Threat</h2>
            <ProgressBar
              className="col-span-2"
              completed={Math.round(
                state.analysis.attributeScores.THREAT.summaryScore.value * 100
              )}
            />
            <div className="col-span-9"></div>
          </div>
        </div>
      </div>
    </div>
  );  
}
