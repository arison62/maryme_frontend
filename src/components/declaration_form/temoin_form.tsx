import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeclarationTemoinContext } from "./declaration_provider";
import { FormEvent, useContext } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import clsx from "clsx";
import { TapContext } from "@/pages/DeclarationPage";

const formSchema = z.object({
  nomTemoin1: z.string().nonempty(),
  prenomTemoin1: z.string().optional(),
 
  telephoneTemoin1: z.string().nonempty().min(6).max(12),
  nomTemoin2: z.string().nonempty(),
  prenomTemoin2: z.string().optional(),
 
  telephoneTemoin2: z.string().nonempty().min(6).max(12),
});

function TemoinForm({
  index,
  className,
}: {
  index: number;
  className: string;
}) {
  const { temoins, setTemoins } = useContext(DeclarationTemoinContext);

  const { setActiveTap } = useContext(TapContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomTemoin1: temoins[0].nom,
      prenomTemoin1: temoins[0].prenom,
     
      telephoneTemoin1: temoins[0].telephone,
      nomTemoin2: temoins[1].nom,
      prenomTemoin2: temoins[1].prenom,
    
      telephoneTemoin2: temoins[1].telephone,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setActiveTap(index + 1);
  }

  function onChange(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const nomTemoin1 = formData.get("nomTemoin1") as string;
    const prenomTemoin1 = formData.get("prenomTemoin1") as string;
   
    const telephoneTemoin1 = formData.get("telephoneTemoin1") as string;
    const nomTemoin2 = formData.get("nomTemoin2") as string;
    const prenomTemoin2 = formData.get("prenomTemoin2") as string;
   
    const telephoneTemoin2 = formData.get("telephoneTemoin2") as string;
    setTemoins([
      {
        nom: nomTemoin1,
        prenom: prenomTemoin1,
      
        telephone: telephoneTemoin1,
      },
      {
        nom: nomTemoin2,
        prenom: prenomTemoin2,
      
        telephone: telephoneTemoin2,
      },
    ]);
  }

  return (
    <div className={clsx("w-full", className)}>
      <Form {...form}>
        <form
          className="flex gap-8 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={onChange}
        >
          <div>
            <h2 className="text-xl font-bold text-green-800 mb-4">
              Informations sur le temoin de l'epoux
            </h2>
            <div className="flex flex-col md:flex-row md:gap-4">
              <FormField
                control={form.control}
                name="nomTemoin1"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le nom du temoin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="prenomTemoin1"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Prenom </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le prenom du temoin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="telephoneTemoin1"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Numero de telephone </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+237 650 01 88 59" />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le numero de telephone
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800 mb-4">
              Informations sur le temoin l'epouse
            </h2>
            <div className="flex flex-col md:flex-row md:gap-4">
              <FormField
                control={form.control}
                name="nomTemoin2"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le nom du temoin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="prenomTemoin2"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Prenom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le prenom du temoin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="telephoneTemoin2"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Numero de telephone </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+237 650 01 88 59" />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le numero de telephone
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>
          <div className="flex justify-between max-w-4xl">
            <Button variant={"outline"} onClick={() => setActiveTap(index - 1)}>
              Precedent
            </Button>
            <Button type="submit">Suivant</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default TemoinForm;
