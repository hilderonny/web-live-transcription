from flask import Flask, request, send_from_directory, jsonify
import os
import numpy as np

print('Importing faster_whisper ...')

from faster_whisper import WhisperModel

device = 'cuda' # 'cpu'
model = 'large-v2'

print('Loading faster_whisper on %s with model %s ...' % (device, model))

faster_whisper_model = WhisperModel( model_size_or_path = model, device = device, compute_type = 'int8', download_root='./data/faster-whisper/' )
faster_whisper_model_version = os.listdir('./data/faster-whisper/models--guillaumekln--faster-whisper-' + model + '/snapshots')[0]


print('Preparing webserver ...')

app = Flask(__name__, static_folder='public')

# Root: index.html ausliefern
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Weitere statische Dateien (JS, CSS etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# POST-API-Endpunkt für Transkription
@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    content = request.data  # enthält die rohen Binärdaten

    # Float32Array aus den Binärdaten erstellen
    float_array = np.frombuffer(content, dtype=np.float32)

    # Transkribieren
    segments, info = faster_whisper_model.transcribe(float_array, task = 'transcribe')

    # print('Detected language "%s" with probability %f' % (info.language, info.language_probability))

    transcriptions = []

    for segment in segments:
        # print('[%.2fs -> %.2fs] %s' % (segment.start, segment.end, segment.text))
        transcriptions.append({
            "start": segment.start,
            "end": segment.end,
            "text": segment.text.strip()
        })

    # Antwort zusammenbauen
    return jsonify({
        "texts": transcriptions,
        "language": info.language
    })    


print('Starting webserver ...')

if __name__ == '__main__':
    app.run(debug=True)
