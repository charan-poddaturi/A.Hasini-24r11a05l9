from flask import Blueprint, request, jsonify
from utils.db import users_collection
from utils.auth import token_required
from bson.objectid import ObjectId
import uuid

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    user['_id'] = str(user['_id'])
    user.pop('password', None) # hide password
    return jsonify(user), 200

@users_bp.route('/emergency-contacts', methods=['POST'])
@token_required
def add_contact(current_user_id):
    data = request.json
    if not data.get("name") or not data.get("phone"):
        return jsonify({"message": "Name and phone are required"}), 400
        
    contact = {
        "_id": str(uuid.uuid4()),
        "name": data["name"],
        "relation": data.get("relation", ""),
        "phone": data["phone"],
        "isVerified": False
    }

    users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$push": {"emergencyContacts": contact}}
    )
    
    return jsonify(contact), 201

@users_bp.route('/emergency-contacts/<contact_id>', methods=['DELETE'])
@token_required
def remove_contact(current_user_id, contact_id):
    users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$pull": {"emergencyContacts": {"_id": contact_id}}}
    )
    return jsonify({"message": "Contact removed successfully"}), 200
