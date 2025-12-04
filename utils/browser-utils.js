const getLocalStorageItem = (prop) => {
  try {
    return window.localStorage.getItem(prop);
  } catch (e) {
    console.warn('Unable to access localStorage:', e.message);
    return null;
  }
};

const setLocalStorageItem = (prop, value) => {
  try {
    window.localStorage.setItem(prop, value);
  } catch (e) {
    console.warn('Unable to set localStorage item:', e.message);
  }
};

const getPropFromSessionStorageObj = (prop, key) => {
  try {
    const item = sessionStorage.getItem(prop);
    if (!item) {
      return '';
    }
    const obj = JSON.parse(item);
    return obj && obj[key] ? obj[key] : '';
  } catch (e) {
    console.warn('Error parsing sessionStorage item:', e.message);
    return '';
  }
};

const isAEMPreview = () => {
  try {
    return window.location.host.includes('localhost')
      || window.location.host.includes('aem.page');
  } catch (e) {
    console.error('Error checking AEM preview mode:', e.message);
    return false;
  }
};

const prodDomainRegex = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]+$/;
const isAEMProd = () => {
  try {
    return prodDomainRegex.test(window.location.hostname);
  } catch (e) {
    console.error('Error checking AEM prod mode:', e.message);
    return false;
  }
};

export {
  getLocalStorageItem,
  setLocalStorageItem,
  getPropFromSessionStorageObj,
  isAEMPreview,
  isAEMProd,
};
