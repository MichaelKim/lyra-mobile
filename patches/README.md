# Patches with `patch-package`

### react-native-flipper

- See https://github.com/facebook/flipper/pull/1329
- Should be fixed soon

### react-native-get-music-files

- Outdated Android SDK Build Tools version
- Bump `compileSdkVersion` to fix build errors
- Deprecated configuration "compile" replaced with "implementation"
- Android Q (SDK 29) introduces normal storage which breaks getting local audio files in external storage
  - Fix by switching back to legacy storage
