module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
    '@react-native-community'
  ],
  rules: {
    'comma-dangle': 'off',
    curly: 'off'
  }
};
