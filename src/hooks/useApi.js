import { useLoading } from '../LoadingContext';
import { isIPhoneSafari, createIPhoneSafeRequest, handleIPhoneError } from '../utils/iphoneFix';

export const useApi = () => {
  const { startLoading, stopLoading } = useLoading();

  const apiCall = async (url, options = {}, loadingMessage = 'Loading...') => {
    try {
      startLoading(loadingMessage);
      
      const { options: requestOptions } = createIPhoneSafeRequest(url, options);
      
      const response = await fetch(url, requestOptions);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle iPhone Safari specific errors
      if (handleIPhoneError(error)) {
        // Retry with fallback token
        try {
          const fallbackToken = localStorage.getItem('fallbackToken');
          if (fallbackToken) {
            const retryOptions = {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${fallbackToken}`,
                'Content-Type': 'application/json',
              }
            };
            
            const retryResponse = await fetch(url, {
              ...retryOptions,
              credentials: 'include',
            });
            
            const retryData = await retryResponse.json();
            if (!retryResponse.ok) {
              throw new Error(retryData.message || 'Something went wrong');
            }
            
            return retryData;
          }
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
      
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