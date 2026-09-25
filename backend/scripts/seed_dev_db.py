import os
import sys
import datetime
from decimal import Decimal

# Ensure backend directory is in path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.database.core import db
from app.models.user import User, RoleEnum
from app.models.transaction import Transaction, TransactionStatus
from app.models.prediction import Prediction
from app.models.misc import Notification
from app.security.hashing import hash_password

def seed():
    app = create_app()
    with app.app_context():
        print("Seeding/updating demo user accounts...")
        
        # 1. Demo Analyst (analyst@fraudshield.ai / Demo@12345)
        analyst = User.query.filter_by(email="analyst@fraudshield.ai").first()
        if not analyst:
            analyst = User(
                email="analyst@fraudshield.ai",
                first_name="Demo",
                last_name="Analyst",
                role=RoleEnum.ANALYST,
                is_active=True,
                email_verified=True
            )
            db.session.add(analyst)
        analyst.password_hash = hash_password("Demo@12345")
        db.session.commit()
        print(f"Provisioned demo analyst: {analyst.email}")

        # Sample transaction for analyst
        if not Transaction.query.filter_by(user_id=analyst.id).first():
            tx1 = Transaction(
                user_id=analyst.id,
                amount=Decimal("1250.00"),
                merchant="APPLE STORE",
                category="Electronics",
                transaction_date=datetime.datetime.now(datetime.timezone.utc),
                status=TransactionStatus.PENDING,
            )
            db.session.add(tx1)
            db.session.commit()

            pred1 = Prediction(
                transaction_id=tx1.id,
                model_version="v1.0.0-ensemble",
                risk_score=0.85,
            )
            db.session.add(pred1)

            notif = Notification(
                user_id=analyst.id,
                title="Welcome to FraudShield AI",
                message="Your local development environment has been successfully seeded.",
                type="system",
                is_read=False
            )
            db.session.add(notif)
            db.session.commit()

        # 2. Demo User (demo@fraudshield.dev / Demo@1234 - matches LoginPage defaults)
        demo_user = User.query.filter_by(email="demo@fraudshield.dev").first()
        if not demo_user:
            demo_user = User(
                email="demo@fraudshield.dev",
                first_name="Demo",
                last_name="User",
                role=RoleEnum.CUSTOMER,
                is_active=True,
                email_verified=True
            )
            db.session.add(demo_user)
        demo_user.password_hash = hash_password("Demo@1234")
        db.session.commit()
        print(f"Provisioned demo user: {demo_user.email}")

        # 3. Demo Admin (admin@fraudshield.ai / Admin@123456!)
        admin = User.query.filter_by(email="admin@fraudshield.ai").first()
        if not admin:
            admin = User(
                email="admin@fraudshield.ai",
                first_name="System",
                last_name="Admin",
                role=RoleEnum.ADMIN,
                is_active=True,
                email_verified=True
            )
            db.session.add(admin)
        admin.password_hash = hash_password("Admin@123456!")
        db.session.commit()
        print(f"Provisioned demo admin: {admin.email}")

        print("\nSeeding complete! Available demo accounts:")
        print("  - Customer:  demo@fraudshield.dev / Demo@1234")
        print("  - Analyst:   analyst@fraudshield.ai / Demo@12345")
        print("  - Admin:     admin@fraudshield.ai / Admin@123456!")

if __name__ == "__main__":
    seed()
