export interface ExtensionSettings {
  apiUrl: string;
}

const DEFAULT_SETTINGS: ExtensionSettings = {
  apiUrl: 'http://localhost:3001',
};

export const storage = {
  async getSettings(): Promise<ExtensionSettings> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const res = await chrome.storage.local.get(['apiUrl']);
      return {
        apiUrl: res.apiUrl || DEFAULT_SETTINGS.apiUrl,
      };
    }
    const local = localStorage.getItem('screenai_apiUrl');
    return {
      apiUrl: local || DEFAULT_SETTINGS.apiUrl,
    };
  },

  async saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set(settings);
      return;
    }
    if (settings.apiUrl) {
      localStorage.setItem('screenai_apiUrl', settings.apiUrl);
    }
  },
};

