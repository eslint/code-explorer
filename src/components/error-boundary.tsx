import { Component, type FC, type ReactNode } from "react";
import { parseError } from "@/lib/parse-error";

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
	state: State = {
		hasError: false,
	};

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error: error };
	}

	render() {
		if (this.state.hasError) {
			const message = parseError(this.state.error);
			return <ErrorState message={message} />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;

export const withErrorBoundary = (Children: FC) => {
	return function ErrorBoundaryWrapper() {
		return (
			<ErrorBoundary>
				<Children />
			</ErrorBoundary>
		);
	};
};

export const ErrorState = ({ message }: { message: string }) => {
	return (
		<div className="bg-red-50 dark:bg-gray-800 pl-1.5 pt-1.5 h-full">
			<div className="p-4 text-red-600 dark:text-red-400">
				Error: {message}
			</div>
		</div>
	);
};
