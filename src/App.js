import { Route, Routes } from "react-router-dom";
import PostListPage from "./pages/PostListPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import WritePage from "./pages/WritePage";
import PostPage from "./pages/PostPage";

function App() {
  return (
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
  );
}

export default App;
