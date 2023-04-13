const TOKEN_KEY = 'jwt_token';

export const saveToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => {
  const token = getToken();
  //   const token = 'xyz';
  // Check if the token exists
  return !!token;
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
