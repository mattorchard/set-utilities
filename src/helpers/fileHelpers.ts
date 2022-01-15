export const getFileContents = async (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onabort = () => reject(new Error(`Reader aborted`));
    reader.onerror = () => reject(new Error(`Reader Error`));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });
};
