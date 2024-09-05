import { parseError } from "@/lib/parse-error";
import { Component, FC, ReactNode } from "react";

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
		<div className="bg-background -mt-[72px] pt-[82px] h-full">
			<div className="p-4 text-errorMessage">Error: {message}</div>
		</div>
	);
};
