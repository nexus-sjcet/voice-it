import * as vscode from 'vscode';
import { exec, spawn } from 'child_process';

export class AudioRecorder {
    private recordingProcess: any; // Change 'any' to a more specific type if possible

    constructor() {
        this.recordingProcess = null;
    }

    startRecording() {
        if (this.recordingProcess) {
            vscode.window.showInformationMessage('Recording is already in progress.');
        } else {
            const audioRecordingCommand = 'ffmpeg -f dshow -i audio="Microphone Array (Realtek(R) Audio)" -t 10 ./output.wav';
            this.recordingProcess = spawn(audioRecordingCommand, { shell: true });

            this.recordingProcess.stdout.on('data', (data: any) => {
                console.log(`stdout: ${data}`);
            });

            this.recordingProcess.stderr.on('data', (data: any) => {
                console.error(`stderr: ${data}`);
            });

            this.recordingProcess.on('exit', (code: number) => {
                console.log(`Recording process exited with code ${code}`);
                this.recordingProcess = null;
            });

            vscode.window.showInformationMessage('Recording started.');
        }
    }

    stopRecording() {
        if (this.recordingProcess) {
            this.recordingProcess.kill();
            this.recordingProcess = null;
            vscode.window.showInformationMessage('Recording stopped.');
        } else {
            vscode.window.showInformationMessage('No recording in progress.');
        }
    }
}
