// call 은 비동기 함수(예: API 호출)를 호출하고 결과를 기다리는데 사용
// put 은 특정 액션을 디스패치할 때 사용
import { call, put } from "redux-saga/effects";
// 로딩 상태를 관리하는 액션 생성자 함수를 임포트
import { finishLoading, startLoading } from "../modules/loading";

export const createRequestActionTypes = type => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

// createRequestSaga라는 함수를 정의하고 내보냄
// 이 함수는 액션 타입 type과 요청을 처리할 함수 request를 매개변수로 받는다.
export const createRequestSaga = (type, request) => {
  // 요청이 성공했을 때 사용할 액션 타입을 정의
  const SUCCESS = `${type}_SUCCESS`;
  // 요청이 실패했을 때 사용할 액션 타입을 정의
  const FAILURE = `${type}_FAILURE`;

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
      });
      // 요청 처리 중 오류가 발생했을 경우의 처리
    } catch (error) {
      // 오류 정보와 함께 실패 액션을 디스패치한다.
      yield put({
        type: FAILURE,
        payload: error,
        error: true,
      });
    }
    // 요청 처리가 끝나면, 로딩 상태를 종료하는 액션을 디스패치한다.
    yield put(finishLoading(type)); // 로딩 끝
  };
};
