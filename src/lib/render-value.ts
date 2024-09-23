export const renderValue = (value: unknown): string[] => {
	if (Array.isArray(value)) {
		return ["Array", `[${value.length} elements]`];
	}

	if (typeof value === "object" && value !== null) {
		const keys = Object.keys(value);
		return [
			(value as { type: string })?.type,
			keys.length > 3
				? `{${keys.slice(0, 3).join(", ")}, ...}`
				: `{${keys.join(", ")}}`,
		];
	}

	if (typeof value === "boolean") {
		return ["boolean"];
	}

	return [String(value)];
};
