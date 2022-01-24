export const getFileContents = async (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onabort = () => reject(new Error(`Reader aborted`));
    reader.onerror = () => reject(new Error(`Reader Error`));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });
};

export const downloadFile = async (file: File) => {
  const href = URL.createObjectURL(file);
  try {
    const anchor = document.createElement("a");
    anchor.setAttribute("download", file.name);
    anchor.setAttribute("href", href);
    anchor.click();
  } finally {
    URL.revokeObjectURL(href);
  }
};

const hasFileExtension = (fileName: string) => /\.\w+/.test(fileName);

export const asTextFile = (name: string, content: string): File =>
  new File([content], hasFileExtension(name) ? name : `${name}.txt`);

export const overwriteFile = async (
  handle: FileSystemFileHandle,
  content: string
) => {
  const writable = await handle.createWritable();
  try {
    await writable.write(content);
  } finally {
    await writable.close();
  }
};
