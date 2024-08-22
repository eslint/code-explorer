import { parseError } from "@/lib/parse-error";
import { Component, ErrorInfo, FC, ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: new Error(),
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error: error };
	}

	public componentDidUpdate(
		_: Readonly<Props>,
		prevState: Readonly<State>,
	): void {
		if (prevState.hasError) {
			this.setState({ hasError: false, error: new Error() });
		}
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			const message = parseError(this.state.error);
			return (
				<div className="bg-red-50 -mt-[72px] pt-[72px] h-full">
					<div className="p-4 text-red-700">{message}</div>
				</div>
			);
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
