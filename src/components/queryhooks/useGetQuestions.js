import { useQueries } from "react-query";
import { getQuestionsByTag } from "../modules/myapi";

//指定タグのついた質問を取得(teratail API)
const useGetQuestions = (myTags = [], page = 1) =>
  useQueries(
    myTags?.map((myTag) => {
      return {
        queryKey: [`${myTag.id}T`, page],
        //  ueryKey: ["Questions"],
        queryFn: () => getQuestionsByTag(myTag.id, page),
        keepPreviousData: true,
      };
    }) ?? []
  );

export default useGetQuestions;
