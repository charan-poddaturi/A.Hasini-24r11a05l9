import os
import jwt
from functools import wraps
from flask import request, jsonify

JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_python_key_123")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Format: "Bearer <token>"
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401
            
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user_id = data.get("userId")
            if not current_user_id:
                raise Exception("Invalid token structure")
        except Exception as e:
            return jsonify({"message": "Token is invalid!"}), 401

        return f(current_user_id, *args, **kwargs)
    return decorated
