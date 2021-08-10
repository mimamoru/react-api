import { useQuery } from "react-query";
import { getReportById } from "../modules/myapi";

//指定idの記事を取得(Qiita API)
const useGetReport = (itemId) =>
  useQuery(["Report", itemId], () => getReportById(itemId));

export default useGetReport;
