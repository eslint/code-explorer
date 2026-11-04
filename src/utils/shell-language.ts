import { LanguageSupport, StreamLanguage } from "@codemirror/language";

type ShellState = {
	quote: "'" | '"' | null;
	canStartComment: boolean;
};

const shellLanguage = StreamLanguage.define<ShellState>({
	startState: () => ({
		quote: null,
		canStartComment: true,
	}),
	blankLine: state => {
		state.canStartComment = true;
	},
	token: (stream, state) => {
		if (state.quote) {
			if (state.quote === '"' && stream.peek() === "\\") {
				stream.next();
				if (!stream.eol()) {
					stream.next();
				}
				return "string";
			}

			if (stream.eat(state.quote)) {
				state.quote = null;
			} else {
				stream.next();
			}
			return "string";
		}

		if (stream.eatSpace()) {
			state.canStartComment = true;
			return null;
		}

		if (stream.peek() === "#" && (stream.sol() || state.canStartComment)) {
			stream.skipToEnd();
			return "comment";
		}

		state.canStartComment = false;

		if (stream.match(/['"]/)) {
			state.quote = stream.current() as "'" | '"';
			return "string";
		}

		if (
			stream.match(/\$\{[^}\n]*\}/) ||
			stream.match(/\$[A-Za-z_][\w]*|\$[0-9@*#?$!_-]/)
		) {
			return "variableName";
		}

		if (stream.match(/`[^`]*`/)) {
			return "string";
		}

		if (
			stream.match(
				/^(?:if|then|else|elif|fi|case|esac|for|select|while|until|do|done|in|function|time|coproc)\b/,
			)
		) {
			return "keyword";
		}

		if (stream.match(/^\d+/)) {
			return "number";
		}

		if (stream.match(/^(?:&&|\|\||;;|;&|;;&|[|&;<>()[\]])/)) {
			return "operator";
		}

		stream.next();
		return null;
	},
});

export const shellLanguageSupport = new LanguageSupport(shellLanguage);
