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


def send_payment_email(to_email, payment_data):
    try:
        msg = Message(
            subject="Payment Updated",
            recipients=[to_email]
        )

        msg.body = f"""
        Hello,

        Your payment has been successfully.

        Payment ID: {payment_data.get('_id')}
        Final Cost: {payment_data.get('finalCost')}

        Thank you!
        """

        mail.send(msg)

    except Exception as e:
        print("Email error:", e)

# CREATE
@payment_routes.route("/payments", methods=["POST"])
@token_required
def add_payment():
    data = request.get_json()
    result = collection_payments.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify({"payment": data}), 201

# READ
@payment_routes.route("/payments", methods=["GET"])
@token_required
def get_payments():
    payments = list(collection_payments.find())
    result = []

    for p in payments:
        booking_id = p.get("bookingId")
        ad_amount = p.get("ad_amount")
        booking = None
        return_data = None

        finalCost = None
        totalCost =0

        if booking_id:
            booking = collection_bookings.find_one({
                "_id": ObjectId(booking_id)
            })
            return_data = collection_return.find_one({
                "bookingId": booking_id
            })

        payment_data = serialize_payment(p)

        if booking:
            duration = booking.get("duration", 0)
            vehicle_per_day = booking.get("vehiclePerDay", 0)
            driver_per_day = booking.get("driverPerDay", 0)
            addons_total = booking.get("addonsTotal", 0)

            vehicleCost = duration * vehicle_per_day
            driverCost = duration * driver_per_day
            totalCost = vehicleCost + driverCost + addons_total

            finalCost = totalCost - ad_amount

            payment_data["duration"] = duration
            payment_data["vehiclePerDay"] = vehicle_per_day
            payment_data["driverPerDay"] = driver_per_day
            payment_data["addonsTotal"] = addons_total
            payment_data["vehicleCost"] = vehicleCost
            payment_data["driverCost"] = driverCost
            payment_data["calculatedTotal"] = totalCost
            payment_data["finalCost"] = finalCost
        else:
            payment_data["bookingDetails"] = None

        if return_data:
            damages = return_data.get("damages",[])
            mileage = return_data.get("mileage", 0)
            returnDate = return_data.get("returnDate", 0)

            return_date = datetime.strptime(returnDate, "%Y-%m-%d").date()
            today = datetime.today().date()

            late_fee = 0
            if return_date < today:
                late_days = (today - return_date).days
                late_fee = late_days * 500

            damageTotal = sum(d.get("price", 0) for d in damages)

            print(totalCost)
            finalCost = totalCost + damageTotal + (mileage * 100) + late_fee

            payment_data["damages"] = damages
            payment_data["finalCost"] = finalCost
            payment_data["mileage"] = mileage
            payment_data["lateFee"] = late_fee
        else:
            payment_data["damages"] = []
            payment_data["damageTotal"] = 0
            payment_data["lateFee"] = 0
            payment_data["mileage"] = 0

        result.append(payment_data)

    return jsonify(result), 200

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