'use client';

import { Editor as MonacoEditor, OnMount } from '@monaco-editor/react';
import { useExplorer } from '@/hooks/use-explorer';
import { useEffect, useRef } from 'react';
import type { ComponentProps, FC } from 'react';
import * as monacoEditor from 'monaco-editor';

type EditorProperties = ComponentProps<typeof MonacoEditor>;

export const Editor: FC<EditorProperties> = (properties) => {
  const { theme = "system" } = useExplorer();
  const explorer = useExplorer();
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const editorContainer = editorRef.current.getDomNode();
    if (!editorContainer) return;

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();

      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        const text = await file.text();
        if (editorRef.current) {
          editorRef.current.setValue(text);
        }
      }
    };

    editorContainer.addEventListener('dragover', handleDragOver);
    editorContainer.addEventListener('drop', handleDrop);

    return () => {
      editorContainer.removeEventListener('dragover', handleDragOver);
      editorContainer.removeEventListener('drop', handleDrop);
    };
  }, [editorRef.current]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <MonacoEditor
      height="100%"
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("eslint-light", {
          base: "vs",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#FFFFFF00",
          },
        });

        monaco.editor.defineTheme("eslint-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#FFFFFF00",
          },
        });
      }}
      options={{
        minimap: {
          enabled: false,
        },
        wordWrap: explorer.wrap ? 'on' : 'off'
      }}
      theme={theme === 'dark' ? 'eslint-dark' : 'eslint-light'}
      onMount={handleEditorDidMount}
      {...properties}
    />
  );
};
