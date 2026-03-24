from flask import Blueprint, request, jsonify
from utils.db import donors_collection
from utils.auth import token_required
from bson.objectid import ObjectId

donors_bp = Blueprint('donors', __name__)

@donors_bp.route('/register', methods=['POST'])
@token_required
def register_donor(current_user_id):
    data = request.json
    blood_type = data.get('bloodType')
    
    if not blood_type:
        return jsonify({"message": "Blood type is required"}), 400
        
    donor = {
        "userId": current_user_id,
        "bloodType": blood_type,
        "isAvailable": data.get("isAvailable", True)
    }
    
    # Upsert donor record
    donors_collection.update_one(
        {"userId": current_user_id},
        {"$set": donor},
        upsert=True
    )
    
    return jsonify({"message": "Successfully registered as donor!"}), 201

@donors_bp.route('/search', methods=['GET'])
@token_required
def search_donors(current_user_id):
    blood_type = request.args.get('bloodType')
    city = request.args.get('city')
    
    query = {"isAvailable": True}
    if blood_type:
        query["bloodType"] = blood_type
        
    donors = list(donors_collection.find(query))
    import copy
    
    results = []
    # For simplicity, simulating join with users collection manually
    from utils.db import users_collection
    for d in donors:
        user = users_collection.find_one({"_id": ObjectId(d["userId"])})
        if user:
            # Simple matching on city if provided
            if city and city.lower() not in user.get("address", {}).get("city", "").lower():
                continue
            
            res = copy.deepcopy(d)
            res["_id"] = str(res["_id"])
            res["name"] = user.get("name")
            res["phone"] = user.get("phone", "")
            res["address"] = user.get("address", {})
            results.append(res)
            
    return jsonify(results), 200

@donors_bp.route('/request', methods=['POST'])
@token_required
def request_donor(current_user_id):
    # In a full app this would send a notification.
    # For now simply return success.
    return jsonify({"message": "Request sent successfully"}), 200
