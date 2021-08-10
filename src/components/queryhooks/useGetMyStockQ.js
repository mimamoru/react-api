import { useQuery } from "react-query";
import { getPageData } from "../modules/myapi";

//指定ページのお気に入り情報取得(Qiita)
const useGetMyStockQ = (page) =>
  useQuery(["myStoskQ", page], () => getPageData("myStoskQ", page), {
    keepPreviousData: true,
  });

export default useGetMyStockQ;
