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

## 25.2 에디터 하단 컴포넌트 UI 구현하기

- 에디터 하단에 태그를 추가하는 컴포넌트
- 포스트 작성을 완료하거나 취소하는 버튼을 보여주는 컴포넌트

### 25.2.1 TagBox 만들기

- 태그를 추가하는 컴포넌트 이름을 TagBox라고 하겠다.
- components/write/TagBox.js

```js
import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import palette from "../../lib/styles/pallete";

const StyledTagBox = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.gray[2]};
  padding-top: 2rem;

  h4 {
    color: ${palette.gray[8]};
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
`;

const TagForm = styled.form`
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  width: 256px;
  border: 1px solid ${palette.gray[9]};
  // 스타일 초기화
  input,
  button {
    outline: none;
    border: none;
    font-size: 1rem;
  }
  input {
    padding: 0.5rem;
    flex: 1;
    min-width: 0;
  }
  button {
    cursor: pointer;
    padding-right: 1rem;
    padding-left: 1rem;
    border: none;
    background: ${palette.gray[8]};
    color: white;
    font-weight: bold;
    &:hover {
      background: ${palette.gray[6]};
    }
  }
`;

const Tag = styled.div`
  margin: 0.5rem;
  color: ${palette.gray[6]};
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

const StyledTagList = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

// React.memo를 사용하여 tag 값이 바뀔 때만 리렌더링 되도록 처리
const TagItem = React.memo(function TagItem({ tag, onRemove }) {
  return <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>;
});

// React.memo를 사용하여 tags 값이 바뀔 때만 리렌더링 되도록 처리
const TagList = React.memo(function TagList({ tags, onRemove }) {
  return (
    <StyledTagList>
      {tags.map(tag => (
        <TagItem key={tag} tag={tag} onRemove={onRemove} />
      ))}
    </StyledTagList>
  );
});

const TagBox = () => {
  const [input, setInput] = useState("");
  const [localTags, setLocalTags] = useState([]);

  const insertTag = useCallback(
    tag => {
      if (!tag) return; // 공백이라면 추가하지 않음
      if (localTags.includes(tag)) return; // 이미 존재한다면 추가하지 않음
      setLocalTags([...localTags, tag]);
    },
    [localTags],
  );

  const onRemove = useCallback(
    tag => {
      setLocalTags(localTags.filter(t => t !== tag));
    },
    [localTags],
  );

  const onChange = useCallback(e => {
    setInput(e.target.value);
  }, []);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      insertTag(input.trim()); // 앞뒤 공백을 없앤 후 등록
      setInput(""); // input 초기화
    },
    [input, insertTag],
  );

  return (
    <StyledTagBox>
      <h4>태그</h4>
      <TagForm onSubmit={onSubmit}>
        <input placeholder="태그를 입력하세요" value={input} onChange={onChange} />
        <button type="submit">추가</button>
      </TagForm>
      <TagList tags={localTags} onRemove={onRemove} />
    </StyledTagBox>
  );
};

export default TagBox;
```

- pages/WritePage.js

```js
import React from "react";
import Responsive from "../components/common/Responsive";
import Editor from "../components/write/Editor";
import TagBox from "../components/write/TagBox";

const WritePage = () => {
  return (
    <Responsive>
      <Editor />
      <TagBox />
    </Responsive>
  );
};

export default WritePage;
```

#### 25.2.1.1 WriteActionButtons 만들기

- 포스트 작성 및 취소를 할 수 있는 컴포넌트
- 두 개의 버튼을 만들고 onPublish, onCancel이라는 props를 받아와서 사용해보자.

- components/write/WriteActionButtons.js

```js
import React from "react";
import styled from "@emotion/styled";
import Button from "../common/Button";

const StyledWriteActionButtons = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
  button + button {
    margin-left: 0.5rem;
  }
`;

// TagBox에서 사용하는 버튼과 일치하는 높이로 설정한 후 서로 간의 여백 지정
const StyledButton = styled(Button)`
  height: 2.125rem;
  & + & {
    margin-left: 0.5rem;
  }
`;

const WriteActionButtons = ({ onCancel, onPublish }) => {
  return (
    <StyledWriteActionButtons>
      <StyledButton cyan onClick={onPublish}>
        포스트 등록
      </StyledButton>
      <StyledButton onClick={onCancel}>취소</StyledButton>
    </StyledWriteActionButtons>
  );
};

export default WriteActionButtons;
```

- pages/WritePage.js

```js
import React from "react";
import Responsive from "../components/common/Responsive";
import Editor from "../components/write/Editor";
import TagBox from "../components/write/TagBox";
import WriteActionButtons from "../components/write/WriteActionButtons";

const WritePage = () => {
  return (
    <Responsive>
      <Editor />
      <TagBox />
      <WriteActionButtons />
    </Responsive>
  );
};

export default WritePage;
```

## 25.3 리덕스로 글쓰기 상태 관리하기

- 글쓰기 관련 상태를 리덕스로 관리해줄 차례, write 리덕스 모듈 작성해보자
- modules/write.js

```js
import { handleActions, createAction } from "redux-actions";

// 액션 타입
const INITIALIZE = "write/INITIALIZE"; // 모든 내용 초기화
const CHANGE_FIELD = "write/CHANGE_FIELD"; // 특정 key 값 바꾸기

// 액션 생성 함수
export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD);

// 초기화
const initState = {
  title: "",
  body: "",
  tagas: [],
};

// 리듀서
const write = handleActions(
  {
    [INITIALIZE]: state => initState, // initState를 넣으면 초기 상태로 바뀜
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value, // 특정 key 값을 업데이트
    }),
  },
  initState,
);

export default write;
```

- modules/index.js

```js
import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import auth, { authSaga } from "./auth";
import loading from "./loading";
import user, { userSaga } from "./user";
import write from "./write";

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  write,
});

export function* rootSaga() {
  yield all([authSaga(), userSaga()]);
}

export default rootReducer;
```

- 이제 Editor, TagBox, WriteActionButtons 컴포넌트 각각에 대해 컨테이너 컴포넌트를 만들어주자.

### 25.3.1 EditorContainer 만들기

- containers/write/EditorContainer.js

```js
import React, { useCallback, useEffect } from "react";
import Editor from "../../components/write/Editor";
import { useSelector, useDispatch } from "react-redux";
import { changeField, initialize } from "../../modules/write";

const EditorContainer = () => {
  const dispatch = useDispatch();
  const { title, body } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
  }));

  const onChangeField = useCallback(
    payload => {
      dispatch(changeField(payload));
    },
    [dispatch],
  );

  // 언마운트될 때 초기화
  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  return <Editor onChangeField={onChangeField} title={title} body={body} />;
};

export default EditorContainer;
```

- pages/WritePage.js

```js
import React from "react";
import Responsive from "../components/common/Responsive";
import TagBox from "../components/write/TagBox";
import WriteActionButtons from "../components/write/WriteActionButtons";
import EditorContainer from "../containers/write/EditorContainer";

const WritePage = () => {
  return (
    <Responsive>
      <EditorContainer />
      <TagBox />
      <WriteActionButtons />
    </Responsive>
  );
};

export default WritePage;
```

- Editor 컴포넌트 수정
- components/Editor.js

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

const Editor = ({ title, body, onChangeField }) => {
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

    // quill에 text-change 이벤트 핸들러 등록
    // 참고: https://quilljs.com/docs/api/#events
    const quill = quillInstance.current;
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        onChangeField({ key: "body", value: quill.root.innerHTML });
      }
    });
  }, [onChangeField]);

  const onChangeTitle = e => {
    onChangeField({ key: "title", value: e.target.value });
  };

  return (
    <StyledEditor>
      <TitleInput placeholder="제목을 입력하세요" onChange={onChangeTitle} value={title} />
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>
    </StyledEditor>
  );
};

export default Editor;
```

### 25.3.2 TagBoxContainer 만들기

- containers/write/TagBoxContainer.js

```js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TagBox from "../../components/write/TagBox";
import { changeField } from "../../modules/write";

const TagBoxContainer = () => {
  const dispatch = useDispatch();
  const tags = useSelector(state => state.write.tags);

  const onChangeTags = nextTags => {
    dispatch(
      changeField({
        key: "tags",
        value: nextTags,
      }),
    );
  };

  return <TagBox onChangeTags={onChangeTags} tags={tags} />;
};

export default TagBoxContainer;
```

- pages/WritePage.js

```js
import React from "react";
import Responsive from "../components/common/Responsive";
import WriteActionButtons from "../components/write/WriteActionButtons";
import EditorContainer from "../containers/write/EditorContainer";
import TagBoxContainer from "../containers/write/TagBoxContainer";

const WritePage = () => {
  return (
    <Responsive>
      <EditorContainer />
      <TagBoxContainer />
      <WriteActionButtons />
    </Responsive>
  );
};

export default WritePage;
```

- TagBox 컴포넌트에서 props로 전달받은 onChangeTags와 tags를 사용
- components/write/TagBox.js

```js
import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import palette from "../../lib/styles/pallete";

const TagBoxBlock = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.gray[2]};
  padding-top: 2rem;
  h4 {
    color: ${palette.gray[8]};
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
`;

const TagForm = styled.form`
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  width: 256px;
  border: 1px solid ${palette.gray[9]}; /* 스타일 초기화 */
  input,
  button {
    outline: none;
    border: none;
    font-size: 1rem;
  }

  input {
    padding: 0.5rem;
    flex: 1;
  }
  button {
    cursor: pointer;
    padding-right: 1rem;
    padding-left: 1rem;
    border: none;
    background: ${palette.gray[8]};
    color: white;
    font-weight: bold;
    &:hover {
      background: ${palette.gray[6]};
    }
  }
`;

const Tag = styled.div`
  margin-right: 0.5rem;
  color: ${palette.gray[6]};
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

const TagListBlock = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

// React.memo를 사용하여 tag 값이 바뀔 때만 리렌더링되도록 처리
const TagItem = React.memo(function TagItem({ tag, onRemove }) {
  return <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>;
});

// React.memo를 사용하여 tags 값이 바뀔 때만 리렌더링되도록 처리
const TagList = React.memo(function TagList({ tags, onRemove }) {
  return (
    <TagListBlock>
      {tags.map(tag => (
        <TagItem key={tag} tag={tag} onRemove={onRemove} />
      ))}
    </TagListBlock>
  );
});

const TagBox = ({ tags, onChangeTags }) => {
  const [input, setInput] = useState("");
  const [localTags, setLocalTags] = useState([]);

  const insertTag = useCallback(
    tag => {
      if (!tag) return; // 공백이라면 추가하지 않음
      if (localTags.includes(tag)) return; // 이미 존재한다면 추가하지 않음
      const nextTags = [...localTags, tag];
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags],
  );

  const onRemove = useCallback(
    tag => {
      const nextTags = localTags.filter(t => t !== tag);
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags],
  );

  const onChange = useCallback(e => {
    setInput(e.target.value);
  }, []);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      insertTag(input.trim()); // 앞뒤 공백 없앤 후 등록
      setInput(""); // input 초기화
    },
    [input, insertTag],
  );

  // tags 값이 바뀔 때
  useEffect(() => {
    setLocalTags(tags || []);
  }, [tags]);

  return (
    <TagBoxBlock>
      <h4>태그</h4>
      <TagForm onSubmit={onSubmit}>
        <input placeholder="태그를 입력하세요" value={input} onChange={onChange} />
        <button type="submit">추가</button>
      </TagForm>
      <TagList tags={localTags} onRemove={onRemove} />
    </TagBoxBlock>
  );
};

export default TagBox;
```

### 25.3.3 글쓰기 API 연동하기

- 포스트 관련된 API 요청하는 함수를 post.js라는 파일을 작성해보자
- lib/api/posts.js

```js
import client from "./client";

export const writePost = ({ title, body, tags }) =>
  client.post("/api/posts", { title, body, tags });
```

- 다음으로 이 함수를 호출하는 리덕스 액션과 사가를 준비하자.
- modules/write.js

```js
import { handleActions, createAction } from "redux-actions";
import { createRequestSaga, createRequestActionTypes } from "../lib/createRequestSaga";
import * as postAPI from "../lib/api/posts";
import { takeLatest } from "redux-saga/effects";

// 액션 타입
const INITIALIZE = "write/INITIALIZE"; // 모든 내용 초기화
const CHANGE_FIELD = "write/CHANGE_FIELD"; // 특정 key 값 바꾸기
const [WRITE_POST, WRITE_POST_SUCCESS, WRITE_POST_FAILURE] =
  createRequestActionTypes("write/WRITE_POST");

// 액션 생성 함수
export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));
export const writePost = createAction(WRITE_POST, ({ title, body, tags }) => ({
  title,
  body,
  tags,
}));

// 사가 생성
const writePostSaga = createRequestSaga(WRITE_POST, postAPI.writePost);
export function* writeSaga() {
  yield takeLatest(WRITE_POST, writePostSaga);
}

// 초기화
const initState = {
  title: "",
  body: "",
  tagas: [],
  post: null,
  postError: null,
};

// 리듀서
const write = handleActions(
  {
    [INITIALIZE]: state => initState, // initState를 넣으면 초기 상태로 바뀜
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value, // 특정 key 값을 업데이트
    }),
    [WRITE_POST]: state => ({
      ...state,
      // post와 postError를 초기화
      post: null,
      postError: null,
    }),
    // 포스트 작성 성공
    [WRITE_POST_SUCCESS]: (state, { payload: post }) => ({
      ...state,
      post,
    }),
    [WRITE_POST_FAILURE]: (state, { payload: postError }) => ({
      ...state,
      postError,
    }),
  },
  initState,
);

export default write;
```

- 리덕스 모듈을 수정한 후 writeSaga를 rootSaga에 등록하자
- modules/index.js

```js
import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import auth, { authSaga } from "./auth";
import loading from "./loading";
import user, { userSaga } from "./user";
import write, { writeSaga } from "./write";

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  write,
});

export function* rootSaga() {
  yield all([authSaga(), userSaga(), writeSaga()]);
}

export default rootReducer;
```

- 이제 포스트를 작성하는 API를 호출하기 위한 준비를 마침
- WriteActionButtonsContainer를 작성하자
- containers/write/WriteActionButtonsContainer.js

```js
import React, { useEffect } from "react";
import WriteActionButtons from "../../components/write/WriteActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { writePost } from "../../modules/write";

const WriteActionButtonsContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title, body, tags, post, postError } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    post: write.post,
    postError: write.postError,
  }));

  // 포스트 등록
  const onPublish = () => {
    dispatch(
      writePost({
        title,
        body,
        tags,
      }),
    );
  };

  // 취소
  const onCancel = () => {
    navigate(-1);
  };

  // 성공 혹은 실패 시 할 작업
  useEffect(() => {
    if (post) {
      const { _id, user } = post;
      navigate(`/${user.username}/${_id}`);
    }
    if (postError) {
      console.log(postError);
    }
  }, [navigate, post, postError]);

  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} />;
};

export default WriteActionButtonsContainer;
```

- pages/WritePage.js

```js
import React from "react";
import Responsive from "../components/common/Responsive";
import EditorContainer from "../containers/write/EditorContainer";
import TagBoxContainer from "../containers/write/TagBoxContainer";
import WriteActionButtonsContainer from "../containers/write/WriteActionButtonsContainer";

const WritePage = () => {
  return (
    <Responsive>
      <EditorContainer />
      <TagBoxContainer />
      <WriteActionButtonsContainer />
    </Responsive>
  );
};

export default WritePage;
```

- WritePage와 관련된 컴포넌트들은 나중에 수정 기능을 구현할 때 다시 한 번 수정하겠음
