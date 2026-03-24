from flask import Blueprint, request, jsonify
from utils.db import sos_collection, users_collection
from utils.auth import token_required
from bson.objectid import ObjectId
import datetime
import os
from twilio.rest import Client

sos_bp = Blueprint('sos', __name__)

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
from_number = os.getenv("TWILIO_PHONE_NUMBER")

has_twilio = account_sid and auth_token and from_number

def send_sms(to_phone, message_str):
    if not has_twilio:
        print(f"Twilio not configured. Skipping SMS to {to_phone}: {message_str}")
        return
    try:
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=message_str,
            from_=from_number,
            to=to_phone
        )
        print(f"SMS sent to {to_phone}")
    except Exception as e:
        print(f"Failed to send SMS to {to_phone}: {str(e)}")

@sos_bp.route('/trigger', methods=['POST'])
@token_required
def trigger_sos(current_user_id):
    data = request.json
    lat = data.get('lat')
    lng = data.get('lng')

    if not lat or not lng:
        return jsonify({"message": "Location is required"}), 400

    user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    contacts = user.get("emergencyContacts", [])
    contact_ids = [c["_id"] for c in contacts]

    alert = {
        "userId": current_user_id,
        "location": {"lat": lat, "lng": lng},
        "notifiedContacts": contact_ids,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "status": "Active"
    }

    result = sos_collection.insert_one(alert)

    # Note: Socket emission is handled in node via req.app.locals.io. 
    # In Flask we will import socketio directly.
    from app import socketio
    
    # Emit socket event to contacts if we had a complex tracking map
    socketio.emit("sos:triggered", {
        "alertId": str(result.inserted_id),
        "user": {"id": str(user["_id"]), "name": user.get("name"), "phone": user.get("phone")},
        "location": {"lat": lat, "lng": lng},
        "timestamp": alert["timestamp"]
    })

    # Send SMS
    google_maps_link = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"
    message = f"SOS! {user.get('name')} is in an emergency. Location: {google_maps_link}"
    
    for contact in contacts:
        if contact.get("phone"):
            send_sms(contact["phone"], message)

    return jsonify({"message": "SOS triggered successfully", "alertId": str(result.inserted_id)}), 201

@sos_bp.route('/history', methods=['GET'])
@token_required
def get_history(current_user_id):
    history = list(sos_collection.find({"userId": current_user_id}).sort("timestamp", -1).limit(50))
    for h in history:
        h["_id"] = str(h["_id"])
    return jsonify(history), 200

@sos_bp.route('/all', methods=['GET'])
def get_all():
    alerts = list(sos_collection.find().sort("timestamp", -1).limit(200))
    for a in alerts:
        a["_id"] = str(a["_id"])
        # populate user name for simple admin display
        user = users_collection.find_one({"_id": ObjectId(a["userId"])})
        if user:
            a["userId"] = {"name": user.get("name", "Unknown")}
    return jsonify(alerts), 200
