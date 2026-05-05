from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError

from auth_middleware import token_required
from db import db
import bcrypt

user_routes = Blueprint("user_routes", __name__)
collection = db["user"]

def serialize_user(user):
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return user

# CREATE
@user_routes.route("/users", methods=["POST"])
@token_required
def add_user():
    try:
        data = request.get_json()

        existing_user = collection.find_one({"email": data["email"]})
        if existing_user:
            print("User already exists")
            return jsonify({"error": "Email already registered"}), 400

        if "password" in data:
            hashed_password = bcrypt.hashpw(
                data["password"].encode("utf-8"),
                bcrypt.gensalt()
            )
            print(hashed_password)
            data["password"] = hashed_password
        result = collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        data.pop("password", None)
        return jsonify({"user": data}), 201
    except DuplicateKeyError:
        return jsonify({"error": "Duplicate user (email already exists)"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# CREATE
@user_routes.route("/users/customer", methods=["POST"])
def add_user_customer():
    try:
        data = request.get_json()

        existing_user = collection.find_one({"email": data["email"]})
        if existing_user:
            print("User already exists")
            return jsonify({"error": "Email already registered"}), 400

        if "password" in data:
            hashed_password = bcrypt.hashpw(
                data["password"].encode("utf-8"),
                bcrypt.gensalt()
            )
            print(hashed_password)
            data["password"] = hashed_password
        result = collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        data.pop("password", None)
        return jsonify({"user": data}), 201
    except DuplicateKeyError:
        return jsonify({"error": "Duplicate user (email already exists)"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# READ
@user_routes.route("/users", methods=["GET"])
@token_required
def get_users():
    users = list(collection.find())
    return jsonify([serialize_user(u) for u in users])

# UPDATE
@user_routes.route("/users/<id>", methods=["PUT"])
@token_required
def update_user(id):
    try:
        data = request.get_json()
        data.pop("_id", None)
        data.pop("id", None)
        if "password" in data:
            hashed_password = bcrypt.hashpw(
                data["password"].encode("utf-8"),
                bcrypt.gensalt()
            )
            data["password"] = hashed_password
        collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data}
        )
        updated = collection.find_one({"_id": ObjectId(id)})
        updated["_id"] = str(updated["_id"])
        updated.pop("password", None)
        return jsonify({"user": updated}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# DELETE
@user_routes.route("/users/<id>", methods=["DELETE"])
@token_required
def delete_user(id):
    collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Deleted"})