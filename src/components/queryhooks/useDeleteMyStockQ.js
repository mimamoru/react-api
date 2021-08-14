import { useQueryClient, useMutation } from "react-query";
import { deleteData } from "../modules/myapi";

//お気に入り情報削除(Qiita)
const useDeleteMyStockQ = () => {
  const queryClient = useQueryClient();

  return useMutation((idx) => deleteData("myStoskQ", idx), {
    onMutate: async (delData) => {
      await queryClient.cancelQueries("myStoskQ");
      const previousTodos = queryClient.getQueryData("myStoskQ");
      queryClient.setQueryData("myStoskQ", (old) =>
        old?.filter((e) => e.id !== delData.id)
      );
      return { previousTodos };
    },

    onError: (err, delData, context) => {
      queryClient.setQueryData("myStoskQ", context.previousTodos);
    },

    onSuccess: () => {
      queryClient.invalidateQueries("myStoskQ");
    },
  });
};
export default useDeleteMyStockQ;
