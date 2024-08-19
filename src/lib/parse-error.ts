export const parseError = (error: unknown): string => {
  let message = 'An error occurred';

  if (
    error instanceof Error ||
    (error && typeof error === 'object' && 'message' in error)
  ) {
    message = error.message as string;

    if ('lineNumber' in error && 'column' in error) {
      message += ` (${error.lineNumber}:${error.column})`;
    } else if ('lineNumber' in error) {
      message += `(line ${error.lineNumber})`;
    } else if ('column' in error) {
      message += `(column ${error.column})`;
    }
  } else {
    message = String(error);
  }

  return message;
};
