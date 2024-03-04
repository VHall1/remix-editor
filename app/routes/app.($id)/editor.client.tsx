import * as React from "react";
import EditorJS from "@editorjs/editorjs";

export function Editor() {
  const editorRef = React.useRef<EditorJS>();

  React.useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS("editorjs");
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return <div id="editorjs" />;
}
