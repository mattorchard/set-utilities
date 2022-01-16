import React, { FormEvent, Fragment, useState } from "react";
import "./App.css";
import OptionsFieldSet from "./components/OptionsFieldSet";
import SourcesFieldset from "./components/SourcesFieldset";
import { applyOperationToSources } from "./helpers/setUtils";
import ResultView from "./components/ResultView";
import CssColorVariableStyle from "./components/CssColorVariableStyle";
import { Button, NonIdealState } from "@blueprintjs/core";
import CircleDot from "./components/CircleDot";
import Box from "./components/Box";

interface Result {
  report: RunReportItem[];
  options: RunOptions;
}

const App = () => {
  const [sources, setSources] = useState<RunSource[] | null>(null);
  const [options, setOptions] = useState<RunOptions | null>(null);

  const [result, setResult] = useState<Result | null>(null);

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
        <section>
          <SectionHeading stepNumber={1}>Sources</SectionHeading>
          <SourcesFieldset onChange={setSources} />
        </section>
        <section>
          <SectionHeading stepNumber={2}>Options</SectionHeading>
          <OptionsFieldSet onChange={setOptions} />
        </section>
        <section>
          <SectionHeading stepNumber={3}>Output</SectionHeading>

          {result ? (
            <>
              <Button
                intent="success"
                large
                type="submit"
                disabled={!sources || sources.length < 2}
                title={
                  sources && sources.length < 2
                    ? "You must have at least two sources to compare"
                    : ""
                }
              >
                Calculate
              </Button>
              <ResultView
                report={result.report}
                isNamesEnabled={result.options.operation !== "intersection"}
              />
            </>
          ) : (
            <div>
              <NonIdealState icon="calculator">
                <h3 className="bp4-heading">
                  {sources && sources.length < 2
                    ? "Connect your sources"
                    : "Choose options and submit to view results"}
                </h3>
                <Button
                  intent="success"
                  large
                  type="submit"
                  disabled={!sources || sources.length < 2}
                  title={
                    sources && sources.length < 2
                      ? "You must have at least two sources to compare"
                      : ""
                  }
                >
                  Calculate
                </Button>
              </NonIdealState>
            </div>
          )}
        </section>
      </form>
      <CssColorVariableStyle />
    </Fragment>
  );
};

const SectionHeading: React.FC<{ stepNumber: number }> = ({
  stepNumber,
  children,
}) => (
  <Box as="h2" className="bp4-heading" alignItems="center">
    <Box mr={8}>
      <CircleDot>{stepNumber}</CircleDot>
    </Box>
    {children}
  </Box>
);

export default App;
