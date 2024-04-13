# 27. 수정/삭제 기능 구현 및 마무리

## 27.1 포스트 수정기능

### 27.1.1 PostActionButtons 컴포넌트 만들기

- 포스트 읽는 화면에서 포스트 작성자에게만 포스트 상단에 **수정** 버튼과 **삭제** 버튼이 나타나도록 해보자.
- components/post/PostActionButton.js

```js
import React from "react";
import styled from "@emotion/styled";
import palette from "../../lib/styles/pallete";

const PostActionButtonsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  margin-top: -1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: ${palette.gray[6]};
  font-weight: bold;
  border: none;
  outline: none;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${palette.gray[1]};
    color: ${palette.cyan[7]};
  }
  & + & {
    margin-left: 0.25rem;
  }
`;

const PostActionButtons = () => {
  return (
    <PostActionButtonsBlock>
      <ActionButton>수정</ActionButton>
      <ActionButton>삭제</ActionButton>
    </PostActionButtonsBlock>
  );
};

export default PostActionButtons;
```

- 이제 PostActionButtons 컴포넌트를 PostViewer의 PostHead 하단에서 보여 주어야 한다.
- 그런데 이 컴포넌트를 PostViewer에서 직접 렌더링하면,
- 나중에 PostActionButtons에 onEdit, onRemove 등의 props를 전달할 때
- 무조건 PostViewer를 거쳐서 전달해야 한다.
- PostViewer는 사용하지 않지만 내부의 컴포넌트에서 필요하기 때문에 한번 거쳐서 전달 해야하는 것에 조금 불편함

- 여기에는 두가지 방법 중 props를 JSX형태로 받아와서 렌더링 하는 방법을 써보자.
- components/post/PostViewer.js 수정

```js
const PostViewer = ({ post, error, loading, actionButtons }) => {
  // 에러 발생 시
  if (error) {
    if (error.response && error.response.status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    }
    return <PostViewerBlock>오류 발생!</PostViewerBlock>;
  }

  // 로딩 중이거나 아직 포스트 데이터가 없을 때
  if (loading || !post) {
    return null;
  }

  const { title, body, user, publishedDate, tags } = post;

  return (
    <PostViewerBlock>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo username={user.username} publishedDate={publishedDate} hasMarginTop />
        <Tags tags={tags} />
      </PostHead>
      {actionButtons}
      <PostContent dangerouslySetInnerHTML={{ __html: body }} />
    </PostViewerBlock>
  );
};

export default PostViewer;
```

- 그리고 PostViewerContainer에서 PostActionButtons를 불러온 후
- PostViewer의 actionButtons props를 통해 렌더링 해보자.
- containers/post/PostViewerContainer.js

```js
return (
  <PostViewer post={post} loading={loading} error={error} actionButtons={<PostActionButtons />} />
);
```

- 로그인된 사용자에 따라 버튼을 숨기는 작업은 나중에 구현하겠다.

### 27.1.2 수정 버튼 클릭 시 글쓰기 페이지로 이동하기

- **수정** 버튼을 클릭하면 글쓰기 페이지로 이동하고, 현재 보고있는 포스트가 나타나게 해보자.
- write 리덕스 모듈에 SET_ORIGINAL_POST라는 액션을 만들자.
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
const SET_ORIGINAL_POST = "write/SET_ORIGINAL_POST";

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
export const setOriginalPost = createAction(SET_ORIGINAL_POST, post => post);

// 사가 생성
const writePostSaga = createRequestSaga(WRITE_POST, postAPI.writePost);
export function* writeSaga() {
  yield takeLatest(WRITE_POST, writePostSaga);
}

// 초기화
const initState = {
  title: "",
  body: "",
  tags: [],
  post: null,
  postError: null,
  originalPostId: null,
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
    [SET_ORIGINAL_POST]: (state, { payload: post }) => ({
      ...state,
      title: post.title,
      body: post.body,
      tags: post.tags,
      originalPostId: post._id,
    }),
  },
  initState,
);

export default write;
```

- 액션을 추가한 뒤에는 PostViewerContainer를 수정
- containers/posts/PostViewerContainer.js

```js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { readPost, unloadPost } from "../../modules/post";
import PostViewer from "../../components/post/PostViewer";
import PostActionButtons from "../../components/post/PostActionButtons";
import { setOriginalPost } from "../../modules/write";

const PostViewerContainer = () => {
  // 처음 마운트될 때 포스트 읽기 API 요청
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, error, loading, user } = useSelector(({ post, loading, user }) => ({
    post: post.post,
    error: post.error,
    loading: loading["post/READ_POST"],
    user: user.user,
  }));

  useEffect(() => {
    dispatch(readPost(postId));
    // 언마운트될 때 리덕스에서 포스트 데이터 없애기
    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate("/write");
  };

  const ownPost = (user && user._id) === (post && post.user._id);

  return (
    <PostViewer
      post={post}
      loading={loading}
      error={error}
      actionButtons={ownPost && <PostActionButtons onEdit={onEdit} />}
    />
  );
};

export default PostViewerContainer;
```

- 이제 수정 버튼이 클릭되면 props로 전달받은 onEdit를 호출
- components/post/PostActionButtons.js

```js
import React from "react";
import styled from "@emotion/styled";
import palette from "../../lib/styles/pallete";

const PostActionButtonsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  margin-top: -1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: ${palette.gray[6]};
  font-weight: bold;
  border: none;
  outline: none;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${palette.gray[1]};
    color: ${palette.cyan[7]};
  }
  & + & {
    margin-left: 0.25rem;
  }
`;

const PostActionButtons = ({ onEdit }) => {
  return (
    <PostActionButtonsBlock>
      <ActionButton onClick={onEdit}>수정</ActionButton>
      <ActionButton>삭제</ActionButton>
    </PostActionButtonsBlock>
  );
};

export default PostActionButtons;
```

- 수정 버튼을 누르면 글쓰기 페이지로 이동하고, 기존 값으로 초기 값이 설정되도록 Editor 컴포넌트 수정
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

const Editor = ({ title, body, onChangeField }) => {
  const quillElement = useRef(null); // Quill을 적용할 DivElement를 설정
  const quillInstance = useRef(null); // Quill 인스턴스를 설정

  // Quill 인스턴스 초기화
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

  // body 값이 변경될 때 Quill 에디터 반영
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    quillInstance.current.root.innerHTML = body;
  }, [body]);

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

- 수정 API 사용
- lib/api/posts.js

```js
import client from "./client";

export const writePost = ({ title, body, tags }) =>
  client.post("/api/posts", { title, body, tags });

export const readPost = id => client.get(`/api/posts/${id}`);

export const listPosts = ({ page, username, tag }) => {
  return client.get(`/api/posts`, {
    params: { page, username, tag },
  });
};

export const updatePost = ({ id, title, body, tags }) =>
  client.patch(`api/posts/${id}`, {
    title,
    body,
    tags,
  });
```

- write 리덕스 모듈에서 UPDATE_POST 액션과 updatePostSaga 생성
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
const SET_ORIGINAL_POST = "write/SET_ORIGINAL_POST";
const [UPDATE_POST, UPDATE_POST_SUCCESS, UPDATE_POST_FAILURE] =
  createRequestActionTypes("write/UPDATE_POST");

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
export const setOriginalPost = createAction(SET_ORIGINAL_POST, post => post);
export const updatePost = createAction(UPDATE_POST, ({ id, title, body, tags }) => ({
  id,
  title,
  body,
  tags,
}));

// 사가 생성
const writePostSaga = createRequestSaga(WRITE_POST, postAPI.writePost);
const updatePostSaga = createRequestSaga(UPDATE_POST, postAPI.updatePost);

export function* writeSaga() {
  yield takeLatest(WRITE_POST, writePostSaga);
  yield takeLatest(UPDATE_POST, updatePostSaga);
}

// 초기화
const initState = {
  title: "",
  body: "",
  tags: [],
  post: null,
  postError: null,
  originalPostId: null,
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
    [SET_ORIGINAL_POST]: (state, { payload: post }) => ({
      ...state,
      title: post.title,
      body: post.body,
      tags: post.tags,
      originalPostId: post._id,
    }),
    [UPDATE_POST_SUCCESS]: (state, { payload: post }) => ({
      ...state,
      post,
    }),
    [UPDATE_POST_FAILURE]: (state, { payload: postError }) => ({
      ...state,
      postError,
    }),
  },
  initState,
);

export default write;
```

- write 모듈에서 포스트 수정을 위한 코드를 작성한 후에는
- WriteActionButtonsContainer와 WriteActionButtons 컴포넌트를 차례로 수정
- containers/write/WriteActionButtonsContainer.js

```js
import React, { useEffect } from "react";
import WriteActionButtons from "../../components/write/WriteActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { writePost, updatePost } from "../../modules/write";

const WriteActionButtonsContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title, body, tags, post, postError, originalPostId } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    post: write.post,
    postError: write.postError,
    originalPostId: write.originalPostId,
  }));

  // 포스트 등록
  const onPublish = () => {
    if (originalPostId) {
      dispatch(updatePost({ title, body, tags, id: originalPostId }));
      return;
    }
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

  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} isEdit={!!originalPostId} />;
};

export default WriteActionButtonsContainer;
```

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

const WriteActionButtons = ({ onCancel, onPublish, isEdit }) => {
  return (
    <StyledWriteActionButtons>
      <StyledButton cyan onClick={onPublish}>
        포스트 {isEdit ? "수정" : "등록"}
      </StyledButton>
      <StyledButton onClick={onCancel}>취소</StyledButton>
    </StyledWriteActionButtons>
  );
};

export default WriteActionButtons;
```

## 27.2 포스트 삭제

- 삭제 버튼을 누를 때 포스트를 바로 삭제하는 것이 아니라, 사용자의 확인을 한 번 더 요청하고나서 삭제
- 사용자에게 한 번 더 확인을 요청하기 위해 모달 컴포넌트를 만들자.
- components/common/AskModal.js

```js
import React from "react";
import styled from "@emotion/styled";
import Button from "./Button";

const Fullscreen = styled.div`
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const AskModalBlock = styled.div`
  width: 320px;
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.125);
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  p {
    margin-bottom: 3rem;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
`;
const StyledButton = styled(Button)`
  height: 2rem;
  & + & {
    margin-left: 0.75rem;
  }
`;

const AskModal = ({
  visible,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <Fullscreen>
      <AskModalBlock>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="buttons">
          <StyledButton onClick={onCancel}>{cancelText}</StyledButton>
          <StyledButton cyan onClick={onConfirm}>
            {confirmText}
          </StyledButton>
        </div>
      </AskModalBlock>
    </Fullscreen>
  );
};

export default AskModal;
```

- AskModal을 기반으로 post 디렉토리에 AskRemoveModal 컴포넌트 작성
- components/post/AskRemoveModal.js

```js
import React from "react";
import AskModal from "../common/AskModal";

const AskRemoveModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <AskModal
      visible={visible}
      title="포스트 삭제"
      description="포스트를 정말 삭제하시겠습니까?"
      confirmText="삭제"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default AskRemoveModal;
```

- components/post/PostActionButtons.js

```js
import React, { useState } from "react";
import styled from "@emotion/styled";
import palette from "../../lib/styles/pallete";
import AskRemoveModal from "./AskRemoveModal";

const PostActionButtonsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  margin-top: -1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: ${palette.gray[6]};
  font-weight: bold;
  border: none;
  outline: none;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${palette.gray[1]};
    color: ${palette.cyan[7]};
  }
  & + & {
    margin-left: 0.25rem;
  }
`;

const PostActionButtons = ({ onEdit, onRemove }) => {
  const [modal, setModal] = useState(false);
  const onRemoveClick = () => {
    setModal(true);
  };
  const onCancel = () => {
    setModal(false);
  };
  const onConfirm = () => {
    setModal(false);
    onRemove();
  };

  return (
    <>
      <PostActionButtonsBlock>
        <ActionButton onClick={onEdit}>수정</ActionButton>
        <ActionButton onClick={onRemoveClick}>삭제</ActionButton>
      </PostActionButtonsBlock>
      <AskRemoveModal visible={modal} onConfirm={onConfirm} onCancel={onCancel} />
    </>
  );
};

export default PostActionButtons;
```

- removePost 함수 구현
- lib/api/posts.js

```js
export const removePost = id => client.delete(`/api/posts/${id}`);
```

- containers/post/PostViewerContainer.js

```js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { readPost, unloadPost } from "../../modules/post";
import PostViewer from "../../components/post/PostViewer";
import PostActionButtons from "../../components/post/PostActionButtons";
import { setOriginalPost } from "../../modules/write";
import { removePost } from "../../lib/api/posts";

const PostViewerContainer = () => {
  // 처음 마운트될 때 포스트 읽기 API 요청
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, error, loading, user } = useSelector(({ post, loading, user }) => ({
    post: post.post,
    error: post.error,
    loading: loading["post/READ_POST"],
    user: user.user,
  }));

  useEffect(() => {
    dispatch(readPost(postId));
    // 언마운트될 때 리덕스에서 포스트 데이터 없애기
    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate("/write");
  };

  const onRemove = async () => {
    try {
      await removePost(postId);
      navigate("/"); // 홈으로 이동
    } catch (error) {
      console.log(error);
    }
  };

  const ownPost = (user && user._id) === (post && post.user._id);

  return (
    <PostViewer
      post={post}
      loading={loading}
      error={error}
      actionButtons={ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />}
    />
  );
};

export default PostViewerContainer;
```

## 27.3 react-helmet-async로 meta 태그 설정하기

- 구글, 네이버 같은 검색 엔진에서 웹 페이지를 수집할 때는 meta 태그를 읽는다.
- 이 meta 태그를 리액트 앱에서 설정하는 방법을 알아보자.
- `yarn add react-helmet-async`

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
import { check, tempSetUser } from "./modules/user";
import { HelmetProvider } from "react-helmet-async";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

function loadUser() {
  try {
    const user = localStorage.getItem("user");
    if (!user) return; // 로그인 상태가 아니라면 아무것도 안 함
    store.dispatch(tempSetUser(JSON.parse(user)));
    store.dispatch(check());
  } catch (error) {
    console.log("localStorage is not working");
  }
}

sagaMiddleware.run(rootSaga);
loadUser();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>,
);
```

- 그러고 나서 meta 태그를 설정하고 싶은 곳에 Helmet 컴포넌트를 사용하면 된다.
- src/App.js

```js
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PostListPage from "./pages/PostListPage";
import PostPage from "./pages/PostPage";
import RegisterPage from "./pages/RegisterPage";
import WritePage from "./pages/WritePage";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <>
      <Helmet>
        <title>REACTERS</title>
      </Helmet>
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
    </>
  );
}

export default App;
```

- pages/WritePage.js

```js
import React from "react";
import Responsive from "../components/common/Responsive";
import EditorContainer from "../containers/write/EditorContainer";
import TagBoxContainer from "../containers/write/TagBoxContainer";
import WriteActionButtonsContainer from "../containers/write/WriteActionButtonsContainer";
import { Helmet } from "react-helmet-async";

const WritePage = () => {
  return (
    <Responsive>
      <Helmet>
        <title>글 작성하기 - REACTERS</title>
      </Helmet>
      <EditorContainer />
      <TagBoxContainer />
      <WriteActionButtonsContainer />
    </Responsive>
  );
};

export default WritePage;
```

- components/post/PostViewer.js

```js
return (
    <PostViewerBlock>
      <Helmet>
        <title>{title} - REACTERS</title>
      </Helmet>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo username={user.username} publishedDate={publishedDate} hasMarginTop />
        <Tags tags={tags} />
      </PostHead>
      {actionButtons}
      <PostContent dangerouslySetInnerHTML={{ __html: body }} />
    </PostViewerBlock>
  );
};

export default PostViewer;
```

## 27.4 프로젝트 마무리

### 27.4.1 프로젝트 빌드하기

- 백엔드 서버를 통해 리액트 앱을 제공할 수 있또록 빌드해 주어야 한다.
- $ yarn build

### 27.4.2 koa-static으로 정적 파일 제공하기

- 서버를 통해 build 디렉토리 안의 파일을 사용할 수 있도록 koa-static을 사용하여 정적 파일 제공 기능을 구현
- blog-backend에서 작업
- `yarn add koa-static`
- src/index.js 수정

```js
require("dotenv").config();
const koa = require("koa");
// koa-router를 불러온 뒤
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const serve = require("koa-static");
const path = require("path");
const send = require("koa-send");

const api = require("./api");
const jwtMiddleware = require("./lib/jwtMiddleware");
const { createFakeData } = require("./createFakeData");

// 구조분해 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // createFakeData();
  })
  .catch(error => {
    console.error(error);
  });

const app = new koa();
// koa-router를 사용하여 Router 인스턴스 생성
const router = new Router();

// 라우터 설정
router.use("/api", api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, "../build");
app.use(serve(buildDirectory));
app.use(async ctx => {
  // Not Found이고, 주소가 /api 로 시작하지 않는 경우
  if (ctx.status === 404 && ctx.path.indexOf("/api") !== 0) {
    // index.html 내용을 반환
    await send(ctx, "index.html", { root: buildDirectory });
  }
});

// PORT가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
  console.log("Listening to port %d", port);
});
```
