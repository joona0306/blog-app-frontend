import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { createRequestActionTypes } from "../lib/createRequestSaga";

// 액션 타입
const CHANGE_FILED = "auth/CHANGE_FILED";
const INITIALIZE_FORM = "auth/INITIALIZE_FORM";

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes("auth/REGISTER");

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes("auth/LOGIN");

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
