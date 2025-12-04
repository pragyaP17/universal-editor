import { getConfigValue } from './configs.js';
import { isAEMProd } from '../utils/browser-utils.js';

export async function getHotjarId() {
  return isAEMProd() ? getConfigValue('hotjar-id-prod') : getConfigValue('hotjar-id-dev');
}

export async function getHotjarScriptVersion() {
  return getConfigValue('hotjar-script-version') || '6';
}

// Load Hotjar tracking code
export async function loadHotjar() {
  try {
    const hjid = await getHotjarId();
    const hjsv = await getHotjarScriptVersion();

    // Only load Hotjar if both ID and version are present
    if (hjid && hjsv) {
      const script = document.createElement('script');
      script.async = 1;
      script.src = `https://static.hotjar.com/c/hotjar-${hjid}.js?sv=${hjsv}`;

      const hjScript = document.createElement('script');
      hjScript.textContent = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${hjid},hjsv:${hjsv}};
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;

      document.head.appendChild(hjScript);
      document.head.appendChild(script);
    } else {
      // eslint-disable-next-line no-console
      console.info('Hotjar not loaded: configuration missing');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error loading Hotjar:', e.message);
  }
}
