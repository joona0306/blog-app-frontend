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
