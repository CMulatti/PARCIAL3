import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Fetch all users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8081/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    //Confirm before deleting
    if (!window.confirm(`¿Seguro que quieres eliminar al usuario "${username}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      //Remove user from local state (no need to re-fetch)
      setUsers(users.filter(user => user.userId !== userId));
      
      // Show success message
      setSuccess(`Usuario "${username}" eliminado exitosamente`);
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
    }
  };

  //Loading state
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Users Table */}
      {users.length === 0 ? (
        <p className="text-muted">No hay usuarios registrados</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>
                    <span className={`badge ${user.userRole === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                      {user.userRole}
                    </span>
                  </td>
                  <td>
                    {/* deleting admins not allowed */}
                    {user.username === localStorage.getItem('username') ? (
                      <span className="text-muted">
                        <i className="fas fa-user me-1"></i>
                        Tú
                      </span>
                    ) : user.userRole === 'ADMIN' ? (
                      <span className="text-muted">
                        <i className="fas fa-shield-alt me-1"></i>
                        Admin protegido
                      </span>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.userId, user.username)}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/*user count */}
          <div className="mt-3">
            <small className="text-muted">
              Total de usuarios: {users.length} 
              ({users.filter(u => u.userRole === 'ADMIN').length} admin, 
              {users.filter(u => u.userRole === 'USER').length} usuarios)
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;