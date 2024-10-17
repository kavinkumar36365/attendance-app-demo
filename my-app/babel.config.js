module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    Plugins:["expo-router/babel"],
  };
};
