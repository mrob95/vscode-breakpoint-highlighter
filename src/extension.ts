import * as vscode from 'vscode';

const breakpointDecorationType = vscode.window.createTextEditorDecorationType({
	isWholeLine: true,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    after: {
        color: "#FF0000",
    }
});

function updateDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const breakpoints = vscode.debug.breakpoints;
	const docPath = editor.document.uri.toString();

    const decorations = [];
    for (const b of breakpoints as vscode.SourceBreakpoint[]) {
        if (b.location === undefined || b.location.uri.toString() !== docPath) {
            continue;
        }

        const line = b.location.range.start.line;
        const range = new vscode.Range(line, 0, line, 0);
        var decoration = {range: range} as vscode.DecorationOptions;

        if (b.condition) {
            decoration.renderOptions = {
                after: {
                    contentText: " ⬤ " + b.condition,
                },
            };
        } else if (b.logMessage) {
            decoration.renderOptions = {
                after: {
                    contentText: " ◆ " + b.logMessage,
                },
            };

        }
        decorations.push(decoration);
    }

    editor.setDecorations(breakpointDecorationType, decorations);
}

export function activate(context: vscode.ExtensionContext) {
	vscode.window.onDidChangeActiveTextEditor(updateDecorations);
	vscode.debug.onDidChangeBreakpoints(updateDecorations);
	updateDecorations();
}

export function deactivate() {}
