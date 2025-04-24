import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import logoImg from "../assets/logo.png";
import { post } from "@/api/client";


// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer un email valide.",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
});

const LoginPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    // Simuler une requête API
    try {
      const response = await post<{ token: string }>("/officier/login", data);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: response.message || response.error,
        });
        return;
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
      }
      // Stocker le token dans le localStorage
      localStorage.setItem("token", response.data.token);
      navigate("/officier/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Identifiants invalides. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* En-tête de la page */}
      <div className=" bg-green-500">
        <div className="flex h-[80px] max-w-7xl mx-auto items-center">
          <div className="flex flex-row gap-1 text-green-950 items-baseline w-fit">
            <Link to="/">
              <img src={logoImg} alt="Logo image" className="w-8" />
            </Link>
            <span className="text-2xl font-bold block">Maryme</span>
          </div>
        </div>
      </div>

      {/* Contenu principal de la page de connexion */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-center">
              Connexion Officier d'État Civil
            </CardTitle>
            <CardDescription className="text-center">
              Connectez-vous à votre compte pour accéder à la plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez votre email"
                          {...field}
                          type="email"
                          className={cn(
                            isSubmitting && "opacity-70 cursor-not-allowed"
                          )}
                          disabled={isSubmitting}
                        />
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
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez votre mot de passe"
                          {...field}
                          type="password"
                          className={cn(
                            isSubmitting && "opacity-70 cursor-not-allowed"
                          )}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;
