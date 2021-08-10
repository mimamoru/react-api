import { useQueryClient, useMutation } from "react-query";
import { deleteData } from "../modules/myapi";

//MyTag情報削除
const useDeleteMyStock = () => {
  const queryClient = useQueryClient();

  return useMutation((idx) => deleteData("myTags", idx), {
    onSuccess: () => {
      queryClient.invalidateQueries("myTags");
    },
  });
};

export default useDeleteMyStock;
