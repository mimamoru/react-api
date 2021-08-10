import { useQuery } from "react-query";
import { getQuestionById } from "../modules/myapi";

//指定idの質問詳細と回答を取得(teratail API)
const useGetQuestion = (questionId) =>
  useQuery(["Question", questionId], () => getQuestionById(questionId));

export default useGetQuestion;
