# react-native-nordic-dfu Salt-PepperEngineering fork test

There are branches with multiple cases to try, to test follow instructions on each one

Cases differ in `AndroidManifest.xml` setups

## my-case

This is the case I encountered in my project

- if already installed, uninstall app from device
- run `git checkout main`
- run `yarn`
- run `git checkout 9b9aaf1`
- install app on Android 12 device `npx react-native run-android`
- Allow location permission
- Start bluetooth scan to test implementation - it should be fine
- run `git checkout ea485d4`
- run `yarn`, forked version will be installed
- install app on Android 12 device `npx react-native run-android`
- Start bluetooth scan to test implementation - it fails

In this case I think it should not be failing, because I did not do anything other then installing the forked version.

## current-docs-case

Here I followed setup from current docs

- if already installed, uninstall app from device
- run `git checkout main`
- run `yarn`
- run `git checkout c0118e9`
- install app on Android 12 device `npx react-native run-android`
- Allow location permission
- Start bluetooth scan to test implementation - it fails

Here it already fails with the non forked version, it's because the `BLUETOOTH` permissions are limited to SDK 30 and we should be also handling `BLUETOOTH_SCAN` permissions in the app.

## suggestion-case

Initial setup according to https://github.com/Pilloxa/react-native-nordic-dfu/issues/169#issuecomment-1180174896

- if already installed, uninstall app from device
- run `git checkout main`
- run `yarn`
- run `git checkout 0270d74`
- install app on Android 12 device `npx react-native run-android`
- Allow location permission
- Start bluetooth scan to test implementation - it fails

Same reason as `current-docs-case`