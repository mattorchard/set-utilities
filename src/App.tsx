import React, { FormEvent, Fragment, useState } from "react";
import "./App.css";
import OptionsFieldSet from "./components/OptionsFieldSet";
import SourcesFieldset from "./components/SourcesFieldset";
import { applyOperationToSources, applyReplacements } from "./helpers/setUtils";
import ResultView from "./components/ResultView";
import CssColorVariableStyle from "./components/CssColorVariableStyle";
import { NonIdealState } from "@blueprintjs/core";
import AppSection from "./components/AppSection";
import NisList from "./components/NisList";
import OutputFieldset from "./components/OutputFieldset";
import ReplacementsList from "./components/ReplacementsList";
import DownloadMenuButton from "./components/DownloadMenuButton";
import { asTextFile, downloadFile, overwriteFile } from "./helpers/fileHelpers";
import { useBundle } from "./hooks/useBundle";
import RestoreBundleMessage from "./components/RestoreBundleMessage";

interface Result {
  report: RunReportItem[];
  options: RunOptions;
}

const App = () => {
  const {
    sources,
    options,
    replacements,
    isRestoreEnabled,
    restoreLastBundle,
    dismissLastBundle,
    isSaveInPlaceEnabled,
    addSources,
    removeSource,
    editSource,
    addReplacement,
    setOptions,
    setReplacements,
  } = useBundle();

  const [result, setResult] = useState<Result | null>(null);
  const [outputViewOptions, setOutputViewOptions] = useState<OutputViewOptions>(
    {
      isLineNumberEnabled: false,
      isHeadingEnabled: true,
    }
  );

  const handleDownloadSources = (sources: RunSource[]) =>
    sources
      .map((source) => asTextFile(source.name, source.content))
      .forEach((file) => downloadFile(file));

  const handleSaveInPlace = (sources: RunSource[]) =>
    Promise.all(
      sources
        .filter((source) => source.handle)
        .map((source) => overwriteFile(source.handle!, source.content))
    );

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
      <h1 className="visually-hidden">Set Utilities</h1>
      <form
        className={`app__form ${
          replacements.length > 0 && "app__form--with-replacements"
        }`}
        onSubmit={handleSubmit}
        data-scroll-container={true}
      >
        <div className="bumper" />
        <AppSection
          stepNumber={1}
          heading="Sources"
          isExpandEnabled={sources.length > 0}
        >
          <SourcesFieldset
            sources={sources}
            onAddSources={addSources}
            onRemoveSource={removeSource}
            onSourceChange={editSource}
          />
        </AppSection>
        <AppSection stepNumber={2} heading="Options">
          <OptionsFieldSet options={options} onChange={setOptions} />
        </AppSection>
        <AppSection stepNumber={3} heading="Results" isExpandEnabled>
          <OutputFieldset
            isSubmitEnabled={hasSufficientSources}
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
                onAddReplacement={addReplacement}
              />
            )}
            emptyRender={EmptyOutputNis}
            nonListRender={NoOutputNis}
          />
        </AppSection>
        {replacements.length > 0 && (
          <AppSection stepNumber={4} heading="Replacements" isExpandEnabled>
            <DownloadMenuButton
              isSaveInPlaceEnabled={isSaveInPlaceEnabled}
              onSaveInPlace={() =>
                handleSaveInPlace(
                  applyReplacements(sources!, options!, replacements, false)
                )
              }
              onDownloadAll={() =>
                handleDownloadSources(
                  applyReplacements(sources!, options!, replacements, true)
                )
              }
              onDownloadModified={() =>
                handleDownloadSources(
                  applyReplacements(sources!, options!, replacements, false)
                )
              }
            />
            <ReplacementsList
              replacements={replacements}
              onReplacementsChange={setReplacements}
            />
          </AppSection>
        )}
        <div className="bumper" />
      </form>

      <RestoreBundleMessage
        isEnabled={isRestoreEnabled}
        onRestore={restoreLastBundle}
        onDismiss={dismissLastBundle}
      />

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
