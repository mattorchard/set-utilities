import React, { FormEvent, Fragment, useState } from "react";
import "./App.css";
import OptionsFieldSet from "./components/OptionsFieldSet";
import SourcesFieldset from "./components/SourcesFieldset";
import { applyOperationToSources } from "./helpers/setUtils";
import ResultView from "./components/ResultView";
import CssColorVariableStyle from "./components/CssColorVariableStyle";
import { NonIdealState } from "@blueprintjs/core";
import AppSection from "./components/AppSection";
import NisList from "./components/NisList";
import OutputFieldset from "./components/OutputFieldset";
import ReplacementsList from "./components/ReplacementsList";
import DownloadMenuButton from "./components/DownloadMenuButton";

interface Result {
  report: RunReportItem[];
  options: RunOptions;
}

const App = () => {
  const [sources, setSources] = useState<RunSource[] | null>(null);
  const [options, setOptions] = useState<RunOptions | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [outputViewOptions, setOutputViewOptions] = useState<OutputViewOptions>(
    {
      isLineNumberEnabled: true,
      isHeadingEnabled: true,
    }
  );
  const [replacements, setReplacements] = useState<RunReplacement[]>([]);

  const handleAddReplacement = (replacement: RunReplacement) =>
    setReplacements((r) => [replacement, ...r]);

  const hasSufficientSources = sources && sources.length >= 2;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!options || !sources) return;
    const report = applyOperationToSources(sources, options);
    console.log("Got report", report);
    setResult({ report, options });
  };
  return (
    <Fragment>
      <form
        className={`app__form ${
          replacements.length > 0 && "app__form--with-replacements"
        }`}
        onSubmit={handleSubmit}
        data-scroll-container={true}
      >
        <div className="bumper" />
        <AppSection stepNumber={1} heading="Sources">
          <SourcesFieldset onChange={setSources} />
        </AppSection>
        <AppSection stepNumber={2} heading="Options">
          <OptionsFieldSet onChange={setOptions} />
        </AppSection>
        <AppSection stepNumber={3} heading="Results" isExpandEnabled>
          <OutputFieldset
            isSubmitEnabled={!!hasSufficientSources}
            hasOutput={!!result}
            options={outputViewOptions}
            onOptionsChanged={setOutputViewOptions}
          />
          <NisList
            list={result?.report}
            defaultRender={() => (
              <ResultView
                report={result!.report}
                includeHeadings={outputViewOptions.isHeadingEnabled}
                includeLineNumbers={outputViewOptions.isLineNumberEnabled}
                onAddReplacement={handleAddReplacement}
              />
            )}
            emptyRender={EmptyOutputNis}
            nonListRender={NoOutputNis}
          />
        </AppSection>
        {replacements.length > 0 && (
          <AppSection stepNumber={4} heading="Replacements" isExpandEnabled>
            <DownloadMenuButton
              // Todo: This
              onDownloadAll={console.debug}
              // Todo: This
              onDownloadModified={console.debug}
            />
            <ReplacementsList
              replacements={replacements}
              onReplacementsChange={setReplacements}
            />
          </AppSection>
        )}
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
