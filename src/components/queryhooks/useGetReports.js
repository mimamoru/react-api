import { useQueries } from "react-query";
import { getReportsByTag } from "../modules/myapi";

//指定タグのついた記事を取得(Qiita API)
const useGetReports = (myTags = [], page = 1) =>
  useQueries(
    myTags?.map((myTag) => {
      return {
        queryKey: [`${myTag.id}Q`, page],
        queryFn: () => getReportsByTag(myTag.id, page),
        keepPreviousData: true,
      };
    }) ?? []
  );

export default useGetReports;
