from flask import Blueprint, render_template, jsonify

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/ping')
def ping():
    # Simple health/ping endpoint used by the front-end.
    # Return JSON so clients can safely call `res.json()` without errors.
    return jsonify({"message": "pong"}), 200
