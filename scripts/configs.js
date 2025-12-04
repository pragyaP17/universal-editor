/* eslint-disable no-console */
const CONFIG_KEY = 'config';
const CONFIG_FILE_NAME = 'configs.json';
// store configs globally to avoid multiple requests
window.configsPromises = {};

/*
 * Returns the true origin of the current page in the browser.
 * If the page is running in a iframe with srcdoc, the ancestor origin is returned.
 * @returns {String} The true origin
 */
function getOrigin() {
  const { location } = window;
  return location.href === 'about:srcdoc' ? window.parent.location.origin : location.origin;
}

function buildConfigURL() {
  const origin = getOrigin();
  const configURL = new URL(`${origin}/${CONFIG_FILE_NAME}`);
  return configURL;
}

const getStoredConfig = () => sessionStorage.getItem(CONFIG_KEY);

const storeConfig = (configJSON) => sessionStorage.setItem(CONFIG_KEY, configJSON);

const getConfig = async () => {
  let configJSON = getStoredConfig();

  if (!configJSON) {
    try {
      const response = await fetch(buildConfigURL());

      // Check if response is ok (status 200-299)
      if (!response.ok) {
        console.warn(`Config file not found: ${CONFIG_FILE_NAME}`);
        return { data: [] };
      }

      // Extract JSON data from responses
      configJSON = await response.text();
      storeConfig(configJSON);
    } catch (e) {
      console.warn(`Unable to load config file: ${CONFIG_FILE_NAME}`, e.message);
      return { data: [] };
    }
  }

  // return if configJSON is not null
  if (!configJSON) {
    return { data: [] };
  }

  try {
    const config = JSON.parse(configJSON);
    // Ensure config has data array
    if (!config || !Array.isArray(config.data)) {
      console.warn('Invalid config structure: data array not found');
      return { data: [] };
    }
    return config;
  } catch (e) {
    console.error('Error parsing config JSON:', e.message);
    return { data: [] };
  }
};

/**
 * This function retrieves a configuration value for a given environment.
 *
 * @param {string} configParam - The configuration parameter to retrieve.
 * @returns {Promise<string|undefined>} - The value of the configuration parameter, or undefined.
 */
export const getConfigValue = async (configParam) => {
  if (!window.configsPromise) {
    window.configsPromise = getConfig();
  }

  try {
    const configJSON = await window.configsPromise;
    const configElements = configJSON?.data;

    // Return null if config data doesn't exist or is not an array
    if (!configElements || !Array.isArray(configElements)) {
      return null;
    }

    return configElements.find((c) => c.key === configParam)?.value || null;
  } catch (e) {
    console.error('Error fetching config value:', e.message);
    return null;
  }
};

export default getConfigValue;
