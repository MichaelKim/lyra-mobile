# Patches with `patch-package`

### react-native-get-music-files

- Outdated Android SDK Build Tools version
- Bump `compileSdkVersion` to fix build errors
- Deprecated configuration "compile" replaced with "implementation"
- Android Q (SDK 29) introduces normal storage which breaks getting local audio files in external storage
  - Fix by switching back to legacy storage

### @react-native-community/slider

- Min SDK lint error on API
- See https://github.com/react-native-community/react-native-slider/issues/220
