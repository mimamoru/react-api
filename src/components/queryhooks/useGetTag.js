import { useQuery } from "react-query";
import { getTagData } from "../modules/myapi";

//タグ情報取得(teratail API)
const useGetTag = (tagName) =>
  useQuery(["Tag", tagName], () => getTagData(tagName));
export default useGetTag;
