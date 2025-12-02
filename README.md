# 블랙킹덤 프로젝트 (Black Kingdom Project)

이 프로젝트는 React Native로 시작되었으며, [`@react-native-community/cli`](https://github.com/react-native-community/cli)를 사용하여 부트스트랩되었습니다.

인증 기능이 작동하려면 백엔드 서버가 실행 중이어야 합니다.

# 시작하기

> **참고**: 계속 진행하기 전에 [개발 환경 설정](https://reactnative.dev/docs/set-up-your-environment) 가이드를 완료했는지 확인하세요.

## 전제 조건: 백엔드 서버 시작

모바일 앱을 실행하기 전에 백엔드 서버를 시작해야 합니다. 새 터미널을 열고 `backend` 디렉토리로 이동하여 다음 명령을 실행합니다.

```sh
cd backend
npm start
```

---

## 1단계: Metro 시작

먼저 React Native의 JavaScript 빌드 도구인 **Metro**를 실행해야 합니다. 별도의 터미널에서 프로젝트의 루트에서 다음 명령을 실행합니다.

```sh
# npm 사용
npm start
```

## 2단계: 앱 빌드 및 실행

백엔드와 Metro가 실행 중인 상태에서 프로젝트 루트에서 새 터미널 창/패널을 열고 다음 명령 중 하나를 사용하여 Android 또는 iOS 앱을 빌드하고 실행합니다.

### Android

```sh
# npm 사용
npm run android
```

### iOS

iOS의 경우, CocoaPods 종속성을 설치해야 합니다(이 작업은 최초 클론 시 또는 네이티브 종속성 업데이트 후에만 실행하면 됩니다).

새 프로젝트를 처음 생성할 때 Ruby bundler를 실행하여 CocoaPods 자체를 설치합니다.

```sh
bundle install
```

그 다음, 네이티브 종속성을 업데이트할 때마다 다음을 실행합니다.

```sh
bundle exec pod install
```

```sh
# npm 사용
npm run ios
```

모든 설정이 올바르게 완료되었다면, Android 에뮬레이터, iOS 시뮬레이터 또는 연결된 장치에서 새 앱이 실행되는 것을 볼 수 있을 것입니다.

## 3단계: 앱 수정

이제 앱을 성공적으로 실행했으니, 변경 사항을 적용해 봅시다!

원하는 텍스트 편집기에서 `App.tsx`를 열고 일부 변경 사항을 적용합니다. 저장하면 앱이 자동으로 업데이트되고 변경 사항이 반영됩니다 — 이는 [Fast Refresh](https://reactnative.dev/docs/fast-refresh)에 의해 제공됩니다.

강제로 다시 로드하려는 경우(예: 앱의 상태를 재설정하기 위해) 전체 다시 로드를 수행할 수 있습니다.

-   **Android**: <kbd>R</kbd> 키를 두 번 누르거나 <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) 또는 <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS)을 통해 접근하는 **개발자 메뉴**에서 **"Reload"**를 선택합니다.
-   **iOS**: iOS 시뮬레이터에서 <kbd>R</kbd>을 누릅니다.