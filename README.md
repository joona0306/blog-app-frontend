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

### 26.2.3 HTML 필터링 하기

- sanitize-html 라이브러리를 사용해서 HTML을 필터링 해보자
- HTML을 작성하고 보여 주어야 하는 서비스에서 유용하다.
- 단순히 HTML을 제거하는 기능뿐만 아니라 특정 HTML만 허용하는 기능도 있기 때문에
- 글쓰기 API에서 사용하면 손쉽게 악성 스크립트 삽입을 막을 수 있다.
- blog-backend 디렉토리에서 작업
- `yarn add sanitize-html`
- src/api/posts/posts.ctrl.js

```js
const Post = require("../../models/post");
const mongoose = require("mongoose");
const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: ["h1", "h2", "b", "i", "u", "s", "p", "ul", "ol", "li", "blockquote", "a", "img"],
  allowedAttributes: {
    a: ["href", "name", "target"],
    img: ["src"],
    li: ["class"],
  },
  allowedSchemes: ["data", "http"],
};

exports.getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  // MongoDB에서 조회한 데이터의 id 값을 문자열과 비교할 때는
  // 반드시 .toString()을 해주어야 한다.
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

/* 포스트 작성
POST /api/posts
{title, body}
*/
exports.write = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  // 포스트의 인스턴스를 만들 때는 new 키워드를 사용
  // 그리고 생성자 함수의 파라미터에 정보를 지닌 객체럴 넣음
  const post = new Post({
    title,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    user: ctx.state.user,
  });
  try {
    // save()함수를 실행시켜야 데이터베이스에 저장
    // 이 함수의 반환 값은 Promise이므로 async/await 문법으로
    // 데이터베이스 저장 요청을 완료할 때까지 await를 사용하여 대기
    // await를 사용할 때는 try/catch 문으로 오류를 처리
    await post.save();
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};

const removeHtmlAndShorten = body => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

/* 포스트 목록 조회
GET /api/posts?username=&tag=&page=
*/
exports.list = async ctx => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { "user.username": username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    // find()함수를 호출한 후에는 exec()를 붙여 주어야 서버에 쿼리를 요청한다.
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();

    const postCount = await Post.countDocuments(query).exec();

    ctx.set("Last-Page", Math.ceil(postCount / 10));

    ctx.body = posts.map(post => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
  } catch (error) {
    ctx.throw(500, error);
  }
};

/* 특정 포스트 조회
GET /api/posts/:id
*/
exports.read = ctx => {
  ctx.body = ctx.state.post;
};

/* 특정 포스트 제거
DELETE /api/posts/:id
*/
exports.remove = async ctx => {
  const { id } = ctx.params;
  // 해당 id를 가진 post가 몇 번째인지 확인한다.
  try {
    await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (error) {
    ctx.throw(500, error);
  }
};

/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{
  title: "수정",
  body: "수정 내용",
  tags: ["수정", "태그"]
} 
*/
exports.update = async ctx => {
  // PATCH 메서드는 주어진 필드만 교체한다.
  const { id } = ctx.params;

  // write에서 사용한 schema와 비슷하지만 required()가 없습니다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const nextData = { ...ctx.request.body }; // 객체를 복사하고
  // body 값이 주어졌으면 HTML 필터링
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
  }

  try {
    const post = await Post.findByIdAndUpdate(id, nextData, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환한다.
      // false 일 때는 업데이트되기 전의 데이터를 반환한다.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (error) {
    ctx.throw(500, error);
  }
};
```

### 26.2.4 페이지네이션 구현하기

- backend 디렉토리/ list API를 만들 때 마지막 페이지 번호를 HTTP 헤더를 통해 클라이언트에 전달하도록 설정했다.
- createRequestSaga에서 SUCCESS 액션을 발생시킬 때 payload에 response.data 값만 넣어 주기 때문에
- 현재 구조로는 헤더를 확인할 수 없다.
- createRequestSaga를 수정해주자.
- lib/createRequestSaga.js

```js
// ...
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
        meta: response,
      });
// ...
```

- 이렇게 액션 안에 meta 값을 response로 넣어 주면 나중에 HTTP 헤더 및 상태 코드를 쉽게 조회할 수 있다.

- posts 리덕스 모듈 수정
- modules/posts.js

```js
// 초기값
const initState = {
  posts: null,
  error: null,
  lastPage: 1,
};

// 리듀서
const posts = handleActions(
  {
    [LIST_POSTS_SUCCESS]: (state, { payload: posts, meta: response }) => ({
      ...state,
      posts,
      lastPage: parseInt(response.headers["last-page"], 10), // 문자열을 숫자로 변환
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

- 이제 리덕스 스토어 안에 마지막 페이지 번호를 lastPage라는 값으로 담아 둘 수 있다.
- 페이지네이션을 위한 컴포넌트 Pagination 컴포넌트를 만들자.
- URL 쿼리 문자열을 파싱하고, 문자열화하는데 사용되는 라이브러리
- `yarn add qs`
- components/post/Pagination.js

```js
import React from "react";
import styled from "@emotion/styled";
import qs from "qs";
import Button from "../common/Button";

const PaginationBlock = styled.div`
  width: 320px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
`;

const PageNumber = styled.div``;

const buildLink = ({ username, tag, page }) => {
  const query = qs.stringify({ tag, page });
  return username ? `/${username}?${query}` : `/?${query}`;
};

const Pagination = ({ page, lastPage, username, tag }) => {
  return (
    <PaginationBlock>
      <Button
        disabled={page === 1}
        to={page === 1 ? undefined : buildLink({ username, tag, page: page - 1 })}
      >
        이전
      </Button>
      <PageNumber>{page}</PageNumber>
      <Button
        disabled={page === lastPage}
        to={page === lastPage ? undefined : buildLink({ username, tag, page: page + 1 })}
      >
        다음
      </Button>
    </PaginationBlock>
  );
};

export default Pagination;
```

- Button 컴포넌트에 비활성회된 스타일을 설정 :disabled CSS 셀렉터 사용
- components/common/Button.js

```js
const buttonStyle = css`
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

  &:disabled {
    background: ${palette.gray[3]};
    color: ${palette.gray[5]};
    cursor: not-allowed;
  }
`;
```

- PaginationContainer
- containers/posts/PaginationContainer.js

```js
import React from "react";
import Pagination from "../../components/post/Pagination";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

const PaginationContainer = () => {
  const [searchParams] = useSearchParams();

  const { username } = useParams();
  const tag = searchParams.get("tag");
  // page가 없으면 1을 기본값으로 사용
  const page = parseInt(searchParams.get("page"), 10 || 1);

  const { lastPage, posts, loading } = useSelector(({ posts, loading }) => ({
    lastPage: posts.lastPage,
    posts: posts.posts,
    loading: loading["posts/LIST_POSTS"],
  }));

  // 포스트 뎅터가 없거나 로딩 중이면 아무것도 보여주지 않음
  if (!posts || loading) return null;

  return <Pagination tag={tag} username={username} page={parseInt(page, 10)} lastPage={lastPage} />;
};

export default PaginationContainer;
```

- pages/PostListPage.js

```js
import React from "react";
import HeaderContainer from "../containers/common/HeaderContainer";
import PostListContainer from "../containers/posts/PostListContainer";
import PaginationContainer from "../containers/posts/PaginationContainer";

const PostListPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostListContainer />
      <PaginationContainer />
    </>
  );
};

export default PostListPage;
```
