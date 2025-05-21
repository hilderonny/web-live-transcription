# web-live-transcription

Mit diesem Repository kann man Live-Transkriptionen im Browser machen.

## WebVAD

Der erste Test läuft mit WebVAD und [TaskBridge](https://github.com/hilderonny/taskbridge).

Dazu wird eine [TaskBridge](https://github.com/hilderonny/taskbridge)-Instanz mit [Transcribe](https://github.com/hilderonny/taskworker-transcribe) und [Translate](https://github.com/hilderonny/taskworker-translate) Workern benötigt.

Dabei wird fortlaufend das Mikrofon aufgenommen und per [VAD](https://github.com/ricky0123/vad) Gesprochenes detektiert. Sobald ein Satz oder Absatz erkannt wurde, wird der Audioschnipsel transkribiert und der erkannte Text angezeigt.

Falls es sich bei der erkannten Sprache nicht um Deutsch handelt, wird der Text anschließend ins Deutsche übersetzt und die Übersetzung ebenfalls angezeigt.

![Screenshot](./doc/screenshot.png)


Die URL zur TaskBridge wird in der Datei `./js/config.json` festgelegt.

Am Einfachsten lässt sich diese Anwendung in Visual Studio Code mit der Erweiterung **Live Server** starten.