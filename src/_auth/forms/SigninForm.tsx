import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SigninValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (values: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(values);

    if (!session) {
      return toast({
        title: "Oh ne! Prijava nije uspjela.",
        description: "Nešto si sjebo! Pokušaj ponovo.",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Oh ne! Prijava nije uspjela.",
        description: "Nešto si sjebo! Pokušaj ponovo.",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="https://zoranborojevic.com/podravka/assets/images/szd_logo_white.png" alt="Studio za dizajn logo" width={64} />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-6">Prijava na račun.</h2>
        <p className="text-light-3 small-medium md:base-regular">Dobrodošli. Molim unesite svoje korisničko ime i password.</p>
        
        <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lozinka</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Učitavanje...
              </div>
            ) : (
              "Prijava"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Nemaš korisnički račun? 
            <Link to="/sign-up" className="text-light-1 text-small-medium ml-1">Registriraj se ovdje.</Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
