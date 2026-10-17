type ErrorLike = {
	message: string;
	lineNumber?: number;
	line?: number;
	column?: number;
};

export const parseError = (error: unknown): string => {
	if (!error || typeof error !== "object" || !("message" in error)) {
		return String(error);
	}

	const { message, lineNumber, line, column } = error as ErrorLike;
	const errorLine = lineNumber ?? line;

	return errorLine === undefined || column === undefined
		? message
		: `${message} (${errorLine}:${column})`;
};
