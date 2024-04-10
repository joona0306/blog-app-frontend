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

- components/auth/AuthForm.js

```js

```
