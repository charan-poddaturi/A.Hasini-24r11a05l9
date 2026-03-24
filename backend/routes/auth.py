import bcrypt
import jwt
import datetime
from flask import Blueprint, request, jsonify
from utils.db import users_collection
import os

auth_bp = Blueprint('auth', __name__)
JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_python_key_123")

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"message": "Please provide name, email, and password"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # Hash password
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), salt)

    user = {
        "name": name,
        "email": email,
        "password": hashed_pw.decode('utf-8'),
        "emergencyContacts": []
    }
    
    result = users_collection.insert_one(user)
    user_id = str(result.inserted_id)

    # Generate token
    token = jwt.encode({
        "userId": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({"token": token, "user": {"id": user_id, "name": name, "email": email}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Please provide email and password"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"message": "Invalid email or password"}), 401

    user_id = str(user['_id'])
    token = jwt.encode({
        "userId": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {"id": user_id, "name": user.get("name"), "email": email}
    }), 200
