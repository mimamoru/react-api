import { useQuery } from "react-query";
import { getData } from "../modules/myapi";

//全お気に入り情報取得(teratail)
const useGetAllMyStockT = () => useQuery("myStoskT", () => getData("myStoskT"));

export default useGetAllMyStockT;
