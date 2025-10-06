from flask import Blueprint, Response
import os

download_bp = Blueprint('download', __name__)

@download_bp.route('/download')
def download():
    # Generate data dummy (ukuran 10MB)
    chunk_size = 1024 * 1024  # 1 MB
    total_size = 10 * chunk_size

    def generate():
        sent = 0
        data = os.urandom(chunk_size)
        while sent < total_size:
            yield data
            sent += chunk_size

    headers = {
        'Content-Type': 'application/octet-stream',
        'Content-Length': str(total_size)
    }
    return Response(generate(), headers=headers)
