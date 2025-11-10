import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = (e) => {
    e.preventDefault(); //prevent form refresh
    
    // Check for admin credentials
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      navigate("/admin");
    }
    //Check for regular user credentials
    else if (username === "user" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "user");
      navigate("/"); //regular users go to homepage
    }
    else {
      alert("Credenciales incorrectas!!");
    }
  };
  
  return (
    <div className="container mt-5" style={{maxWidth: "400px"}}>
      <h3 className="text-center mb-4">Iniciar Sesión</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Usuario:</label>
          <input 
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingrese el usuario"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input 
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese la contraseña"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Ingresar
        </button>
        
        {/*helper credentials for testing */}
        <div className="mt-3 text-muted small">
          <p className="mb-1"><strong>Credenciales de prueba:</strong></p>
          <p className="mb-0">Admin: admin / 1234</p>
          <p className="mb-0">Usuario: user / 1234</p>
        </div>
      </form>
    </div>
  );
}

export default Login;