import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api/v1';
  }
  return 'http://localhost:4000/api/v1';
};

export const API_URL = getBaseUrl();

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  let url = '';
  if (endpoint.startsWith('/query/')) {
    const origin = API_URL.replace('/api/v1', '');
    url = `${origin}${endpoint}`;
  } else {
    url = `${API_URL}${endpoint}`;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  return response;
};
