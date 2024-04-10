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
export const check = () => client.post("/api/auth/check");
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
