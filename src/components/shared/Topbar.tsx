import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="https://zoranborojevic.com/podravka/assets/images/szd_logo_white.png"
            alt="Studio za dizajn logo"
            width={50} 
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button"
            onClick={() => signOut()}>
            <img src="https://zoranborojevic.com/podravka/assets/icons/logout.svg" alt="logout" width={18} />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "https://zoranborojevic.com/podravka/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
