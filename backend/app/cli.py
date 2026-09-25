"""
Flask CLI commands for administrative operations.

Register these commands by calling register_cli(app) from the app factory.
"""
import re
import sys

import click
from flask import current_app
from flask.cli import with_appcontext

from app.database.core import db
from app.models.user import RoleEnum, User
from app.repositories.user_repo import UserRepository
from app.security.hashing import hash_password


# ── Password strength validation ────────────────────────────────────────────

_PASSWORD_RE = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{12,}$"
)


def _validate_password(password: str) -> None:
    """Raise click.BadParameter if the password doesn't meet strength requirements."""
    if not _PASSWORD_RE.match(password):
        raise click.BadParameter(
            "Password must be at least 12 characters and contain:\n"
            "  • At least one uppercase letter (A-Z)\n"
            "  • At least one lowercase letter (a-z)\n"
            "  • At least one digit (0-9)\n"
            "  • At least one special character (!@#$%^&* etc.)",
            param_hint="password",
        )


# ── create-admin command ─────────────────────────────────────────────────────

@click.command("create-admin")
@with_appcontext
def create_admin():
    """Interactively provision a new Administrator account.

    This is the ONLY supported way to create the first admin user.
    No default credentials are seeded in the database.

    Example:
        flask create-admin
    """
    click.echo("\n🛡️  FraudShield AI — Admin Account Provisioning")
    click.echo("─" * 50)

    # ── Collect and validate email ───────────────────────────────────────────
    email = click.prompt("Admin email address").strip().lower()
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        click.secho("✗  Invalid email address. Aborting.", fg="red")
        sys.exit(1)

    if UserRepository.get_by_email(email):
        click.secho(f"✗  A user with email '{email}' already exists. Aborting.", fg="red")
        sys.exit(1)

    first_name = click.prompt("First name").strip()
    last_name  = click.prompt("Last name").strip()

    # ── Collect and validate password (double-entry) ─────────────────────────
    while True:
        password = click.prompt(
            "Password (min 12 chars, mixed case, digit, special char)",
            hide_input=True,
        )
        try:
            _validate_password(password)
        except click.BadParameter as exc:
            click.secho(f"✗  {exc.format_message()}", fg="yellow")
            continue

        confirm = click.prompt("Confirm password", hide_input=True)
        if password != confirm:
            click.secho("✗  Passwords do not match. Try again.", fg="yellow")
            continue

        break

    # ── Create the admin user ────────────────────────────────────────────────
    try:
        user = UserRepository.create(
            {
                "email": email,
                "password_hash": hash_password(password),
                "first_name": first_name,
                "last_name": last_name,
                "role": RoleEnum.ADMIN,
                "is_active": True,
                "email_verified": True,  # Admin accounts are pre-verified
            }
        )
        click.secho(
            f"\n✅  Admin account created successfully!\n"
            f"    Email : {user.email}\n"
            f"    Role  : {user.role.value}\n"
            f"    ID    : {user.id}\n",
            fg="green",
        )
    except Exception as exc:
        current_app.logger.exception("Failed to create admin account")
        click.secho(f"✗  Failed to create admin: {exc}", fg="red")
        sys.exit(1)


# ── Admin-count startup warning (callable from app factory) ─────────────────

def warn_if_no_admins(app) -> None:
    """Log a warning at startup if no administrator accounts exist.

    This is intentionally a WARNING, not an error, so the app still starts
    normally and operators can run `flask create-admin` to fix it.
    """
    with app.app_context():
        try:
            count = (
                db.session.query(User)
                .filter_by(role=RoleEnum.ADMIN, is_deleted=False, is_active=True)
                .count()
            )
            if count == 0:
                app.logger.warning(
                    "[SECURITY] No active Administrator accounts found in the database. "
                    "Run `flask create-admin` to provision the first admin account."
                )
        except Exception:
            # Table may not exist yet on very first boot — ignore silently.
            pass


# ── Registration helper ──────────────────────────────────────────────────────

def register_cli(app) -> None:
    """Register all custom Flask CLI commands with the app."""
    app.cli.add_command(create_admin)
