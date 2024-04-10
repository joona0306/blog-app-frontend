import { createAction, handleActions } from "redux-actions";

// 액션 타입
const SAMPLE_ACTION = "auth/SAMPLE_ACTION";

// 액션 생성 함수
export const sampleAction = createAction(SAMPLE_ACTION);

// 초기값
const initState = {};

// 리듀서
const auth = handleActions(
  {
    [SAMPLE_ACTION]: (state, action) => state,
  },
  initState,
);

export default auth;
