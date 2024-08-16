'use client';

import { Editor as MonacoEditor, OnMount } from '@monaco-editor/react';
import { useExplorer } from '@/hooks/use-explorer';
import { useEffect, useRef, useState } from 'react';
import type { ComponentProps, FC } from 'react';
import * as monacoEditor from 'monaco-editor';
import { useTheme } from './theme-provider';
import clsx from 'clsx';

type EditorProperties = ComponentProps<typeof MonacoEditor> & {
  readOnly?: boolean;
};

export const Editor: FC<EditorProperties> = ({ readOnly, ...properties }) => {
  const { theme } = useTheme();
  const explorer = useExplorer();
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorMounted, setIsEditorMounted] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const dropMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current || !editorContainerRef.current) return;

    const editorContainer = editorContainerRef.current;

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = event.dataTransfer?.files;
      if (files?.length) {
        const file = files[0];
        const text = await file.text();
        if (editorRef.current) {
          editorRef.current.setValue(text);
        }
      }
    };

    editorContainer.addEventListener('dragover', handleDragOver);
    editorContainer.addEventListener('dragleave', handleDragLeave);
    editorContainer.addEventListener('drop', handleDrop);

    const dropMessageDiv = dropMessageRef.current;
    if (dropMessageDiv) {
      dropMessageDiv.addEventListener('dragover', handleDragOver);
      dropMessageDiv.addEventListener('dragleave', handleDragLeave);
      dropMessageDiv.addEventListener('drop', handleDrop);
    }

    return () => {
      editorContainer.removeEventListener('dragover', handleDragOver);
      editorContainer.removeEventListener('dragleave', handleDragLeave);
      editorContainer.removeEventListener('drop', handleDrop);

      if (dropMessageDiv) {
        dropMessageDiv.removeEventListener('dragover', handleDragOver);
        dropMessageDiv.removeEventListener('dragleave', handleDragLeave);
        dropMessageDiv.removeEventListener('drop', handleDrop);
      }
    };
  }, [isEditorMounted]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    setIsEditorMounted(true);
  };

  const editorClasses = clsx(
    'h-full relative',
    {
      'bg-dropContainer': isDragOver,
      'bg-transparent': !isDragOver,
    }
  );
  const dropMessageClasses = clsx(
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dropMessage text-white p-2 rounded-lg z-10',
    {
      'flex': isDragOver,
      'hidden': !isDragOver,
    }
  );

  return (
    <div ref={editorContainerRef} className={editorClasses}>
      <div ref={dropMessageRef} className={dropMessageClasses}>
        Drop here to read file
      </div>
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
          wordWrap: explorer.wrap ? 'on' : 'off',
          readOnly: readOnly ?? false,
        }}
        theme={theme === 'dark' ? 'eslint-dark' : 'eslint-light'}
        onMount={handleEditorDidMount}
        {...properties}
      />
    </div>
  );
};
