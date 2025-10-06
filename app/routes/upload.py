from flask import Blueprint, request, jsonify
import time

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload():
    start_time = time.time()
    data = request.data  # ambil data biner dari body
    size_bytes = len(data)
    duration = time.time() - start_time

    if duration == 0:
        duration = 0.0001  # hindari pembagian nol

    speed_mbps = (size_bytes * 8 / duration) / 1_000_000
    return jsonify({
        "size_bytes": size_bytes,
        "duration_sec": duration,
        "speed_mbps": round(speed_mbps, 2)
    })
