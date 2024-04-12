# 26. 포스트 조회 기능 구현하기

## 26.1 포스트 읽기 페이지 구현하기

### 26.1.1 PostViewer UI 준비하기

- 서버에서 데이터를 받아 오기 전에 먼저 UI를 준비하자

  - 포스트 제목
  - 작성자 계정명
  - 작성된 시간
  - 태그
  - 제목
  - 내용

- components/post/PostViewer.js

```js
import React from "react";
import styled from "@emotion/styled";
import pallete from "../../lib/styles/pallete";
import Responsive from "../common/Responsive";

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
`;
const PostHead = styled.div`
  border-bottom: 1px solid ${pallete.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;
const SubInfo = styled.div`
  margin-top: 1rem;
  color: ${pallete.gray[6]};

  // span 사이에 가운데 점 문자 보여주기
  span + span:before {
    color: ${pallete.gray[5]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7"; // 가운데 점 문자
  }
`;
const Tags = styled.div`
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: ${pallete.cyan[7]};
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: ${pallete.cyan[6]};
    }
  }
`;
const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${pallete.gray[8]};
`;

const PostViewer = () => {
  return (
    <PostViewerBlock>
      <PostHead>
        <h1>제목</h1>
        <SubInfo>
          <span>
            <b>tester</b>
          </span>
          <span>{new Date().toLocaleDateString()}</span>
        </SubInfo>
        <Tags>
          <div className="tag">#태그1</div>
          <div className="tag">#태그1</div>
          <div className="tag">#태그1</div>
        </Tags>
      </PostHead>
      <PostContent dangerouslySetInnerHTML={{ __html: "<p>HTML <b>내용</b>입니다.</p>" }} />
    </PostViewerBlock>
  );
};

export default PostViewer;
```

- pages/PostPage.js

```js
import React from "react";
import HeaderContainer from "../containers/common/HeaderContainer";
import PostViewer from "../components/post/PostViewer";

const PostPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostViewer />
    </>
  );
};

export default PostPage;
```

### 26.1.2 API 연동하기

- API를 연동하여 실제 데이터를 보여 주도록 수정하자.
- lib/api/posts.js 파일에서 포스트를 읽게 해 주는 readPost 함수를 추가하자.
- lib/api/posts.js

```js
import client from "./client";

export const writePost = ({ title, body, tags }) =>
  client.post("/api/posts", { title, body, tags });

export const readPost = id => client.get(`/api/posts/${id}`);
```

다음으로 post라는 리덕스 모듈을 작성

- modules/post.js

```js
import { createAction, handleActions } from "redux-actions";
import { createRequestSaga, createRequestActionTypes } from "../lib/createRequestSaga";
import * as postsAPI from "../lib/api/posts";
import { takeLatest } from "redux-saga/effects";

// 액션 타입
const [READ_POST, READ_POST_SUCCESS, READ_POST_FAILURE] =
  createRequestActionTypes("post/READ_POST");
const UNLOAD_POST = "post/UNLOAD_POST"; // 포스트 페이지에서 벗어날 때 데이터 비우기

// 액션 생성 함수
export const readPost = createAction(READ_POST, id => id);
export const unloadPost = createAction(UNLOAD_POST);

// 사가 생성
const readPostSaga = createRequestSaga(READ_POST, postsAPI.readPost);
export function* postSaga() {
  yield takeLatest(READ_POST, readPostSaga);
}

// 초기값
const initState = {
  post: null,
  error: null,
};

// 리듀서
const post = handleActions(
  {
    [READ_POST_SUCCESS]: (state, { payload: post }) => ({
      ...state,
      post,
    }),
    [READ_POST_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [UNLOAD_POST]: () => initState,
  },
  initState,
);

export default post;
```

- 루트 리듀서와 사가에 등록
- modules/index.js

```js
import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import auth, { authSaga } from "./auth";
import loading from "./loading";
import user, { userSaga } from "./user";
import write, { writeSaga } from "./write";
import post, { postSaga } from "./post";

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  write,
  post,
});

export function* rootSaga() {
  yield all([authSaga(), userSaga(), writeSaga(), postSaga()]);
}

export default rootReducer;
```

- 리덕스 모듈을 준비하는 과정을 마침
- PostViewer를 위한 컨테이너 컴포넌트를 만들자.
- containers/post/PostViewerContainer.js

```js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { readPost, unloadPost } from "../../modules/post";
import PostViewer from "../../components/post/PostViewer";

const PostViewerContainer = () => {
  // 처음 마운트될 때 포스트 읽기 API 요청
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, error, loading } = useSelector(({ post, loading }) => ({
    post: post.post,
    error: post.error,
    loading: loading["post/READ_POST"],
  }));

  useEffect(() => {
    dispatch(readPost(postId));
    // 언마운트될 때 리덕스에서 포스트 데이터 없애기
    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  return <PostViewer post={post} loading={loading} error={error} />;
};

export default PostViewerContainer;
```

- pages/PostPage.js

```js
import React from "react";
import HeaderContainer from "../containers/common/HeaderContainer";
import PostViewerContainer from "../containers/post/PostViewerContainer";

const PostPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostViewerContainer />
    </>
  );
};

export default PostPage;
```

- PostViewer에 필요한 props를 넣어 주엇으니, 해당 props를 PostViewer 컴포넌트에서 사용해보자.
- components/post/PostViewer.js

```js
import React from "react";
import styled from "@emotion/styled";
import pallete from "../../lib/styles/pallete";
import Responsive from "../common/Responsive";

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
`;
const PostHead = styled.div`
  border-bottom: 1px solid ${pallete.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;
const SubInfo = styled.div`
  margin-top: 1rem;
  color: ${pallete.gray[6]};

  // span 사이에 가운데 점 문자 보여주기
  span + span:before {
    color: ${pallete.gray[5]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7"; // 가운데 점 문자
  }
`;
const Tags = styled.div`
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: ${pallete.cyan[7]};
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: ${pallete.cyan[6]};
    }
  }
`;
const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${pallete.gray[8]};
`;

const PostViewer = ({ post, error, loading }) => {
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
        <SubInfo>
          <span>
            <b>{user.username}</b>
          </span>
          <span>{new Date(publishedDate).toLocaleDateString()}</span>
        </SubInfo>
        <Tags>
          {tags.map(tag => (
            <div className="tag" key={tag}>
              #{tag}
            </div>
          ))}
        </Tags>
      </PostHead>
      <PostContent dangerouslySetInnerHTML={{ __html: body }} />
    </PostViewerBlock>
  );
};

export default PostViewer;
```

## 26.2 포스트 목록 페이지 구현하기

- 여러 개의 포스트를 보여 주는 포스트 목록 페이지를 구현

### 26.2.1 PostList UI 준비하기

- 포스트들을 배열로 받아 와서 렌더링 해준다.
- 사용자가 로그인 중이라면 페이지 상단 우측에 **새 글 작성하기** 버튼을 보여준다.
- components/posts/PostList.js

```js
import React from "react";
import styled from "@emotion/styled";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import palette from "../../lib/styles/pallete";

const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
`;
const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
`;
const PostItemBlock = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  // 맨 위 포스트는 padding-top 없음
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[6]};
    }
  }
  p {
    margin-top: 2rem;
  }
`;
const SubInfo = styled.div`
  // margin-top: 1rem
  color: ${palette.gray[6]};

  // span 사이에 가운데 점 문자 보여주기
  span + span:before {
    color: ${palette.gray[4]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7"; // 가운데 점 문자
  }
`;
const Tags = styled.div`
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: ${palette.cyan[7]};
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: ${palette.cyan[6]};
    }
  }
`;
const PostItem = () => {
  return (
    <PostItemBlock>
      <h2>제목</h2>
      <SubInfo>
        <span>
          <b>username</b>
        </span>
        <span>{new Date().toLocaleDateString()}</span>
      </SubInfo>
      <Tags>
        <div className="tag">#태그1</div>
        <div className="tag">#태그2</div>
      </Tags>
      <p>포스트 내용의 일부분...</p>
    </PostItemBlock>
  );
};

const PostList = () => {
  return (
    <PostListBlock>
      <WritePostButtonWrapper>
        <Button cyan to="/write">
          새 글 작성하기
        </Button>
      </WritePostButtonWrapper>
      <div>
        <PostItem />
        <PostItem />
        <PostItem />
      </div>
    </PostListBlock>
  );
};

export default PostList;
```

- SubInfo 컴포넌트와 Tags 컴포넌트를 common 디렉토리에 따로 분리시켜서 재활용 하자.
- 그리고 분리시킬 때 계정명이 나타나는 붑ㄴ과 각 태그가 나타나는 부분에 Link를 사용하여 클릭 시 이동할 주소를 설정해주자.

- components/common/SubInfo.js

```js
import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/pallete";
import { css } from "@emotion/react";

const SubInfoBlock = styled.div`
  ${props =>
    props.hasMarginTop &&
    css`
      margin-top: 1rem;
    `}
  color: ${palette.gray[6]};

  // span 사이에 가운데 점 문자 보여주기
  span + span:before {
    color: ${palette.gray[4]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7"; // 가운데 점 문자
  }
`;

const SubInfo = ({ username, publishedDate, hasMarginTop }) => {
  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <span>
        <b>
          <Link to={`/${username}`}>{username}</Link>
        </b>
      </span>
      <span>{new Date(publishedDate).toLocaleDateString()}</span>
    </SubInfoBlock>
  );
};

export default SubInfo;
```

- components/common/Tags.js

```js
import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const TagsBlock = styled.div`
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: ${palette.cyan[7]};
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: ${palette.cyan[6]};
    }
  }
`;

const Tags = ({ tags }) => {
  return (
    <TagsBlock>
      {tags.map(tag => (
        <Link className="tag" to={`/?tag=${tag}`} key={tag}>
          #{tag}
        </Link>
      ))}
    </TagsBlock>
  );
};

export default Tags;
```

- components/posts/PostList.js

```js
import React from "react";
import styled from "@emotion/styled";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import palette from "../../lib/styles/pallete";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";

const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
`;
const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
`;
const PostItemBlock = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  // 맨 위 포스트는 padding-top 없음
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[6]};
    }
  }
  p {
    margin-top: 2rem;
  }
`;

const PostItem = () => {
  return (
    <PostItemBlock>
      <h2>제목</h2>
      <SubInfo username="username" publishedDate={new Date()} />
      <Tags tags={["태그1", "태그2", "태그3"]} />
      <p>포스트 내용의 일부분...</p>
    </PostItemBlock>
  );
};

const PostList = () => {
  return (
    <PostListBlock>
      <WritePostButtonWrapper>
        <Button cyan to="/write">
          새 글 작성하기
        </Button>
      </WritePostButtonWrapper>
      <div>
        <PostItem />
        <PostItem />
        <PostItem />
      </div>
    </PostListBlock>
  );
};

export default PostList;
```

- pages/PostListPage.js

```js
import React from "react";
import styled from "@emotion/styled";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import palette from "../../lib/styles/pallete";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";

const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
`;
const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
`;
const PostItemBlock = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  // 맨 위 포스트는 padding-top 없음
  &:first-of-type {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[6]};
    }
  }
  p {
    margin-top: 2rem;
  }
`;

const PostItem = () => {
  return (
    <PostItemBlock>
      <h2>제목</h2>
      <SubInfo username="username" publishedDate={new Date()} />
      <Tags tags={["태그1", "태그2", "태그3"]} />
      <p>포스트 내용의 일부분...</p>
    </PostItemBlock>
  );
};

const PostList = () => {
  return (
    <PostListBlock>
      <WritePostButtonWrapper>
        <Button cyan to="/write">
          새 글 작성하기
        </Button>
      </WritePostButtonWrapper>
      <div>
        <PostItem />
        <PostItem />
        <PostItem />
      </div>
    </PostListBlock>
  );
};

export default PostList;
```

- components/post/PostViewer.js

```js
import React from "react";
import styled from "@emotion/styled";
import palete from "../../lib/styles/pallete";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
`;
const PostHead = styled.div`
  border-bottom: 1px solid ${palete.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${palete.gray[8]};
`;

const PostViewer = ({ post, error, loading }) => {
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
      <PostContent dangerouslySetInnerHTML={{ __html: body }} />
    </PostViewerBlock>
  );
};

export default PostViewer;
```

### 26.2.2 포스트 목록 조회 API 연동하기

- list API는 username, page, tag 값을 쿼리 값으로 넣어서 사용한다.
- API를 사용할 때 파라미터로 문자열들을 받아 와서 직접 조합해도 되지만
- axios.get 함수에 두 번째 파라미터에 params를 설정하면 쿼리 값 설정을 더 편하게 할 수 있다.

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
```

- listPosts API를 호출할 때 파라미터로 값을 넣어 주면 /api/posts?username=test&page=2 와 같이 주소를 만들어서 호출한다.
- 이제 위 요청의 상태를 관리하는 리덕스 모듈을 만들자
- modules/posts.js

```js
import { createAction, handleActions } from "redux-actions";
import { createRequestSaga, createRequestActionTypes } from "../lib/createRequestSaga";
import * as postsAPI from "../lib/api/posts";
import { takeLatest } from "redux-saga/effects";

// 액션 타입
const [LIST_POSTS, LIST_POSTS_SUCCESS, LIST_POSTS_FAILURE] =
  createRequestActionTypes("posts/LIST_POSTS");

// 액션 생성 함수
export const listPosts = createAction(LIST_POSTS, ({ tag, username, page }) => ({
  tag,
  username,
  page,
}));

// 사가 생성
const listPostsSaga = createRequestSaga(LIST_POSTS, postsAPI.listPosts);
export function* postsSaga() {
  yield takeLatest(LIST_POSTS, listPostsSaga);
}

// 초기값
const initState = {
  posts: null,
  error: null,
};

// 리듀서
const posts = handleActions(
  {
    [LIST_POSTS_SUCCESS]: (state, { payload: posts }) => ({
      ...state,
      posts,
    }),
    [LIST_POSTS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initState,
);

export default posts;
```

- 루트 리듀서와 루트 사가에 등록
- modules/index.js

```js
import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import auth, { authSaga } from "./auth";
import loading from "./loading";
import user, { userSaga } from "./user";
import write, { writeSaga } from "./write";
import post, { postSaga } from "./post";
import posts, { postsSaga } from "./posts";

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  write,
  post,
  posts,
});

export function* rootSaga() {
  yield all([authSaga(), userSaga(), writeSaga(), postSaga(), postsSaga()]);
}

export default rootReducer;
```

- 주소에 있는 쿼리 파라미터를 추출하여 우리가 만들었던 listPosts API를 호출
- containers/posts/PostListContainer.js

```js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPosts } from "../../modules/posts";
import { useParams, useSearchParams } from "react-router-dom";
import PostList from "../../components/post/PostList";

const PostListContainer = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { posts, error, loading, user } = useSelector(({ posts, loading, user }) => ({
    posts: posts.posts,
    error: posts.error,
    loading: loading["posts/LIST_POSTS"],
    user: user.user,
  }));
  useEffect(() => {
    const tag = searchParams.get("tag");
    // page가 없으면 1을 기본값으로 사용
    const page = parseInt(searchParams.get("page"), 10) || 1;
    dispatch(listPosts({ tag, username, page }));
  }, [dispatch, searchParams, username]);

  return <PostList loading={loading} error={error} posts={posts} showWriteButton={user} />;
};

export default PostListContainer;
```

- pages/PostListPage.js

```js
import React from "react";
import HeaderContainer from "../containers/common/HeaderContainer";
import PostListContainer from "../containers/posts/PostListContainer";

const PostListPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostListContainer />
    </>
  );
};

export default PostListPage;
```
