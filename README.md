## 24.2 회원가입과 로그인 구현

### 24.2.1 UI 준비하기

- 프레젠테이션 컴포넌트는 components 폴더에 작성하고
- 그 안에 기능별로 폴더(디렉토리)를 새로 만들어서 컴포넌트를 분류하자
- 회원 인증에 관련된 컴포넌트는 회원 인증 페이지에서만 사용되기 때문에 auth 라는 디렉토리를 만들어서 작성
- 회원가입과 로그인 기능을 구현하기 위해 만들어야 할 프레젠테이션 컴포넌트 두 개를 만들자

- components/auth/AuthForm.js

```js
import React from "react";
import styled from "@emotion/styled";

// 회원가입 또는 로그인 폼을 보여준다.

const StyledAuthForm = styled.div``;

const AuthForm = () => {
  return <StyledAuthForm>AuthForm</StyledAuthForm>;
};

export default AuthForm;
```

- components/auth/AuthTemplate.js

```js
import React from "react";
import styled from "@emotion/styled";

// 회원가입/로그인 페이지의 레이아웃을 담당하는 컴포넌트

const StyledAuthTemplate = styled.div``;

const AuthTemplate = ({ children }) => {
  return <StyledAuthTemplate>{children}</StyledAuthTemplate>;
};

export default AuthTemplate;
```

- LoginPage와 RegisterPage에 렌더링
- pages/LoginPage.js

```js
import React from "react";
import AuthForm from "../components/auth/AuthForm";
import AuthTemplate from "../components/auth/AuthTemplate";

const LoginPage = () => {
  return (
    <AuthTemplate>
      <AuthForm />
    </AuthTemplate>
  );
};

export default LoginPage;
```

- pages/RegisterPage.js

```js
import React from "react";
import AuthForm from "../components/auth/AuthForm";
import AuthTemplate from "../components/auth/AuthTemplate";

const RegisterPage = () => {
  return (
    <AuthTemplate>
      <AuthForm />
    </AuthTemplate>
  );
};

export default RegisterPage;
```

#### 24.2.1.1 AuthTemplate 완성하기

- AuthTemplate 컴포넌트는 children으로 받아 온 내용을 보여주기만 하는 역할
- components/auth/AuthTemplate.js

```js
import React from "react";
import styled from "@emotion/styled";
import palette from "../../lib/styles/pallete";
import { Link } from "react-router-dom";

// 회원가입/로그인 페이지의 레이아웃을 담당하는 컴포넌트

// 화면 전체를 채움
const StyledAuthTemplate = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: ${palette.gray[2]};
  /* flex로 내부 내용 중앙 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 흰색 박스
const WhiteBox = styled.div`
  .logo-area {
    display: block;
    padding-bottom: 2rem;
    text-align: center;
    font-weight: bold;
    letter-spacing: 2px;
  }
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 360px;
  background: white;
  border-radius: 2px;
`;

const AuthTemplate = ({ children }) => {
  return (
    <StyledAuthTemplate>
      <WhiteBox>
        <div className="logo-area">
          <Link to="/">REACTERS</Link>
        </div>
        {children}
      </WhiteBox>
    </StyledAuthTemplate>
  );
};

export default AuthTemplate;
```

#### 24.2.1.2 AuthForm 완성하기

- components/common/Button.js

```js
import styled from "@emotion/styled";
import React from "react";
import palette from "../../lib/styles/pallete";
import { css } from "@emotion/react";

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

  ${props =>
    props.fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${props =>
    props.cyan &&
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `}
`;

const Button = props => {
  return <StyledButton {...props} />;
};

export default Button;
```

- components/auth/AuthForm.js

```js
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/pallete";
import Button from "../common/Button";

// 회원가입 또는 로그인 폼을 보여준다.

const StyledAuthForm = styled.div`
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
`;

// 스타일링 된 input
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

// 폼 하단에 로그인 혹은 회원가입 링크를 보여 줌
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const AuthForm = () => {
  return (
    <StyledAuthForm>
      <h3>로그인</h3>
      <form>
        <StyledInput autoComplete="username" name="username" placeholder="아이디" />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
        />
        <Button cyan fullWidth style={{ marginTop: "1rem" }}>
          로그인
        </Button>
      </form>
      <Footer>
        <Link to="/register">회원가입</Link>
      </Footer>
    </StyledAuthForm>
  );
};

export default AuthForm;
```

- AuthForm에서 type props에 따라 다른 내용을 보여 주도록 해보자.
- type 값에 따라 사용되는 문구도 달라지고, type이 "register"일 때는 비밀번호 확인 인풋도 보여주자.
- components/auth/AuthForm.js

```js
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/pallete";
import Button from "../common/Button";

// 회원가입 또는 로그인 폼을 보여준다.

const StyledAuthForm = styled.div`
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
`;

// 스타일링 된 input
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

// 폼 하단에 로그인 혹은 회원가입 링크를 보여 줌
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const textMap = {
  login: "로그인",
  register: "회원가입",
};

const AuthForm = ({ type }) => {
  const text = textMap[type];
  return (
    <StyledAuthForm>
      <h3>{text}</h3>
      <form>
        <StyledInput autoComplete="username" name="username" placeholder="아이디" />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
        />
        {type === "register" && (
          <StyledInput
            autoComplete="new-password"
            name="passwordConfrim"
            placeholder="비밀번호 확인"
            type="password"
          />
        )}
        <ButtonWithMarginTop cyan fullWidth>
          {text}
        </ButtonWithMarginTop>
      </form>
      <Footer>
        {type === "login" ? <Link to="/register">회원가입</Link> : <Link to="/login">로그인</Link>}
      </Footer>
    </StyledAuthForm>
  );
};

export default AuthForm;
```

- pages/LoginPage.js

```js
import React from "react";
import AuthForm from "../components/auth/AuthForm";
import AuthTemplate from "../components/auth/AuthTemplate";

const LoginPage = () => {
  return (
    <AuthTemplate>
      <AuthForm type="login" />
    </AuthTemplate>
  );
};

export default LoginPage;
```

- pages/Register.js

```js
import React from "react";
import AuthForm from "../components/auth/AuthForm";
import AuthTemplate from "../components/auth/AuthTemplate";

const RegisterPage = () => {
  return (
    <AuthTemplate>
      <AuthForm type="register" />
    </AuthTemplate>
  );
};

export default RegisterPage;
```

### 24.2.2 리덕스로 폼 상태 관리하기

- 회원가입과 로그인 폼의 상태를 관리
- modules/auth.js

```js
import { createAction, handleActions } from "redux-actions";
import produce from "immer";

// 액션 타입
const CHANGE_FILED = "auth/CHANGE_FILED";
const INITIALIZE_FORM = "auth/INITIALIZE_FORM";

// 액션 생성 함수
export const changeField = createAction(CHANGE_FILED, ({ form, key, value }) => ({
  form, // register, login
  key, // username, password, passwordConfirm
  value, // 실제 바꾸려는 값
}));
export const initializeForm = createAction(INITIALIZE_FORM, form => form); // register / login

// 초기값
const initState = {
  register: {
    username: "",
    password: "",
    passwordConfrim: "",
  },
  login: {
    username: "",
    password: "",
  },
};

// 리듀서
const auth = handleActions(
  {
    [CHANGE_FILED]: (state, { payload: { form, key, value } }) =>
      produce(state, draft => {
        draft[form][key] = value; // 예: state.register.username을 바꾼다.
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initState[form],
    }),
  },
  initState,
);

export default auth;
```

- 이제 컨테이너 컴포넌트 작성
- useDispatch와 useSelector 사용
- src/containers/auth/LoginForm.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm } from "../modules/auth";
import AuthForm from "../components/auth/AuthForm";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector(({ auth }) => ({
    form: auth.login,
  }));
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "login",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    // 구현예정
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("login"));
  }, [dispatch]);

  return <AuthForm type="login" form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default LoginForm;
```

- pages/LoginPage.js

```js
import React from "react";
import AuthTemplate from "../components/auth/AuthTemplate";
import LoginForm from "../containers/LoginForm";

const LoginPage = () => {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
};

export default LoginPage;
```

- src/components/auth/AuthForm.js

```js
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/pallete";
import Button from "../common/Button";

// 회원가입 또는 로그인 폼을 보여준다.

const StyledAuthForm = styled.div`
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
`;

// 스타일링 된 input
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

// 폼 하단에 로그인 혹은 회원가입 링크를 보여 줌
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const textMap = {
  login: "로그인",
  register: "회원가입",
};

const AuthForm = ({ type, form, onChange, onSubmit }) => {
  const text = textMap[type];
  return (
    <StyledAuthForm>
      <h3>{text}</h3>
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete="username"
          name="username"
          placeholder="아이디"
          onChange={onChange}
          value={form.username}
        />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          value={form.password}
        />
        {type === "register" && (
          <StyledInput
            autoComplete="new-password"
            name="passwordConfrim"
            placeholder="비밀번호 확인"
            type="password"
            onChange={onChange}
            value={form.passwordConfirm}
          />
        )}
        <ButtonWithMarginTop cyan fullWidth>
          {text}
        </ButtonWithMarginTop>
      </form>
      <Footer>
        {type === "login" ? <Link to="/register">회원가입</Link> : <Link to="/login">로그인</Link>}
      </Footer>
    </StyledAuthForm>
  );
};

export default AuthForm;
```

- Register 컴포넌트 구현
- LoginForm 컴포넌트를 복사한뒤 내부에서 사용되는 키워드만 변경
- containers/auth/Register.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector(({ auth }) => ({
    form: auth.register,
  }));
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "login",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    // 구현예정
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("register"));
  }, [dispatch]);

  return <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default RegisterForm;
```

- pages/RegisterPage.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector(({ auth }) => ({
    form: auth.register,
  }));
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "register",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    // 구현예정
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("register"));
  }, [dispatch]);

  return <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default RegisterForm;
```

### 24.2.3 API 연동하기

- `yarn add axios`
- `yarn add redux-saga`
- axios를 사용하여 API 연동
- 비동기 작업을 쉽게 관리하기 위해 redux-saga와 createRequestSaga 유틸 함수 이용

- 유지 보수성을 높이기 위해 파일을 나누어 작성해보자.
- src/lib/api

#### 24.2.3.1 axios 인스턴스 생성

- src/lib/api/client.js

```js
import axios from "axios";

const client = axios.create();

/*
글로벌 설정 예시:

// API 주소를 다른 곳으로 사용함
client.defaults.baseURL = "https://external-api-server.com/"

// 헤더 설정
client.defaults.headers.common["Authorization"] = "Bearer a1b2c3d4";

// 인터셉터 설정
axios.interceptor.response.use({
  response => {
    // 요청 성공 시 특정 작업 수행
    return response;
  },
  error => {
    // 요청 실패 시 특정 작업 수행
    return Promise.reject(error);
  }
})
*/

export default client;
```

#### 24.2.3.2 프록시 설정

- CORS(Cross Origin Request) 오류
- 프록시(proxy) 기능 사용
- 프록시 설정 후 서버를 껐다가 다시 실행
- package.json

```json
"proxy": "http://localhost:4000/"
```

#### 24.2.3.3 API 함수 작성

- lib/api/auth.js

```js
import client from "./client";

// 로그인
export const login = ({ username, password }) =>
  client.post("/api/auth/login", { username, password });

// 회원가입
export const register = ({ username, password }) =>
  client.post("/api/auth/register", { username, password });

// 로그인 상태 확인
export const check = () => client.get("/api/auth/check");
```

#### 24.2.3.4 더 쉬운 API 요청 상태 관리

- redux-saga를 통해 더 쉽게 API를 요청할 수 있도록
- loading 리덕스 모듈과
- createRequestSaga 유틸 함수를 설정

- modules/loading.js

```js
import { createAction, handleActions } from "redux-actions";

// 액션 타입
const START_LOADING = "loading/START_LOADING";
const FINISH_LOADING = "loading/FINISH_LOADING";

// 액션 생성 함수
export const startLoading = createAction(START_LOADING, requestType => requestType);

export const finishLoading = createAction(FINISH_LOADING, requestType => requestType);

// 초기값 설정
const initState = {};

// 리듀서
const loading = handleActions(
  {
    [START_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: true,
    }),
    [FINISH_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: false,
    }),
  },
  initState,
);

export default loading;
```

- 루트 리듀서에 등록
- modules/index.js

```js
import { combineReducers } from "redux";
import auth from "./auth";
import loading from "./loading";

const rootReducer = combineReducers({
  auth,
  loading,
});

export default rootReducer;
```

- lib/createRequestSaga.js

```js
// call 은 비동기 함수(예: API 호출)를 호출하고 결과를 기다리는데 사용
// put 은 특정 액션을 디스패치할 때 사용
import { call, put } from "redux-saga/effects";
// 로딩 상태를 관리하는 액션 생성자 함수를 임포트
import { finishLoading, startLoading } from "../modules/loading";

// createRequestSaga라는 함수를 정의하고 내보냄
// 이 함수는 액션 타입 type과 요청을 처리할 함수 request를 매개변수로 받는다.
export const createRequestSaga = (type, request) => {
  // 요청이 성공했을 때 사용할 액션 타입을 정의
  const SUCCESS = `${type}_SUCCESS`;
  // 요청이 실패했을 때 사용할 액션 타입을 정의
  const FAILURE = `${type}_FAILURE`;

  // 사가를 실행할 제너레이터 함수를 반환, 이 함수는 action을 매개변수로 받는다.
  return function* (action) {
    // 요청 처리가 시작될 때, 로딩 상태를 시작하는 액션을 디스패치한다.
    yield put(startLoading(type)); // 로딩시작
    // 요청 처리를 시도
    try {
      // call 효과를 사용하여 request 함수를 호출한다.
      // 이 때 액션의 payload를 매개변수로 전달한다.
      // 요청 함수의 결과는 response 변수에 저장한다.
      const response = yield call(request, action.payload);
      // 요청이 성공적으로 처리되면, 결과 데이터와 함께 성공 액션을 디스패치한다.
      yield put({
        type: SUCCESS,
        payload: response.data,
      });
      // 요청 처리 중 오류가 발생했을 경우의 처리
    } catch (error) {
      // 오류 정보와 함께 실패 액션을 디스패치한다.
      yield put({
        type: FAILURE,
        payload: error,
        error: true,
      });
    }
    // 요청 처리가 끝나면, 로딩 상태를 종료하는 액션을 디스패치한다.
    yield put(finishLoading(type)); // 로딩 끝
  };
};
```

#### **function\* 제너레이터 함수**

- 제너레이터(generator) 함수는 JavaScript의 특별한 타입의 함수
- 전통적인 함수와는 다르게 여러번에 걸쳐 나누어 값을 반환(return)할 수 있다.
- 제너레이터 함수는 function\* 키워드로 선언하고,
- yield 키워드를 사용해 함수의 실행을 일시 중지하거나 값을 외부에 반환할 수 있다.

- 기본구조

```js
function* generatorFunction() {
  yield "Hello,";
  yield "World!";
}
```

- 주요 특징들
  - 중단과 재개가 가능: 제너레이터 함수는 yield를 만날 때마다 실행을 중단할 수 있고,
  - 필요에 따라 다시 재개할 수 있다. 이 때, 함수의 컨텍스트(변수의 상태 등)는 유지된다.
  - 외부와의 통신 제너레이터는 yield를 통해 값을 반환함으로써 함수 외부와 통신할 수 있으며,
  - 외부에서 next() 메서드를 호출함으로써 제너레이터에 값을 전달할 수도 있다.
  - 반복 가능 객체: 제너레이터 함수는 호출될 때마다 하나의 반복 가능한 객체를 반환한다.
  - 이 반복 가능한 객체는 next() 메서드를 통해 함수의 다음 yield 값에 접근할 수 있다.
- 사용 예시

```js
function* sayNames() {
  yield "Alice";
  yield "Bob";
  yield "Charlie";
}

const namesGenerator = sayNames();

console.log(namesGenerator.next().value); // Alice
console.log(namesGenerator.next().value); // Bob
console.log(namesGenerator.next().value); // Charlie
console.log(namesGenerator.next().done); // true, 더 이상 반환할 값이 없을 때
```

- Redux-Saga와의 관계

  - Redux-Saga에서는 제너레이터 함수를 사용하여 비동기 흐름을 쉽게 관리한다.
  - 예를 들어, API 호출이 완료될 때까지 기다렸다가 결과에 따라 다른 액션을 디스패치하는 과정을
  - 제너레이터를 통해 간결하게 표현할 수 있다.

- 결론
  - 제너레이터 함수는 비동기처리, 반복 가능한 데이터 처리 등 다양한 상황에서 유용하다.
  - 특히 복작한 비동기 작업을 보다 선언적이고 관리하기 쉬운 방식으로 처리할수 있게 해준다.
  - 이는 코드의 가독성과 유지보수성을 향상시키는 데 큰 도움을 준다.

#### 24.2.3.5 auth 리덕스 모듈에서 API 사용하기

- 여섯 가지 액션 타입을 추가로 더 선언
- modules/auth.js

```js
// 액션 타입
const CHANGE_FILED = "auth/CHANGE_FILED";
const INITIALIZE_FORM = "auth/INITIALIZE_FORM";

const REGISTER = "auth/REGISTER";
const REGISTER_SUCCESS = "auth/REGISTER_SUCCESS";
const REGISTER_FAILURE = "auth/REGISTER_FAILURE";

const LOGIN = "auth/LOGIN";
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const LOGIN_FAILURE = "auth/LOGIN_FAILURE";
```

- 리팩토링
- lib/createRequestSaga

```js
//...
export const createRequestActionTypes = type => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};
//...
```

- modules/auth.js

```js
// 액션 타입
const CHANGE_FILED = "auth/CHANGE_FILED";
const INITIALIZE_FORM = "auth/INITIALIZE_FORM";

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes("auth/REGISTER");

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes("auth/LOGIN");
```

- createRequestSaga를 통해 API를 위한 사가를 생성하고,
- 액션 생성 함수와 리듀서도 구현해보자
- modules/auth.js

```js
import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import * as authAPI from "../lib/api/auth";
import { createRequestActionTypes, createRequestSaga } from "../lib/createRequestSaga";

// 액션 타입
const CHANGE_FILED = "auth/CHANGE_FILED";
const INITIALIZE_FORM = "auth/INITIALIZE_FORM";

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes("auth/REGISTER");

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes("auth/LOGIN");

// 액션 생성 함수
export const changeField = createAction(CHANGE_FILED, ({ form, key, value }) => ({
  form, // register, login
  key, // username, password, passwordConfirm
  value, // 실제 바꾸려는 값
}));
export const initializeForm = createAction(INITIALIZE_FORM, form => form); // register / login

export const register = createAction(REGISTER, ({ username, password }) => ({
  username,
  password,
}));
export const login = createAction(LOGIN, ({ username, password }) => ({ username, password }));
// 사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

// 초기값
const initState = {
  register: {
    username: "",
    password: "",
    passwordConfirm: "",
  },
  login: {
    username: "",
    password: "",
  },
  auth: null,
  authError: null,
};

// 리듀서
const auth = handleActions(
  {
    [CHANGE_FILED]: (state, { payload: { form, key, value } }) =>
      produce(state, draft => {
        draft[form][key] = value; // 예: state.register.username을 바꾼다.
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initState[form],
      authError: null, // 폼 전환 시 회원 인증 에러 초기화
    }),
    // 회원가입 성공
    [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 회원가입 실패
    [REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    // 로그인 성공
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 로그인 실패
    [LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
  },
  initState,
);

export default auth;
```

- 구현할 때 로딩에 관련된 상태는 이미 loading 리덕스 모듈에서 관리하므로,
- 성공했을 때와 실패 했을 때의 상태에 대해서만 신경쓰면 된다.
- 리덕스 모듈을 작성했으면 rootSaga를 만들어 주자.
- modules/index.js

```js
import { combineReducers } from "redux";
import auth, { authSaga } from "./auth";
import loading from "./loading";
import { all } from "redux-saga/effects";

const rootReducer = combineReducers({
  auth,
  loading,
});

export function* rootSaga() {
  yield all([authSaga()]);
}

export default rootReducer;
```

- 다음으로 스토어에 redux-saga 미들웨어 적용
- src/index.js

```js
import "normalize.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "../node_modules/redux-devtools-extension/index";
import App from "./App";
import "./index.css";
import rootReducer, { rootSaga } from "./modules/index";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
```

### 24.2.4 회원가입 구현

- containers/auth/RegisterForm.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { form, auth, authError } = useSelector(({ auth }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
  }));
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "register",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    if (password !== passwordConfirm) {
      // TODO: 오류처리
      return;
    }
    dispatch(register({ username, password }));
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("register"));
  }, [dispatch]);

  // 회원가입 성공/실패 처리
  useEffect(() => {
    if (authError) {
      console.log("오류 발생");
      console.log(authError);
      return;
    }
    if (auth) {
      console.log("회원가입 성공");
      console.log(auth);
    }
  }, [auth, authError]);

  return <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default RegisterForm;
```

- 이제 사용자의 상태를 담을 user라는 리덕스 모듈을 만들어보자.
- modules/user.js

```js
import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import * as authAPI from "../lib/api/auth";
import { createRequestActionTypes, createRequestSaga } from "../lib/createRequestSaga";

// 액션타입
const TEMP_SET_USER = "user/TEMP_SET_USER"; // 새로고침 이후 임시 로그인 처리
// 회원 정보 확인
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes("user/CHECK");

// 액션 생성함수
export const tempSetUser = createAction(TEMP_SET_USER, user => user);
export const check = createAction(CHECK);

// 사가 생성
const checkSaga = createRequestSaga(CHECK, authAPI.check);
export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
}

// 초기값
const initState = {
  user: null,
  checkError: null,
};

// 리듀서
export default handleActions(
  {
    [TEMP_SET_USER]: (state, { payload: user }) => ({
      ...state,
      user,
    }),
    [CHECK_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      checkError: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({
      ...state,
      user: null,
      checkError: error,
    }),
  },
  initState,
);
```

- 루트 리듀서에 모듈 포함 시키기
- modules/index.js

```js
import { combineReducers } from "redux";
import auth, { authSaga } from "./auth";
import loading from "./loading";
import { all } from "redux-saga/effects";
import user, { userSaga } from "./user";

const rootReducer = combineReducers({
  auth,
  loading,
  user,
});

export function* rootSaga() {
  yield all([authSaga(), userSaga()]);
}

export default rootReducer;
```

- 리덕스 모듈을 다 작성했으면, 회원가입 성공 후 check를 호출하여
- 현재 사용자가 로그인 상태가 되었는지 확인 해보자.
- containers/auth/RegisterForm.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from "../../modules/user";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "register",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    if (password !== passwordConfirm) {
      // TODO: 오류처리
      return;
    }
    dispatch(register({ username, password }));
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("register"));
  }, [dispatch]);

  // 회원가입 성공/실패 처리
  useEffect(() => {
    if (authError) {
      console.log("오류 발생");
      console.log(authError);
      return;
    }
    if (auth) {
      console.log("회원가입 성공");
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  // user 값이 잘 설정되었는지 확인
  useEffect(() => {
    if (user) {
      console.log("check API 성공");
      console.log(user);
    }
  }, [user]);

  return <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default RegisterForm;
```

- 회원가입에 성공했다면 홈 화면으로 라우트를 이동
- containers/auth/RegisterForm.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from "../../modules/user";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  const navigate = useNavigate();

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "register",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    if (password !== passwordConfirm) {
      // TODO: 오류처리
      return;
    }
    dispatch(register({ username, password }));
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("register"));
  }, [dispatch]);

  // 회원가입 성공/실패 처리
  useEffect(() => {
    if (authError) {
      console.log("오류 발생");
      console.log(authError);
      return;
    }
    if (auth) {
      console.log("회원가입 성공");
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  // user 값이 잘 설정되었는지 확인
  useEffect(() => {
    if (user) {
      navigate("/"); // 홈 화면으로 이동
    }
  }, [navigate, user]);

  return <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default RegisterForm;
```

### 24.2.5 로그인 구현

- containers/auth/LoginForm.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, login } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from "../../modules/user";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  const navigate = useNavigate();

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "login",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { username, password } = form;
    dispatch(login({ username, password }));
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("login"));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      console.log("오류 발생");
      console.log(authError);
      return;
    }
    if (auth) {
      console.log("로그인 성공");
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return <AuthForm type="login" form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default LoginForm;
```

### 24.2.6 회원 인증 에러 처리하기

- 요청이 실패했을 때 에러 메시지를 보여 주는 UI를 만들어보자
- components/auth/AuthForm.js

```js
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/pallete";
import Button from "../common/Button";

// 회원가입 또는 로그인 폼을 보여준다.

const StyledAuthForm = styled.div`
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
`;

// 스타일링 된 input
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

// 폼 하단에 로그인 혹은 회원가입 링크를 보여 줌
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

// 에러를 보여준다.
const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const textMap = {
  login: "로그인",
  register: "회원가입",
};

const AuthForm = ({ type, form, onChange, onSubmit, error }) => {
  const text = textMap[type];
  return (
    <StyledAuthForm>
      <h3>{text}</h3>
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete="username"
          name="username"
          placeholder="아이디"
          onChange={onChange}
          value={form.username}
        />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          value={form.password}
        />
        {type === "register" && (
          <StyledInput
            autoComplete="new-password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            type="password"
            onChange={onChange}
            value={form.passwordConfirm}
          />
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop cyan fullWidth>
          {text}
        </ButtonWithMarginTop>
      </form>
      <Footer>
        {type === "login" ? <Link to="/register">회원가입</Link> : <Link to="/login">로그인</Link>}
      </Footer>
    </StyledAuthForm>
  );
};

export default AuthForm;
```

- AuthForm에서 에러를 보여 주기 위한 준비를 마침
- 이제 상황에 따라 RegisterForm, LoginForm 컴포넌트에서 에러를 나타내 보자.

- containers/auth/LoginForm.js

```js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, login } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from "../../modules/user";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  const navigate = useNavigate();

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "login",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { username, password } = form;
    dispatch(login({ username, password }));
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("login"));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      console.log("오류 발생");
      console.log(authError);
      setError("로그인 실패");
      return;
    }
    if (auth) {
      console.log("로그인 성공");
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <AuthForm type="login" form={form} onChange={onChange} onSubmit={onSubmit} error={error} />
  );
};

export default LoginForm;
```

- 이번에는 회원가입 시 발생하는 에러를 처리해 보자.
- 회원가입은 에러 처리가 조금 까다롭다.

  - username, password, passwordConfirm 중 하나라도 비었을 때
  - password 와 passwordConfirm 값이 일치하지 않을 때
  - username 이 중복될 때

- containers/auth/RegisterForm.js

```js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from "../../modules/user";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  const navigate = useNavigate();

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "register",
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    // 하나라도 비어 있다면
    if ([username, password, passwordConfirm].includes("")) {
      setError("빈 칸을 모두 입력하세요.");
      return;
    }
    // 비밀번호가 일치하지 않는다면
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      dispatch(changeField({ form: "register", key: "password", value: "" }));
      dispatch(changeField({ form: "register", key: "passwordConfirm", value: "" }));
      return;
    }
    dispatch(register({ username, password }));
  };

  // 컴포넌트가 처음 렌더링될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm("register"));
  }, [dispatch]);

  // 회원가입 성공/실패 처리
  useEffect(() => {
    if (authError) {
      // 계정명이 이미 존재할 때
      if (authError.response.status === 409) {
        setError("이미 존재하는 계정명입니다.");
        return;
      }
      // 기타 이유
      setError("회원가입 실패");
      return;
    }
    if (auth) {
      console.log("회원가입 성공");
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  // user 값이 잘 설정되었는지 확인
  useEffect(() => {
    if (user) {
      navigate("/"); // 홈 화면으로 이동
    }
  }, [navigate, user]);

  return (
    <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} error={error} />
  );
};

export default RegisterForm;
```

## 24.3 헤더 컴포넌트 생성 및 로그인 유지

- 헤더 컴포넌트를 구현하고, 로그인 후에 새로고침을 해도 로그인이 유지되는 기능을 만들어보자.

### 24.3.1 헤더 컴포넌트 만들기

- 헤더 컴포넌트를 만들기 전에 Responsive라는 컴포넌트를 작성하자, 반응형 디자인을 할 때 더 편하게 작업하기 위함
- Responsive 컴포넌트는 추후 다양한 컴포넌트에서 사용할 수 있기 때문에 common 디렉토리로 분류

- components/common/Responsive.js

```js
import React from "react";
import styled from "@emotion/styled";

const StyledResponsive = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  width: 1024px;
  margin: 0 auth; // 중앙 정렬

  // 브라우저 크기에 따라 가로 크기 변경
  @media (max-width: 1024px) {
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Responsive = ({ children, ...rest }) => {
  // style, className, onClick, onMouseMove 등의 props를 사용할 수 있도록
  // ...rest를 사용하여 StyledResponsive에게 전달
  return <StyledResponsive {...rest}>{children}</StyledResponsive>;
};

export default Responsive;
```

- 이제 Header 컴포넌트를 만들자.
- 포스트 페이지, 포스트 목록 페이지에서 사용되기 때문에 common 디렉토리에 작성하자.
- components/common/Header.js

```js
import React from "react";
import styled from "@emotion/styled";
import Responsive from "./Responsive";
import Button from "./Button";

const StyledHeader = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

// Responsive 컴포넌트의 속성에 스타일을 추가해서 새로운 컴포넌트 생성
const Wrapper = styled(Responsive)`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

// 헤더가 fixed로 되어 있기 때문에 페이지의 콘텐츠가 4rem 아래에 나타나도록 해 주는 컴포넌트
const Spacer = styled.div`
  height: 4rem;
`;

const Header = () => {
  return (
    <>
      <StyledHeader>
        <Wrapper>
          <div className="logo">REACTERS</div>
          <div className="right">
            <Button>로그인</Button>
          </div>
        </Wrapper>
      </StyledHeader>
      <Spacer />
    </>
  );
};

export default Header;
```

- 헤더 컴포넌트가 언제나 페이지 상단에 떠 있도록 postion 값을 fixed로 설정했다.
- 그런데 헤더 컴포넌트 하단에 나오는 콘텐츠가 헤더의 위치와 겹치게 된다
- 그래서 Spacer라는 컴포넌트를 만들어서 헤더 크기만큼 공간을 차지하도록 했다.
- 이제 PostListPage에서 렌더링 해보자.

- pages/PostListPage.js

```js
import React from "react";
import Header from "../components/common/Header";

const PostListPage = () => {
  return (
    <>
      <Header />
      <div>안녕하세요.</div>
    </>
  );
};

export default PostListPage;
```
