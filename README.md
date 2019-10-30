# Lyra Mobile

## Development

To run locally,

```
react-native start
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8097 tcp:8097
react-native run-android
npm run devtools
```

## TODO

- open / close bottom sheet on tap
- animation when opening / closing bottom sheet

## IDEAS

- reimplement bottom sheet?
  - remove reanimated + gesture-handler dependencies
