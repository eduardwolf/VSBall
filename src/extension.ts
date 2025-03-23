import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('"VSBALL is now active!');
	vscode.window.showInformationMessage('VSBALL started');

	// The command has been defined in the package.json file
	// The commandId parameter must match the command field in package.json
	const disposableCommand = vscode.commands.registerCommand('vsball.startBall', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Ball started');
		vscode.commands.executeCommand("vsballView.focus");
	});
	const disposableWebview = vscode.window.registerWebviewViewProvider(
		"vsballView",
		new MyWebviewViewProvider(context)
	);
	context.subscriptions.push(disposableCommand,disposableWebview);
}

// This method is called when your extension is deactivated
export function deactivate() { }

export class MyWebviewViewProvider implements vscode.WebviewViewProvider {
	constructor(private context: vscode.ExtensionContext) { }

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		webviewView.webview.options = {
			enableScripts: true,
		};

		webviewView.webview.html = this.getWebviewContent();

		webviewView.webview.onDidReceiveMessage(async (message) => {
			switch (message.command) {
				case "showMessage":
					vscode.window.showInformationMessage(message.text);
					break;
			}
		});
	}
	getWebviewContent() {
		return `
				<!DOCTYPE html>
				<html>
				<body>
					<h1>Hello from Side Panel!</h1>
					<button onclick="sendMessage()">Send Message</button>
					<script>
						const vscode = acquireVsCodeApi();
						function sendMessage() {
							vscode.postMessage({
								command: 'showMessage',
								text: 'Hello from Webview!'
							});
						}
					</script>
				</body>
				</html>
			`;
	}
}
