"use client";

import { FileSelectorPanelPresenter } from "./FileSelectorPanelPresenter";
import { useFileSelectorPanel } from "./useFileSelectorPanel";

type Props = {
  className?: string;
};

export function FileSelectorPanelContainer({ className }: Props) {
  const {
    errorMessage,
    inputRef,
    isDragging,
    isLoading,
    result,
    sources,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    handleUpload,
    openPicker,
    removeSource,
  } = useFileSelectorPanel();

  return (
    <FileSelectorPanelPresenter
      className={className}
      errorMessage={errorMessage}
      inputRef={inputRef}
      isDragging={isDragging}
      isLoading={isLoading}
      result={result}
      sources={sources}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onInputChange={handleInputChange}
      onOpenPicker={openPicker}
      onRemoveSource={removeSource}
      onUpload={handleUpload}
    />
  );
}

export default FileSelectorPanelContainer;