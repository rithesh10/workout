from flask import Flask
from flask_cors import CORS

from tracker_api.routes import api_bp
from tracker_api.service import TrackerService


def create_app():
    app = Flask(__name__)
    app.secret_key = "your_secret_key"
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config["TRACKER_SERVICE"] = TrackerService()
    app.register_blueprint(api_bp)

    return app
