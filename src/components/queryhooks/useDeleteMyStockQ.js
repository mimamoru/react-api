import { useQueryClient, useMutation } from "react-query";
import { deleteData } from "../modules/myapi";

//お気に入り情報削除(Qiita)
const useDeleteMyStockQ = () => {
  const queryClient = useQueryClient();

  return useMutation((idx) => deleteData("myStoskQ", idx), {
    onSuccess: () => {
      queryClient.invalidateQueries("myStoskQ");
    },
  });
};
export default useDeleteMyStockQ;
