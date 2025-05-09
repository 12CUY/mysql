import api from './api';

export const signIn = async (usernameOrEmail, password) => {
  try {
    const response = await api.post('/auth/signin', {
      usernameOrEmail,
      password
    });
    return {
      user: response.data.user,
      token: response.data.accessToken
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const signUp = async (username, email, password) => {
  try {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password
    });
    return {
      user: response.data.user,
      token: response.data.accessToken
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrarse');
  }
};