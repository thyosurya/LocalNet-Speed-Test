from flask import Flask
import os


def create_app():
    # Make Flask look for templates/ and static/ at the project root
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    templates_path = os.path.join(project_root, 'templates')
    static_path = os.path.join(project_root, 'static')

    app = Flask(__name__, template_folder=templates_path, static_folder=static_path)

    from .routes.main import main_bp
    from .routes.download import download_bp
    from .routes.upload import upload_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(download_bp)
    app.register_blueprint(upload_bp)

    return app
