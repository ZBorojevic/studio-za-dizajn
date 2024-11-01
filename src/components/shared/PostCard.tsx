import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return null;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "https://zoranborojevic.com/podravka/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-white">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-2">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}>
          <img src="https://zoranborojevic.com/podravka/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
        </div>
        <img
          src={post.imageUrl || "https://zoranborojevic.com/podravka/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <div className="small-medium lg:base-medium py-5">
        <ul className="flex gap-1">
          {post.tags.map((tag: string, index: string) => (
            <li key={`${tag}${index}`} className="text-light-2">
              #{tag}
            </li>
          ))}
        </ul>
      </div>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
