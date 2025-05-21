// TODO: StreamToBackendProcessor dokumentieren
class StreamToBackendProcessor extends AudioWorkletProcessor {

    _stopProcessing = false

    constructor() {
        super()
        this.port.onmessage = (event) => {
            if (event.data.message === 'stop') {
                this._stopProcessing = true
            }
        }
    }

    process(inputs, outputs) {
        if (this._stopProcessing) {
            return false
        }
        // Nur verarbeiten, wenn Eingang verknüpft ist
        if (inputs && inputs.length > 0) {
            // Es wird nur der erste Eingang verarbeitet
            const firstInput = inputs[0]
            // Daten an ersten Ausgang weiterleiten, wenn einer verbunden ist
            if (outputs && outputs.length > 0) {
                const firstOutput = outputs[0]
                // Die Anzahl der Kanäle muss stimmen
                if (firstInput.length === firstOutput.length) {
                    // Alle Kanäle verarbeiten
                    for (let i = 0; i < firstInput.length; i++) {
                        const inputChannel = firstInput[i]
                        const outputChannel = firstOutput[i]
                        // Bytes einzeln kopieren
                        for (let j = 0; j < inputChannel.length; j++) {
                            outputChannel[j] = inputChannel[j]
                        }
                    }
                }
            }
        }
        return true
    }
}

registerProcessor('stream-to-backend-processor', StreamToBackendProcessor)