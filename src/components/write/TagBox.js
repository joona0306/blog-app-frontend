import React from "react";
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
const TagItem = React.memo(({ tag }) => <Tag>#{tag}</Tag>);

// React.memo를 사용하여 tags 값이 바뀔 때만 리렌더링 되도록 처리

const TagBox = () => {
  return <div>TagBox</div>;
};

export default TagBox;
