export const parseError = (error: unknown): string => {
  let message = 'An error occurred';

  if (error instanceof Error) {
    // eslint-disable-next-line prefer-destructuring, @typescript-eslint/prefer-destructuring
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message as string;
  } else {
    message = String(error);
  }

  return message;
};
