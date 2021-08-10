import { useQueryClient, useMutation } from "react-query";
import { postData } from "../modules/myapi";

//MyTag情報登録
const usePostMyTags = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => postData("myTags", data), {
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries("myTags");
      const previousTodos = queryClient.getQueryData("myTags");
      queryClient.setQueryData("myTags", (old) => [...old, newTodo]);
      return { previousTodos };
    },

    onError: (err, newTodo, context) => {
      queryClient.setQueryData("myTags", context.previousTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries("myTags");
    },
  });
};
export default usePostMyTags;
