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








# DELETE
@payment_routes.route("/payments/<id>", methods=["DELETE"])
@token_required
def delete_payment(id):
    collection_payments.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Payment deleted"}), 200
