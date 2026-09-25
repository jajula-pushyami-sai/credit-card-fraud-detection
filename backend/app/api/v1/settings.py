from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.database.core import db
import logging

settings_bp = Blueprint("settings", __name__)
logger = logging.getLogger(__name__)


@settings_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return (
        jsonify(
            {
                "status": "success",
                "data": {
                    "fullName": f"{user.first_name} {user.last_name}",
                    "email": user.email,
                    "organization": user.organization or "FraudShield Enterprise",
                    "role": (
                        user.role.value
                        if hasattr(user.role, "value")
                        else str(user.role)
                    ),
                    "department": user.department or "Risk Management",
                    "employeeId": user.employee_id or "FSA-9381",
                    "phone": user.phone or "+1 (555) 123-4567",
                    "location": user.location or "New York, USA",
                },
            }
        ),
        200,
    )


@settings_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    data = request.get_json()

    # We allow updating specific fields
    if "organization" in data:
        user.organization = data["organization"]
    if "department" in data:
        user.department = data["department"]
    if "employeeId" in data:
        user.employee_id = data["employeeId"]
    if "phone" in data:
        user.phone = data["phone"]
    if "location" in data:
        user.location = data["location"]

    # Optional: full name parsing, but usually it's split
    if "fullName" in data:
        parts = data["fullName"].split(" ", 1)
        user.first_name = parts[0]
        if len(parts) > 1:
            user.last_name = parts[1]
        else:
            user.last_name = ""

    db.session.commit()

    return (
        jsonify({"status": "success", "message": "Profile updated successfully"}),
        200,
    )


@settings_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    default_prefs = {
        "highRisk": True,
        "suspiciousLogin": True,
        "failedLogin": False,
        "passwordChange": True,
        "dailySum": False,
        "weeklyRep": True,
        "monthlyRep": False,
        "aiUpdates": True,
        "email": True,
        "push": False,
        "sms": False,
        "desktop": True,
    }

    prefs = user.notification_preferences or default_prefs

    return jsonify({"status": "success", "data": prefs}), 200


@settings_bp.route("/notifications", methods=["PUT"])
@jwt_required()
def update_notifications():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    data = request.get_json()
    user.notification_preferences = data
    db.session.commit()

    return (
        jsonify(
            {
                "status": "success",
                "message": "Notification preferences updated successfully",
            }
        ),
        200,
    )


@settings_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    data = request.get_json() or {}
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"status": "error", "message": "Both current and new passwords are required."}), 400

    from app.security.hashing import verify_password, hash_password
    if not verify_password(old_password, user.password_hash):
        return jsonify({"status": "error", "message": "Incorrect current password."}), 400

    if len(new_password) < 8:
        return jsonify({"status": "error", "message": "New password must be at least 8 characters long."}), 400

    user.password_hash = hash_password(new_password)
    db.session.commit()

    return jsonify({"status": "success", "message": "Password changed successfully."}), 200

