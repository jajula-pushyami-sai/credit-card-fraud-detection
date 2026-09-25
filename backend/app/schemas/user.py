import marshmallow
from marshmallow import Schema, fields, validate



class UserSchema(Schema):
    id = fields.String(dump_only=True)
    email = fields.Email(required=True)
    first_name = fields.String(required=True, validate=validate.Length(min=1))
    last_name = fields.String(required=True, validate=validate.Length(min=1))
    role = fields.Method("get_role", dump_only=True)
    is_active = fields.Boolean(dump_only=True)
    email_verified = fields.Boolean(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    def get_role(self, obj):
        return obj.role.value if obj.role else None


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


class RegisterSchema(UserSchema):
    password = fields.String(required=True, validate=validate.Length(min=8))

    class Meta:
        # Silently ignore any extra fields sent by the client (including 'role').
        # Role is enforced exclusively by the backend service layer.
        unknown = marshmallow.EXCLUDE

