from flask import Blueprint, jsonify, request
import random

nearby_bp = Blueprint('nearby', __name__)

@nearby_bp.route('/<category>', methods=['GET'])
def get_nearby(category):
    lat_str = request.args.get('lat')
    lng_str = request.args.get('lng')

    if not lat_str or not lng_str:
        return jsonify({"message": "lat and lng required"}), 400

    lat = float(lat_str)
    lng = float(lng_str)

    # In a real app we would query Google Places API, Mapbox, or OpenStreetMap.
    # For this intermediate project, we generate some mock nearby places.
    places = []
    category_names = {
        "hospital": ["City Hospital", "General Hospital", "Care Clinic", "Apollo Hospital"],
        "police": ["Central Police Station", "Local Police Dept", "Highway Patrol"],
        "fire": ["Fire Station 1", "City Fire Dept", "Rescue Squad"]
    }
    
    names = category_names.get(category, [f"{category.capitalize()} Center"])
    
    for i in range(3):
        # Generate random small coordinates offset (.01 to .03 deg)
        lat_offset = random.uniform(-0.03, 0.03)
        lng_offset = random.uniform(-0.03, 0.03)
        
        places.append({
            "name": random.choice(names) + f" {i+1}",
            "lat": lat + lat_offset,
            "lng": lng + lng_offset,
            "address": f"{random.randint(1,999)} Local Street, City",
            "phone": f"555-{random.randint(1000,9999)}"
        })
        
    return jsonify(places), 200
