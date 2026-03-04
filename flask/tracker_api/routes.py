from flask import Blueprint, current_app, jsonify, request

api_bp = Blueprint("tracker_api", __name__)


@api_bp.get("/health")
def health():
    service = current_app.config["TRACKER_SERVICE"]
    return jsonify(service.health_payload()), 200


@api_bp.post("/process_frame")
def process_frame():
    service = current_app.config["TRACKER_SERVICE"]
    payload = request.get_json(silent=True) or {}

    try:
        return jsonify(service.process_frame_payload(payload)), 200
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@api_bp.post("/reset_counter")
def reset_counter():
    service = current_app.config["TRACKER_SERVICE"]
    return jsonify(service.reset_counters()), 200
