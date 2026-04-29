from flask import Flask
import jwt
from extensions import mail
from routes.auth_routes import auth_routes
from routes.return_routes import return_routes
from routes.payment_routes import payment_routes
from routes.user_routes import user_routes
from routes.vehicle_routes import vehicle_routes
from routes.booking_routes import booking_routes
from flask_cors import CORS

SECRET_KEY = "a8f3c1d9b2e74f6a9c0e5b8d3f2a7c6e"

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'autocarepvt1@gmail.com'
app.config['MAIL_PASSWORD'] = 'Colombo1.'
app.config['MAIL_DEFAULT_SENDER'] = 'autocarepvt1@gmail.com'
mail.init_app(app)

# register routes
app.register_blueprint(user_routes)
app.register_blueprint(vehicle_routes)
app.register_blueprint(booking_routes)
app.register_blueprint(payment_routes)
app.register_blueprint(return_routes)
app.register_blueprint(auth_routes)
@app.route("/")
def home():
    return "Flask MongoDB API Running"

if __name__ == "__main__":
    app.run(debug=True)