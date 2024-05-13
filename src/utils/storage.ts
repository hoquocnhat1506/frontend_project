export const KEY_LOCAL_STORAGE = {
    ACCESS_TOKEN: 'access_token'
  };
  
  export const saveLocalStorage = (name: string, payload: any) => {
    localStorage.setItem(name, payload);
  };
  
  export const getLocalStorage = (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        JSON.parse(localStorage.getItem(key) || 'null');
        return JSON.parse(localStorage.getItem(key) || 'null');
      } catch (error) {
        return localStorage.getItem(key);
      }
    }
  };
  
  export const removeLocalStorage = (name: string) => {
    localStorage.removeItem(name);
  };
  