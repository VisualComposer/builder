export function buildSettingsObject(settings) {
  return Object.keys(settings).reduce((data, k) => {
    console.log(k);
    console.log(settings[k]);
    data[k] = settings[k].value || undefined;
    return data;
  }, {});
}
