import * as vscode from 'vscode';
import {
	STATIC_CANVAS_ID,
	DYNAMIC_CANVAS_ID,
	PLAYER_SOURCE,
	PLAYER_ID,
	BALL_SOURCE,
	BALL_ID,
	RIM_SOURCE,
	RIM_ID,
	BACKBOARD_SOURCE,
	BACKBOARD_ID,
	POLE_SOURCE,
	POLE_ID,
	GROUND_SOURCE,
	GROUND_ID,
	PLAYER_SHOOTING_SOURCE,
	PLAYER_SHOOTING_ID,
	PLAYER_RUNNING1_ID,
	PLAYER_RUNNING1_SOURCE,
	PLAYER_RUNNING2_ID,
	PLAYER_RUNNING2_SOURCE,
	PLAYER_IDLE1_ID,
	PLAYER_IDLE1_SOURCE,
	PLAYER_IDLE2_ID,
	PLAYER_IDLE2_SOURCE
} from '../src/scripts/magicVals';

// Called when extension activated, registers a new WebviewView provider, which is attached to the explorer using its id in package.json contributes object
export function activate(context: vscode.ExtensionContext) {
	console.log('"VSBALL is now active!');
	vscode.window.showInformationMessage('VSBALL started');

	const disposableCommand = vscode.commands.registerCommand('vsball.startBall', () => {
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
		const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));
		const playerImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', PLAYER_SOURCE));
		const playerShootingImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', PLAYER_SHOOTING_SOURCE));
		const playerRunning1ImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', PLAYER_RUNNING1_SOURCE));
		const playerRunning2ImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', PLAYER_RUNNING2_SOURCE));
		const playerIdle1ImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', PLAYER_IDLE1_SOURCE));
		const playerIdle2ImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', PLAYER_IDLE2_SOURCE));



		const ballImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', BALL_SOURCE));
		const rimImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', RIM_SOURCE));
		const backBoardImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', BACKBOARD_SOURCE));
		const poleImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', POLE_SOURCE));
		const groundImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', GROUND_SOURCE));

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
				<div id="canvasContainer">
                    <canvas id="${DYNAMIC_CANVAS_ID}">
						
					</canvas>
                    <canvas id="${STATIC_CANVAS_ID}">
						
					</canvas>
						<img id="${PLAYER_ID}" src="${playerImageUri}" />
						<img id="${PLAYER_SHOOTING_ID}" src="${playerShootingImageUri}" />
						<img id="${PLAYER_RUNNING1_ID}" src="${playerRunning1ImageUri}" />
						<img id="${PLAYER_RUNNING2_ID}" src="${playerRunning2ImageUri}" />
						<img id="${PLAYER_IDLE1_ID}" src="${playerIdle1ImageUri}" />
						<img id="${PLAYER_IDLE2_ID}" src="${playerIdle2ImageUri}" />

						<img id="${BALL_ID}" src="${ballImageUri}"/>
						<img id="${RIM_ID}" src="${rimImageUri}"/>
						<img id="${BACKBOARD_ID}" src="${backBoardImageUri}"/>
						<img id="${POLE_ID}" src="${poleImageUri}"/>
						<img id="${GROUND_ID}" src="${groundImageUri}"/>
                </div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

let getNonce = () => {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};