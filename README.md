# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

expo install expo-dev-client
npm run reset-project
npx expo-doctor
npm install react-native-draggable-flatlist
expo install expo-linear-gradient

<!-- expo install expo-secure-store -->

npx expo install react-native-gesture-handler
npx expo install @react-native-async-storage/async-storage
npm uninstall expo-secure-store @react-native-async-storage/async-storage

npx expo start -c

npx expo prebuild --clean
npx expo run:android
/******************\*\*******************\*******************\*\*******************
Коли захочеш постійне зберігання:
Тоді зробиш npm run android (це автоматично зібере і встановить на телефон), і тоді вже зможеш використати AsyncStorage.
Але для розробки і тестування - це рішення цілком достатнє.
/******************\*\*******************\*******************\*\*******************

# Видали папки з кешем та білдами

rm -rf android/app/build
rm -rf node_modules
rm -rf .expo

# Або на Windows:

rmdir /s /q android\app\build
rmdir /s /q node_modules
rmdir /s /q .expo

# Перевстанови залежності

npm install

# Очисти кеш Metro

npx expo start --clear

# У новому терміналі запусти нативну збірку:

npx expo run:android

expo prebuild --clean
