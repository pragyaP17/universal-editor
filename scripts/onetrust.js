import { loadScript } from './aem.js';
import { getConfigValue } from './configs.js';
import { isAEMProd } from '../utils/browser-utils.js';

export async function getOneTrustToken() {
  return isAEMProd() ? getConfigValue('onetrust-token-prod') : getConfigValue('onetrust-token-dev');
}

// Load OneTrust script based on configuration
export async function loadOneTrust() {
  try {
    const oneTrustToken = await getOneTrustToken();
    
    // Only load OneTrust if token is present
    if (oneTrustToken) {
      const otScriptSrc = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
      await loadScript(otScriptSrc, {
        'data-document-language': 'true',
        'data-domain-script': oneTrustToken,
        type: 'text/javascript',
        charset: 'UTF-8',
      });

      // Add OptanonWrapper function after OneTrust script
      const wrapperScript = document.createElement('script');
      wrapperScript.type = 'text/javascript';
      wrapperScript.textContent = 'function OptanonWrapper() { }';
      document.head.appendChild(wrapperScript);
    } else {
      console.info('OneTrust not loaded: configuration missing');
    }
  } catch (e) {
    console.error('Error loading OneTrust:', e.message);
  }
}
