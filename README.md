# Lyra Mobile

## Development

To run locally,

```
adb reverse tcp:8081 tcp:8081
react-native run-android
```

For debugging, run `yarn devtools` or install the [React Native Debugger](https://github.com/jhen0409/react-native-debugger).

## TODO

- open / close bottom sheet on tap
- animation when opening / closing bottom sheet

## IDEAS

- reimplement bottom sheet?
  - remove reanimated + gesture-handler dependencies
