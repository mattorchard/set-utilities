import React, { useState } from "react";
import "./App.css";
import OptionsFieldSet from "./components/OptionsFieldSet";
import SourcesFieldset from "./components/SourcesFieldset";
import { applyOperationToSources } from "./helpers/setUtils";
import ResultView from "./components/ResultView";
import CssColorVariableStyle from "./components/CssColorVariableStyle";
import { Button } from "@blueprintjs/core";

const App = () => {
  const [sources, setSources] = useState<RunSource[] | null>(null);
  const [runOptions, setRunOptions] = useState<RunOptions | null>(null);
  const [result, setResult] = useState<RunResult[][] | null>(null);

  const handleRun = () => {
    if (!runOptions || !sources) return;
    console.log("Getting a result", { runOptions, sources });
    const result = applyOperationToSources(sources, runOptions);
    console.log("Got a result", result);
    setResult(result);
  };
  return (
    <div className="bp4-dark app">
      <section>
        <h2 className="bp4-heading">Sources</h2>
        <SourcesFieldset onChange={setSources} />
      </section>
      <section>
        <h2 className="bp4-heading">Options</h2>
        <OptionsFieldSet onChange={setRunOptions} />
      </section>
      <section>
        {sources && runOptions && (
          <Button intent="success" large onClick={handleRun}>
            Submit
          </Button>
        )}
      </section>
      <section>{result && <ResultView result={result} />}</section>
      <CssColorVariableStyle />
    </div>
  );
};

export default App;
