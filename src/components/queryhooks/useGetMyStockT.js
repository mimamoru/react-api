import { useQuery } from "react-query";
import { getPageData } from "../modules/myapi";

//指定ページのお気に入り情報取得(teratail)
const useGetMyStockT = (page) =>
  useQuery(["myStoskT", page], () => getPageData("myStoskT", page), {
    keepPreviousData: true,
  });

export default useGetMyStockT;
