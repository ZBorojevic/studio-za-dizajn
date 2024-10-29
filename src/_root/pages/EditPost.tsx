import { useParams } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queries";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id || "");

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="https://zoranborojevic.com/podravka/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Uredi objavu</h2>
        </div>

        <PostForm action="Ažuriraj" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
