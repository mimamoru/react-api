import { useQueryClient, useMutation } from "react-query";
import { deleteData } from "../modules/myapi";

//MyTag情報削除
const useDeleteMyStock = () => {
  const queryClient = useQueryClient();

  return useMutation((idx) => deleteData("myTags", idx), {
    onMutate: async (delData) => {
      await queryClient.cancelQueries("myTags");
      const previousTodos = queryClient.getQueryData("myTags");
      queryClient.setQueryData("myTags", (old) =>
        old?.filter((e) => e.id !== delData.id)
      );
      return { previousTodos };
    },

    onError: (err, delData, context) => {
      queryClient.setQueryData("myTags", context.previousTodos);
    },

    onSuccess: () => {
      queryClient.invalidateQueries("myTags");
    },
  });
};

export default useDeleteMyStock;
