// TODO: AudioChunkCollectorNode dokumentieren
class AudioChunkCollectorNode extends AudioWorkletProcessor {

    _stopProcessing = false
    _currentChunkIndex = 0

    constructor(options) {
        super()
        this._chunkDuration = options.processorOptions.chunkDuration
        this._sampleRate = options.processorOptions.sampleRate
        this._chunkBufferSize = this._chunkDuration * this._sampleRate
        this._chunkBuffer = new Float32Array(this._chunkBufferSize)
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
        // Nur verarbeiten, wenn mindestens ein Eingang verknüpft ist
        if (inputs && inputs.length > 0) {
            // Es wird nur der erste Eingang verarbeitet
            const firstInput = inputs[0]
            // Es muss mindestens ein Eingangskanal vorhanden sein
            if (firstInput.length > 0) {
                const firstInputChannel = firstInput[0]
                // Daten sammeln, bis genug zusammen gekommen ist
                for (let i = 0; i < firstInputChannel.length; i++, this._currentChunkIndex++) {
                    this._chunkBuffer[this._currentChunkIndex] = firstInputChannel[i]
                    if (this._currentChunkIndex >= this._chunkBufferSize - 1) {
                        // Wir haben 4 Sekunden zusammen, an Haupt-Thread melden
                        this.port.postMessage({ message: 'audioData', audioData: this._chunkBuffer })
                        this._currentChunkIndex = 0
                    }
                }
                // Daten an ersten Ausgang weiterleiten, wenn einer verbunden ist
                if (outputs && outputs.length > 0) {
                    const firstOutput = outputs[0]
                    // Es muss mindestens ein Ausgangskanal vorhanden sein, um die Daten weiterzuleiten
                    if (firstOutput.length > 0) {
                        const firstOutputChannel = firstOutput[0]
                        // Bytes einzeln kopieren
                        for (let j = 0; j < firstInputChannel.length; j++) {
                            firstOutputChannel[j] = firstInputChannel[j]
                        }
                    }
                }
            }
        }
        return true
    }
}

registerProcessor('audio-chunk-collector', AudioChunkCollectorNode)