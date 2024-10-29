import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignup = async (values: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(values);
      if (!newUser) {
        return toast({
          title: "Oh ne! Registracija nije uspjela.",
          description: "Nešto si sjebo! Pokušaj ponovo.",
        });
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

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
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="https://zoranborojevic.com/podravka/assets/images/szd_logo_white.png" alt="Studio za dizajn logo" width={64} />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-6">Napravi novi račun.</h2>
        <p className="text-light-3 small-medium md:base-regular">Molim unesite svoje nove korisničke podatke.</p>
        
        <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ime i prezime</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Korisničko ime</FormLabel>
                <FormControl>
                  <Input type="username" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Učitavanje...
              </div>
            ) : (
              "Registracija"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Već imaš korisnički račun? 
            <Link to="/sign-in" className="text-light-1 text-small-medium ml-1">Prijavi se.</Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
