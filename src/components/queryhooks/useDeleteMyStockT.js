import { useQueryClient, useMutation } from "react-query";
import { deleteData } from "../modules/myapi";

//お気に入り情報削除(teratail)
const useDeleteMyStockT = () => {
  const queryClient = useQueryClient();

  return useMutation((idx) => deleteData("myStoskT", idx), {
    onMutate: async (delData) => {
      await queryClient.cancelQueries("myStoskT");
      const previousTodos = queryClient.getQueryData("myStoskT");
      queryClient.setQueryData("myStoskT", (old) =>
        old?.filter((e) => e.id !== delData.id)
      );
      return { previousTodos };
    },

    onError: (err, delData, context) => {
      queryClient.setQueryData("myStoskT", context.previousTodos);
    },

    onSuccess: () => {
      queryClient.invalidateQueries("myStoskT");
    },
  });
};
export default useDeleteMyStockT;
