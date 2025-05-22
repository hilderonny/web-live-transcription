from flask import Flask, request, send_from_directory, jsonify
import os
import array

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
    raw_data = request.data  # enthält die rohen Binärdaten

    # Float32Array aus den Binärdaten erstellen
    float_array = array.array('f')  # 'f' = 4-Byte float
    float_array.frombytes(raw_data)

    # Antwort zusammenbauen
    return jsonify({
        "received_floats": list(float_array),
        "count": len(float_array)
    })    

if __name__ == '__main__':
    app.run(debug=True)
