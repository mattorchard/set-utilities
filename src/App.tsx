import React, { FormEvent, Fragment, useState } from "react";
import "./App.css";
import OptionsFieldSet from "./components/OptionsFieldSet";
import SourcesFieldset from "./components/SourcesFieldset";
import { applyOperationToSources } from "./helpers/setUtils";
import ResultView from "./components/ResultView";
import CssColorVariableStyle from "./components/CssColorVariableStyle";
import { Button, Icon, NonIdealState } from "@blueprintjs/core";
import AppSection from "./components/AppSection";

interface Result {
  report: RunReportItem[];
  options: RunOptions;
}

const App = () => {
  const [sources, setSources] = useState<RunSource[] | null>(null);
  const [options, setOptions] = useState<RunOptions | null>(null);

  const [result, setResult] = useState<Result | null>(null);

  const hasSufficientSources = sources && sources.length >= 2;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!options || !sources) return;
    console.log("Getting a result", { options, sources });
    const report = applyOperationToSources(sources, options);
    console.log("Got report", report);
    setResult({ report, options });
  };
  return (
    <Fragment>
      <form className="bp4-dark app__form" onSubmit={handleSubmit}>
        <div />
        <AppSection stepNumber={1} heading="Sources">
          <SourcesFieldset onChange={setSources} />
        </AppSection>
        <AppSection stepNumber={2} heading="Options">
          <OptionsFieldSet onChange={setOptions} />
        </AppSection>
        <AppSection stepNumber={3} heading="Output" isExpandEnabled>
          <Button
            style={{ backgroundColor: `var(--indigo-2)` }}
            large
            type="submit"
            disabled={!hasSufficientSources}
            icon={<Icon icon="tick-circle" />}
            title={
              hasSufficientSources
                ? ""
                : "You must have at least two sources to compare"
            }
          >
            Calculate
          </Button>
          {result ? (
            <ResultView
              report={result.report}
              isNamesEnabled={result.options.operation !== "intersection"}
            />
          ) : (
            <div>
              <NonIdealState icon="calculator">
                <h3 className="bp4-heading">View the output</h3>
                <p>
                  Results will display here with the original text and line
                  number of each segment.
                </p>
              </NonIdealState>
            </div>
          )}
        </AppSection>
        <div />
      </form>
      <CssColorVariableStyle />
    </Fragment>
  );
};

export default App;
