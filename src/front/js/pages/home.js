import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

const Home = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e, isLogin) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/api/login' : '/api/signup';
            console.log("Enviando petición a:", process.env.BACKEND_URL + endpoint);
            console.log("Datos a enviar:", formData);
            
            const response = await fetch(process.env.BACKEND_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            console.log("Status de la respuesta:", response.status);
            const data = await response.json();
            console.log("Datos de la respuesta:", data);

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data);
                    navigate('/private');
                } else {
                    setIsLoginForm(true);
                    setFormData({
                        email: "",
                        password: ""
                    });
                    alert("Registro exitoso. Por favor inicia sesión.");
                }
            } else {
                alert(data.message || "Error en la operación");
            }
        } catch (error) {
            console.error('Error detallado:', error);
            alert('Error en el servidor. Por favor, revisa la consola para más detalles.');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-container">
            <div className={`auth-box ${isLoginForm ? '' : 'slide'}`}>

                <div className="form-container">
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    <form onSubmit={(e) => handleSubmit(e, true)}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mb-3">
                            Iniciar Sesión
                        </button>
                        <p className="text-center">
                            ¿No tienes cuenta?{" "}
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setIsLoginForm(false)}
                            >
                                Regístrate
                            </button>
                        </p>
                    </form>
                </div>


                <div className="form-container">
                    <h2 className="text-center mb-4">Registro</h2>
                    <form onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100 mb-3">
                            Registrarse
                        </button>
                        <p className="text-center">
                            ¿Ya tienes cuenta?{" "}
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setIsLoginForm(true)}
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;