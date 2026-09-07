interface Window {
  /**
   * File System Access API（Chrome / Edge 支持）。
   * lib.dom 尚未包含 showDirectoryPicker，这里做最小声明。
   */
  showDirectoryPicker?: (options?: {
    mode?: "read" | "readwrite";
  }) => Promise<FileSystemDirectoryHandle>;
}
