// Hook pour accéder aux données utilisateur stockées dans localStorage
const useAuth = () => {
  const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const logout = () => {
    localStorage.removeItem('user');
    // Le token est dans le cookie HttpOnly, donc il sera automatiquement supprimé côté serveur
  };

  return {
    user: getUser(),
    logout
  };
};

export default useAuth;
