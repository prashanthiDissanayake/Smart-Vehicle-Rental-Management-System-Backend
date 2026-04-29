from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from flask_mail import Message

from extensions import mail
from auth_middleware import token_required
from db import db
from datetime import datetime

payment_routes = Blueprint("payment_routes", __name__)
collection_payments  = db["payments"]
collection_bookings = db["booking"]
collection_return = db["return"]
collection = db["user"]

def serialize_payment(p):
    p["_id"] = str(p["_id"])
    return p



# CREATE
@payment_routes.route("/payments", methods=["POST"])
@token_required
def add_payment():
    data = request.get_json()
    result = collection_payments.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify({"payment": data}), 201




# UPDATE
@payment_routes.route("/payments/<id>", methods=["PUT"])
@token_required
def update_payment(id):
    data = request.get_json()
    if "_id" in data:
        del data["_id"]
    if "id" in data:
        del data["id"]
    collection_payments.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    updated = collection_payments.find_one({"_id": ObjectId(id)})
    updated["_id"] = str(updated["_id"])

    updated = serialize_payment(updated)

    print(updated)

    user = collection.find_one({
        "_id": ObjectId(updated["userId"])})

    print(user)
    # if user:
    #     user_email = user.get("email")
    #
    # if user_email:
    #     send_payment_email(user_email, updated)


    return jsonify({"payment": updated}), 200

@payment_routes.route("/payments/return/<booking_id>", methods=["PUT"])
@token_required
def update_return_payment(booking_id):
    data = request.get_json()

    print("test123")

    data.pop("_id", None)
    data.pop("id", None)

    collection_payments.update_one(
        {"bookingId": booking_id},
        {"$set": data}
    )
    updated = collection_payments.find_one({"bookingId": booking_id})
    if not updated:
        return jsonify({"message": "Payment not found"}), 404
    updated["_id"] = str(updated["_id"])
    return jsonify({"payment": updated}), 200

# DELETE
@payment_routes.route("/payments/<id>", methods=["DELETE"])
@token_required
def delete_payment(id):
    collection_payments.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Payment deleted"}), 200
