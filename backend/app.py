from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

from routes.auth import auth_bp
from routes.users import users_bp
from routes.sos import sos_bp
from routes.donors import donors_bp
from routes.nearby import nearby_bp

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Ensure SocketIO connects regardless of client domain for the intermediate project
socketio = SocketIO(app, cors_allowed_origins="*")

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(sos_bp, url_prefix='/api/sos')
app.register_blueprint(donors_bp, url_prefix='/api/donors')
app.register_blueprint(nearby_bp, url_prefix='/api/nearby')

@app.route('/')
def index():
    return "SafeHub Python Backend Running"

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    port = int(os.getenv("PORT", 4000))
    # run socketio wrapped app
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
