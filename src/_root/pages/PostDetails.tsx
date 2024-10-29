import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queries";
import { formatPostTimestamp } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useGetPostById(id || ""); // Zamijenjeno 'isPending' sa 'isLoading'
  const { user } = useUserContext();

  const handleDeletePost = () => {
    // Logika za brisanje posta
  };

  return (
    <div className="post_details-container">
      {/* Dugme Natrag */}
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img src={"https://zoranborojevic.com/podravka/assets/icons/back.svg"} alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Natrag</p>
        </Button>
      </div>

      {isLoading ? ( // Provjera za 'isLoading'
        <Loader />
      ) : post ? ( // Provjera da li 'post' postoji
        <div className="post_details-card">
          <img src={post.imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post.creator?.$id}`} className="flex items-center gap-3">
                <img
                  src={post.creator?.imageUrl || 'https://zoranborojevic.com/podravka/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-white">{post.creator?.name}</p>
                  <div className="flex-center gap-2 text-light-2">
                    <p className="subtle-semibold lg:small-regular">
                      {formatPostTimestamp(post.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center">
                <Link
                  to={`/update-post/${post.$id}`}
                  className={`${user.id !== post.creator?.$id && 'hidden'}`}
                >
                  <img src="https://zoranborojevic.com/podravka/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user.id !== post.creator?.$id && 'hidden'}`}
                >
                  <img src="https://zoranborojevic.com/podravka/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/0" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p className="mb-1">{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags?.map((tag: string) => (
                  <li key={tag} className="text-light-2">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      ) : (
        <p>Post nije pronađen.</p>
      )}
    </div>
  );
};

export default PostDetails;
