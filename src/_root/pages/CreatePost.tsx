import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
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
          <h2 className="h3-bold md:h2-bold text-left w-full">Kreiraj objavu</h2>
        </div>

        <PostForm action="Kreiraj" />
      </div>
    </div>
  );
};

export default CreatePost;
