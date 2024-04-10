# 블로그 앱 프론트엔드

## 24.1 작업 환경 준비하기

- `yarn create react-app`

### 24.1.1 설정 파일 만들기

### 24.1.2 라우터 적용

- 프로젝트를 처음 만들고 나서 설계를 시작할 때 가장 먼저 리액트 라우터를 설치 및 적용해보자.

- `yarn add react-router-dom`

- src/pages에 라우트 컴포넌트 생성

  - LoginPage.js - 로그인
  - RegisterPage.js - 회원가입
  - WritePage.js - 글쓰기
  - PostPage.js - 포스트 읽기
  - PostListPage.js - 포스트 목록

- 라우트 컴포넌트를 src/index.js 에서 BrowserRouter로 App을 감싸준다.

```js
import "normalize.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

- src/App.js 컴포넌트에서 Route 컴포넌트를 사용하여 각 라우트의 경로를 지정

```js
import { Route, Routes } from "react-router-dom";
import PostListPage from "./pages/PostListPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import WritePage from "./pages/WritePage";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/write" element={<WritePage />} />
      {/* "/:username 형태는 http://localhost:3000/test 경로에서 test를 username파라미터로 읽을 수 있게 해줌" */}
      <Route path="/:username">
        {/* username URL 파라미터가 주어졌을 때 특정 사용자가 작성한 포스트의 목록을 보여준다. */}
        <Route index element={<PostListPage />} />
        <Route path=":postId" element={<PostPage />} />
      </Route>
    </Routes>
  );
}

export default App;
```

### 24.1.3 스타일 설정

- 색상을 사용할 때 쉽게 뽑아서 쓸 수 있도록 색상 팔레트 파일을 만든다.
- src/lib/styles/pallete.js

### 24.1.4 Button 컴포넌트 만들기

- 버튼 컴포넌트는 다양한 곳에서 재사용할 예정
- src/components/common/Button.js

```js
import React from "react";
import styled from "@emotion/styled";
import palette from "../../lib/styles/pallete";

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }
`;

const Button = props => {
  return <StyledButton {...props} />;
};

export default Button;
```

- pages/PostListPage.js 에서 렌더링 해보기

```js
import React from "react";
import Button from "../components/common/Button";

const PostListPage = () => {
  return (
    <div>
      포스트 목록 페이지
      <Button>버튼</Button>
    </div>
  );
};

export default PostListPage;
```

### 24.1.5 리덕스 적용

- `yarn add redux`
- `yarn add react-redux`
- `yarn add redux-actions`
- `yarn add immer`
- `yarn add redux-devtools-extension`
- Ducks 패턴을 사용하여 액션 타입, 액션 생성 함수, 리듀서가 하나의 파일에 다 정의되어 있는 리덕스 모듈을 작성할 예정
- 일단 틀만 만들어 놓자.

- src/modules/auth.js

```js
import { createAction, handleActions } from "redux-actions";

// 액션 타입
const SAMPLE_ACTION = "auth/SAMPLE_ACTION";

// 액션 생성 함수
export const sampleAction = createAction(SAMPLE_ACTION);

// 초기값
const initState = {};

// 리듀서
const auth = handleActions(
  {
    [SAMPLE_ACTION]: (state, action) => state,
  },
  initState,
);

export default auth;
```

- 루트 리듀서 만들기
- src/modules/index.js

```js
import { combineReducers } from "redux";
import auth from "./auth";

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
```

- 루트 리듀서를 만든 후에 프로젝트의 엔트리 파일 index.js에서 스토어를 생성하고 Provider를 통해 리액트 프로젝트에 리덕스 적용
- src/index.js

```js
import "normalize.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { composeWithDevTools } from "../node_modules/redux-devtools-extension/index";
import App from "./App";
import "./index.css";
import rootReducer from "./modules/index";

const store = createStore(rootReducer, composeWithDevTools());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
```
