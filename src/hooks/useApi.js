import { useLoading } from '../LoadingContext';

export const useApi = () => {
  const { startLoading, stopLoading } = useLoading();

  const apiCall = async (url, options = {}, loadingMessage = 'Loading...') => {
    try {
      startLoading(loadingMessage);
      
      // Check if we're on iPhone Safari and add fallback headers
      const isIPhone = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add fallback token for iPhone Safari if cookies fail
      if (isIPhone && isSafari) {
        const fallbackToken = localStorage.getItem('fallbackToken');
        if (fallbackToken) {
          headers['Authorization'] = `Bearer ${fallbackToken}`;
        }
      }
      
      const response = await fetch(url, {
        credentials: 'include', // Always include cookies
        ...options,
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      stopLoading();
    }
  };

  const get = (url, loadingMessage = 'Loading...') => {
    return apiCall(url, { method: 'GET' }, loadingMessage);
  };

  const post = (url, body, loadingMessage = 'Saving...') => {
    return apiCall(url, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    }, loadingMessage);
  };

  const put = (url, body, loadingMessage = 'Updating...') => {
    return apiCall(url, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }, loadingMessage);
  };

  const patch = (url, body, loadingMessage = 'Updating...') => {
    return apiCall(url, { 
      method: 'PATCH', 
      body: JSON.stringify(body) 
    }, loadingMessage);
  };

  const del = (url, loadingMessage = 'Deleting...') => {
    return apiCall(url, { method: 'DELETE' }, loadingMessage);
  };

  return {
    apiCall,
    get,
    post,
    put,
    patch,
    del,
  };
}; 