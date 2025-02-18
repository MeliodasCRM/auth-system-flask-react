import React from "react";
import { useNavigate } from "react-router-dom";

const Private = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/home");
    };

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h2 className="mb-4">Estás en el área privada</h2>
                <button 
                    onClick={handleLogout}
                    className="btn btn-danger"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Private;