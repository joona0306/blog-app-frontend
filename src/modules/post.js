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
