import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, {message: "Ime nije dovoljno dugo."}),
    username: z.string().min(2, {message: "Korisničko ime nije dovoljno dugo."}),
    email: z.string()
    .email({ message: "Neispravna email adresa." })
    .refine((val) => val.endsWith("@podravka.hr"), {
        message: "Email adresa ima krivu domenu. (hint: ♥️)"
    }),
    password:z.string().min(8, {message: "Lozinka mora imati barem 8 znakova."})
    })

export const SigninValidation = z.object({
    email: z.string().email({ message: "Neispravna email adresa." }),
    password:z.string()
})

export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Ime mora imati najmanje 2 znaka." }),
    username: z.string().min(2, { message: "Ime mora imati najmanje 2 znaka." }),
    email: z.string().email(),
    bio: z.string(),
  });
  
  export const PostValidation = z.object({
    caption: z.string().min(5, { message: "Minimalno 5 znakova." }).max(2200, { message: "Maksimalno 2.200 znakova." }),
    file: z.custom<File[]>(),
    location: z.string().min(1, { message: "Ovo polje je obavezno." }).max(1000, { message: "Maksimalno 1000 znakova." }),
    tags: z.string(),
  });