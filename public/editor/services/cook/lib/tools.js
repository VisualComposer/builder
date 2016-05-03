export function buildSettingsObject(settings) {
  return Object.keys(settings).reduce((data, k) => {
    data[k] = settings[k].value || undefined;
    return data;
  }, {});
}
