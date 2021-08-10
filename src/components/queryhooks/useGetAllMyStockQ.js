import { useQuery } from "react-query";
import { getData } from "../modules/myapi";

//全お気に入り情報取得(Qiita)
const useGetAllMyStockQ = () => useQuery("myStoskQ", () => getData("myStoskQ"));

export default useGetAllMyStockQ;
