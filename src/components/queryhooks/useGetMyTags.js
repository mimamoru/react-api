import { useQuery } from "react-query";
import { getData } from "../modules/myapi";

//MyTag情報取得
export const useGetMyTags = () => useQuery("myTags", () => getData("myTags"));

export default useGetMyTags;
