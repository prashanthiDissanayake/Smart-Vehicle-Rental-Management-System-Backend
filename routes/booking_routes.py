from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

from auth_middleware import token_required
from db import db

booking_routes = Blueprint("booking_routes", __name__)
collection_bookings = db["booking"]
collection_vehicles = db["vehicle"]

def serialize_booking(b):
    b["_id"] = str(b["_id"])
    return b

# CREATE
@booking_routes.route("/bookings", methods=["POST"])
@token_required
def add_booking():
    data = request.get_json()
    result = collection_bookings.insert_one(data)
    data["_id"] = str(result.inserted_id)
    # update vehicle
    collection_vehicles.update_one(
        {"_id": ObjectId(data["vehicleId"])},
        {"$set": {"status": "Rented"}}
    )
    return jsonify({"booking": data}), 201

# READ
@booking_routes.route("/bookings", methods=["GET"])
@token_required
def get_bookings():
    bookings = list(collection_bookings.find())
    return jsonify([serialize_booking(b) for b in bookings])

# UPDATE
@booking_routes.route("/bookings/<id>", methods=["PUT"])
@token_required
def update_booking(id):
    data = request.get_json()

    if "_id" in data:
        del data["_id"]
    if "id" in data:
        del data["id"]

    collection_bookings.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    updated = collection_bookings.find_one({"_id": ObjectId(id)})
    updated["_id"] = str(updated["_id"])
    return jsonify({"booking": updated})

# DELETE
@booking_routes.route("/bookings/<id>", methods=["DELETE"])
@token_required
def delete_user(id):
    collection_bookings.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "User deleted"})