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
		vscode.window.showInformationMessage('Ball started!!');
		vscode.commands.executeCommand("vsballView.focus");
	});
	const disposableWebview = vscode.window.registerWebviewViewProvider(
		"vsballView",
		new MyWebviewViewProvider(context.extensionUri)
	);
	context.subscriptions.push(disposableCommand, disposableWebview);
}

// This method is called when your extension is deactivated
export function deactivate() { }

export class MyWebviewViewProvider implements vscode.WebviewViewProvider {
	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		webviewView.webview.options = {
			enableScripts: true,
		};
		webviewView.webview.html = this.getWebviewContent(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async (message) => {
			switch (message.command) {
				case "showMessage":
					vscode.window.showInformationMessage(message.text);
					break;
			}
		});
	}
	getWebviewContent(webview: vscode.Webview) {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

		// Do the same for the stylesheet.
		const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));
		const ballUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'ball.svg'));
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesUri}" rel="stylesheet">

				<title>Cat Colors</title>
			</head>
			<body id="body">
				<img src="${ballUri}" />
				<div id="canvasContainer">
                    <canvas id="ballCanvas"></canvas>
                    <canvas id="foregroundEffectCanvas"></canvas>
                    <canvas id="backgroundEffectCanvas"></canvas>
                </div>
				<div id="background"></div>
				<p>"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever s"</p>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}