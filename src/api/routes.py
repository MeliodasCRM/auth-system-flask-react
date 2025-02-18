"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

CORS(api, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email y contraseña son requeridos"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "El usuario ya existe"}), 400

        new_user = User(email=email, password=password)  

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error interno en el servidor", "error": str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({"message": "Debe enviar datos en el cuerpo de la solicitud"}), 400
    
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email, password=password).first()
    
    if not user:
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "access_token": access_token,
        "message": "Login exitoso"
    }), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    return jsonify({
        "message": "Acceso permitido al área privada",
        "user_email": user.email
    }), 200