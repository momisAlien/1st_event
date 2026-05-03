# 강아지 타로 상담소

여자친구 기념일용으로 만든 React + TypeScript + Vite 기반 인터랙티브 웹앱입니다. 타로 카드 선택, 강아지 mock 상담, MediaPipe 손동작 놀이, 편지 연출, 사진 갤러리, 축하 엔딩까지 프론트엔드만으로 동작합니다.

## 설치 방법

```bash
npm install
```

## 실행 방법

```bash
npm run dev
```

브라우저에서 Vite가 출력하는 로컬 주소를 열면 됩니다. 배포 전 확인은 다음 명령을 사용할 수 있습니다.

```bash
npm run build
npm run preview
```

## 이미지 교체 방법

앱은 모든 이미지를 `public/assets` 아래 경로에서 불러옵니다. 파일이 없거나 깨져 있으면 `SafeImage`가 placeholder UI를 보여주므로 앱 흐름은 계속 진행됩니다.

강아지 이미지는 아래 파일명으로 넣어주세요.

```text
public/assets/dog/dog-main.png
public/assets/dog/dog-happy.png
public/assets/dog/dog-letter.png
public/assets/dog/dog-celebrate.png
```

타로 이미지는 아래 경로를 사용합니다.

```text
public/assets/tarrotcard/card-back.png
public/assets/tarrotcard/card-love.png
public/assets/tarrotcard/card-future.png
public/assets/tarrotcard/card-smile.png
public/assets/tarrotcard/card-memory.png
public/assets/tarrotcard/card-promise.png
```

편지 이미지는 아래 경로를 사용합니다.

```text
public/assets/letter/envelope.png
public/assets/letter/letter-paper.png
```

## 편지 내용 수정 방법

`src/content/letterContent.ts`의 `letterContent` 문자열을 수정하면 LetterScene의 타이핑 편지가 바뀝니다. 타이핑 속도는 `src/content/appConfig.ts`의 `letterTypingSpeedMs`에서 조절합니다.

## 사진 추가 방법

사진 파일을 `public/assets/coupleimage`에 넣고 `src/content/photoList.ts`에 항목을 추가하세요.

```ts
{ src: "/assets/couple-photos/photo-05.jpg", caption: "새로운 추억" }
```

## 캐릭터 이미지 추가 방법

엔딩 캐릭터 이미지는 `src/content/characterMessages.ts`에서 관리합니다. 기본 경로는 다음과 같습니다.

```text
public/assets/characterimage/chiikawa-usagi.png
public/assets/characterimage/hello-kitty.png
public/assets/dog/dog-celebrate.png
```

치이카와, 헬로키티 등 저작권이 있는 캐릭터 이미지는 코드에 포함하지 않습니다. 사용자가 직접 합법적으로 준비한 이미지 파일만 위 경로에 넣어 사용하세요.

## 카메라와 손 추적 사용 방법

TarotScene과 MotionPlayScene에서 `손 추적 켜기`를 누르면 브라우저 카메라 권한을 요청합니다. 권한이 허용되면 `@mediapipe/tasks-vision`의 Hand Landmarker로 손 landmark를 감지합니다.

지원 제스처는 다음과 같습니다.

- pinch: 엄지 끝과 검지 끝이 가까우면 카드 선택 또는 상호작용
- openPalm: 손바닥을 펼치면 강아지가 기뻐함
- swipeLeft / swipeRight: 꽃잎 효과
- point: 검지로 가리키면 하트 상호작용

카메라 권한이 없어도 터치와 마우스로 모든 플로우를 진행할 수 있습니다.

## placeholder가 뜨는 이유

이 프로젝트는 외부 IP 캐릭터 이미지나 개인 사진을 직접 생성하거나 다운로드하지 않습니다. 그래서 저장소에는 빈 placeholder 파일 경로만 만들어져 있습니다. 실제 이미지를 넣기 전에는 이미지 로딩이 실패하고, 대신 예쁜 placeholder UI가 표시됩니다.

## 구조

상담 응답은 `src/lib/dogConsultEngine.ts`의 로컬 mock 엔진으로 분리되어 있습니다. 나중에 LLM API로 교체할 때도 Scene 코드를 크게 바꾸지 않도록 `generateDogReply` 함수 경계로 나누었습니다. API 키는 코드에 하드코딩하지 마세요.

## 배경 이미지 직접 사용하기

고퀄리티 점술방 이미지를 직접 배경으로 쓰고 싶다면 아래 경로에 파일을 넣어주세요.

```text
public/assets/background/tarot-room.png
```

이미지가 있으면 CSS로 만든 fallback 점술방 위에 해당 이미지가 먼저 깔립니다. 이미지가 없거나 비어 있어도 앱은 깨지지 않고, CSS로 만든 아치형 창, 책장, 촛불, 수정구, 마법책 배경이 표시됩니다.

## 자유 교체용 이미지 폴더 구조

앞으로 이미지는 아래 폴더에서 자유롭게 넣고 빼면 됩니다. 같은 파일명으로 교체하면 코드 수정 없이 바로 반영됩니다.

```text
public/assets/background/
  tarot-room.png

public/assets/dog/
  dog-main.png
  dog-happy.png
  dog-thinking.png
  dog-petting.png
  dog-heart.png
  dog-poke.png
  dog-wave.png
  dog-letter.png
  dog-celebrate.png

public/assets/tarrotcard/
  card-back.png
  card-love.png
  card-future.png
  card-smile.png
  card-memory.png
  card-promise.png

public/assets/coupleimage/
  photo-01.jpg
  photo-02.jpg
  photo-03.jpg
  photo-04.jpg

public/assets/characterimage/
  chiikawa-usagi.png
  hello-kitty.png
```

사진 목록은 `src/content/photoList.ts`, 타로 카드 목록은 `src/content/tarotCards.ts`, 엔딩 캐릭터는 `src/content/characterMessages.ts`에서 수정할 수 있습니다.

## 손동작별 강아지 반응 이미지

MotionPlayScene에서는 MediaPipe 손 추적 결과로 아래 동작을 인식합니다.

- 쓰담쓰담: `dog-petting.png`
- 손가락하트: `dog-heart.png`
- 콕콕 찌르기: `dog-poke.png`
- 인사: `dog-wave.png`
- 손바닥 펼치기: `dog-happy.png`

각 동작별 대사는 `src/content/dogGestureReactions.ts`에서 수정할 수 있습니다. 특히 각 손동작에서 보여줄 강아지 사진은 해당 파일의 `image` 값을 원하는 경로로 바꾸면 됩니다. 예를 들어 `petting.image`를 `/assets/dog/my-petting.png`로 바꾸고 같은 파일을 넣으면 쓰담쓰담 동작에서 그 사진이 나타납니다. 카메라가 없어도 화면의 fallback 버튼과 손동작 테스트 페이지로 같은 반응을 테스트할 수 있습니다.

