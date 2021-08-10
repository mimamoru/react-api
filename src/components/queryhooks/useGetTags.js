import { useQuery } from "react-query";
import { getTagsData } from "../modules/myapi";

//全タグ情報取得(teratail API)
const useGetTags = (page) =>
  useQuery(["Tags", page], () => getTagsData(page), {
    keepPreviousData: true,
  });
export default useGetTags;
