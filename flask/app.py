import os

from tracker_api import create_app
from tracker_api.settings import DEFAULT_HOST, DEFAULT_PORT

app = create_app()


if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    host = os.getenv("HOST", DEFAULT_HOST)
    port = int(os.getenv("PORT", str(DEFAULT_PORT)))
    app.run(debug=debug, host=host, port=port)
