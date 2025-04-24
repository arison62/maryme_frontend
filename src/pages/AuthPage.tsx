import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import logoImg from "../assets/logo.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { post } from "@/api/client";
import { Link } from "react-router";

const baseSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const signupSchema = baseSchema.extend({
  phone: z
    .string()
    .min(9, "Le numéro doit contenir au moins 10 caractères")
    .regex(/^[0-9]+$/, "Ne doit contenir que des chiffres"),
});

export default function AuthPage() {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof baseSchema | typeof signupSchema>>({
    resolver: zodResolver(isLogin ? baseSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof baseSchema>) {
    try {
      const endpoint = isLogin
        ? "user/auth/admin/login"
        : "user/auth/admin/create";

      const response = await post<{ token: string }>(endpoint, values);

      if (response.error) {
        toast({
          variant: "destructive",
          title: `Erreur de ${isLogin ? "connexion" : "création"}`,
          description: response.message || response.error,
        });
      } else {
        toast({
          title: `${isLogin ? "Connexion" : "Création"} réussie`,
          description: response.message,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAdmin", "true");
        navigate('/admin');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur réseau",
        description:
          "Une erreur est survenue lors de la communication avec le serveur",
      });
      console.error(
        `Erreur lors de la ${isLogin ? "connexion" : "création"} :`,
        error
      );
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className=" bg-green-500">
        <div className="flex h-[80px] max-container items-center">
          <div className="flex flex-row gap-1 text-green-950 items-baseline w-fit">
            <Link to="/">
              <img src={logoImg} alt="Logo image" className="w-8" />
            </Link>
            <span className="text-2xl font-bold block">Maryme</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLogin
                ? "Connexion administrateur"
                : "Création de compte admin"}
            </h1>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              {isLogin
                ? "Pas encore de compte ? Créer un compte"
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@exemple.com"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isLogin && (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0612345678"
                          {...field}
                          autoComplete="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        autoComplete={
                          isLogin ? "current-password" : "new-password"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? isLogin
                    ? "Connexion en cours..."
                    : "Création en cours..."
                  : isLogin
                  ? "Se connecter"
                  : "Créer le compte"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
