import { useQueryClient, useMutation } from "react-query";
import { postData } from "../modules/myapi";

//お気に入り情報登録(teratail)
const usePostMyStockT = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => postData("myStoskT", data), {
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries("myStoskT");
      const previousTodos = queryClient.getQueryData("myStoskT");
      queryClient.setQueryData("myStoskT", (old) => [...old, newTodo]);
      return { previousTodos };
    },

    onError: (err, newTodo, context) => {
      queryClient.setQueryData("myStoskT", context.previousTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries("myStoskT");
    },
  });
};
export default usePostMyStockT;
