import bcrypt
from flask import Blueprint, request, jsonify
from db import db
import jwt
import datetime

auth_routes = Blueprint("auth_routes", __name__)
collection_users = db["user"]

SECRET_KEY = "a8f3c1d9b2e74f6a9c0e5b8d3f2a7c6e"
@auth_routes.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        user = collection_users.find_one({"email": data["email"], "role": data["role"]})
        if not user:
            return jsonify({"error": "User not found"}), 404
        if not bcrypt.checkpw(
            data["password"].encode("utf-8"),
            user["password"]
        ):
            print(bcrypt.checkpw(
            data["password"].encode("utf-8"),
            user["password"]
        ))
            return jsonify({"error": "Invalid password"}), 401

        token = jwt.encode({
            "user_id": str(user["_id"]),
            "email": user["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user.get("role", "Staff")
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500