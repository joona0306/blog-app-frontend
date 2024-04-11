# 25. 글쓰기 기능 구현하기

## 25.1 에디터 UI 구현하기

- Quill 에디터 라이브러리 사용
- 제목은 input, 내용은 Quill 에디터 사용
- `yarn add quill`

- components/write/Editor.js

```js
import styled from "@emotion/styled";
import Quill from "quill";
import "quill/dist/quill.bubble.css";
import React, { useEffect, useRef } from "react";
import palette from "../../lib/styles/pallete";
import Responsive from "../common/Responsive";

const StyledEditor = styled(Responsive)`
  /* 페이지 위아래 여백 지정 */
  padding-top: 5rem;
  padding-bottom: 5rem;
`;
const TitleInput = styled.input`
  font-size: 3rem;
  outline: none;
  padding-bottom: 0.5rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  width: 100%;
`;
const QuillWrapper = styled.div`
  /* 최소 크기 지정 및 padding 제거 */
  .ql-editor {
    padding: 0;
    min-height: 320px;
    font-size: 1.125rem;
    line-height: 1.5;
  }
  .ql-editor .ql-blank::before {
    left: 0;
  }
`;

const Editor = () => {
  const quillElement = useRef(null); // Quill을 적용할 DivElement를 설정
  const quillInstance = useRef(null); // Quill 인스턴스를 설정

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: "bubble",
      placeholder: "내용을 작성하세요...",
      modules: {
        // 더 많은 옵션
        // https://quilljs.com/docs/modules/toolbar/ 참고
        toolbar: [
          [{ header: "1" }, { header: "2" }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["code-block", "link", "image"],
        ],
      },
    });
  }, []);

  return (
    <StyledEditor>
      <TitleInput placeholder="제목을 입력하세요" />
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>
    </StyledEditor>
  );
};

export default Editor;
```

- 외부 라이브러리를 연동할 때는 useRef와 useEffect를 적절하게 사용하면 된다.
- Editor 컴포넌트를 WritePage에 렌더링하자.
- pages/WritePage.js

```js
import React from "react";
import Responsive from "../components/common/Responsive";
import Editor from "../components/write/Editor";

const WritePage = () => {
  return (
    <Responsive>
      <Editor />
    </Responsive>
  );
};

export default WritePage;
```

## 25.2 TagBox 만들기

- 태그를 추가하는 컴포넌트 이름을 TagBox라고 하겠다.
- components/write/TagBox.js
