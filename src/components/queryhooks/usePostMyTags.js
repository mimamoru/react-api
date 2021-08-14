import { useQueryClient, useMutation } from "react-query";
import { postData } from "../modules/myapi";

//MyTag情報登録
const usePostMyTags = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => postData("myTags", data), {
    onMutate: async (newData) => {
      await queryClient.cancelQueries("myTags");
      const previousTodos = queryClient.getQueryData("myTags");
      queryClient.setQueryData("myTags", (old) => [...old, newData]);
      return { previousTodos };
    },

    onError: (err, newData, context) => {
      queryClient.setQueryData("myTags", context.previousTodos);
    },

    onSuccess: () => {
      queryClient.invalidateQueries("myTags");
    },
  });
};
export default usePostMyTags;
