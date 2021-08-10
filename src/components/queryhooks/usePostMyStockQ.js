import { useQueryClient, useMutation } from "react-query";
import { postData } from "../modules/myapi";

//お気に入り情報登録(Qiita)
const usePostMyStockQ = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => postData("myStoskQ", data), {
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries("myStoskQ");
      const previousTodos = queryClient.getQueryData("myStoskQ");
      queryClient.setQueryData("myStoskQ", (old) => [...old, newTodo]);
      return { previousTodos };
    },

    onError: (err, newTodo, context) => {
      queryClient.setQueryData("myStoskQ", context.previousTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries("myStoskQ");
    },
  });
};
export default usePostMyStockQ;
