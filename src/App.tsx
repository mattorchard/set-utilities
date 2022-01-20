import React, { FormEvent, Fragment, useState } from "react";
import "./App.css";
import OptionsFieldSet from "./components/OptionsFieldSet";
import SourcesFieldset from "./components/SourcesFieldset";
import { applyOperationToSources } from "./helpers/setUtils";
import ResultView from "./components/ResultView";
import CssColorVariableStyle from "./components/CssColorVariableStyle";
import { Button, Icon, NonIdealState, Switch } from "@blueprintjs/core";
import AppSection from "./components/AppSection";
import NisList from "./components/NisList";
import Box from "./components/Box";

interface Result {
  report: RunReportItem[];
  options: RunOptions;
}

const App = () => {
  const [sources, setSources] = useState<RunSource[] | null>(null);
  const [options, setOptions] = useState<RunOptions | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isHeadingEnabled, setIsHeadingEnabled] = useState(true);
  const [isLineNumberEnabled, setIsLineNumberEnabled] = useState(true);

  const hasSufficientSources = sources && sources.length >= 2;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!options || !sources) return;
    console.log("Getting a result", { options, sources });
    const report = applyOperationToSources(sources, options);
    console.log("Got report", report);
    setResult({ report, options });
    if (options.operation === "intersection") setIsHeadingEnabled(false);
  };
  return (
    <Fragment>
      <form className="bp4-dark app__form" onSubmit={handleSubmit}>
        <div className="bumper" />
        <AppSection stepNumber={1} heading="Sources">
          <SourcesFieldset onChange={setSources} />
        </AppSection>
        <AppSection stepNumber={2} heading="Options">
          <OptionsFieldSet onChange={setOptions} />
        </AppSection>
        <AppSection stepNumber={3} heading="Output" isExpandEnabled>
          <Box mb={8} alignItems="start">
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
            {result && (
              <Box
                ml="auto"
                flexDirection="column"
                className="app-form__switches"
              >
                <Switch
                  labelElement="Headings"
                  checked={isHeadingEnabled}
                  onChange={(e) => setIsHeadingEnabled(e.currentTarget.checked)}
                />
                <Switch
                  labelElement="Line №"
                  checked={isLineNumberEnabled}
                  onChange={(e) =>
                    setIsLineNumberEnabled(e.currentTarget.checked)
                  }
                />
              </Box>
            )}
          </Box>
          <NisList
            list={result?.report}
            defaultRender={() => (
              <ResultView
                report={result!.report}
                includeHeadings={isHeadingEnabled}
                includeLineNumbers={isLineNumberEnabled}
              />
            )}
            emptyRender={EmptyOutputNis}
            nonListRender={NoOutputNis}
          />
        </AppSection>
        <div className="bumper" />
      </form>
      <CssColorVariableStyle />
    </Fragment>
  );
};

const NoOutputNis = () => (
  <div>
    <NonIdealState icon="calculator">
      <h3 className="bp4-heading">View the output</h3>
      <p>
        Results will display here with the original text and line number of each
        segment.
      </p>
    </NonIdealState>
  </div>
);

const EmptyOutputNis = () => (
  <div>
    <NonIdealState icon="zoom-out">
      <h3 className="bp4-heading">No results</h3>
      <p>No results found. Check your sources and options.</p>
    </NonIdealState>
  </div>
);

export default App;
