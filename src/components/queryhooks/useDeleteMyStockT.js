import { useQueryClient, useMutation } from "react-query";
import { deleteData } from "../modules/myapi";

//お気に入り情報削除(teratail)
const useDeleteMyStockT = () => {
  const queryClient = useQueryClient();

  return useMutation((idx) => deleteData("myStoskT", idx), {
    onSuccess: () => {
      queryClient.invalidateQueries("myStoskT");
    },
  });
};
export default useDeleteMyStockT;
