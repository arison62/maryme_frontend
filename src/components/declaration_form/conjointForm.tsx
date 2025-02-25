import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeclarationConjointContext, Epouse, Epoux } from "./declaration_context";
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
  nomEpoux: z.string().nonempty(),
  prenomEpoux: z.string().optional(),
  date_naissanceEpoux: z.string().min(8).max(10),
  telephoneEpoux: z.string().nonempty().min(6).max(12),
  nomEpouse: z.string().nonempty(),
  prenomEpouse: z.string().optional(),
  date_naissanceEpouse: z.string().min(8).max(10),
  telephoneEpouse: z.string().nonempty().min(6).max(12),
});

function ConjointForm({
        index,
        className
}:{index: number, className: string}) {
  const { epouse, epoux, setEpouse, setEpoux } = useContext(
    DeclarationConjointContext
  );

  const {setActiveTap} = useContext(TapContext)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomEpoux: epoux.nomEpoux,
      prenomEpoux: epoux.prenomEpoux,
      date_naissanceEpoux: epoux.date_naissanceEpoux,
      telephoneEpoux: epoux.telephoneEpoux,
      nomEpouse: epouse.nomEpouse,
      prenomEpouse: epouse.prenomEpouse,
      date_naissanceEpouse: epouse.date_naissanceEpouse,
      telephoneEpouse: epouse.telephoneEpouse,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setActiveTap( index + 1)
  }

  function onChange(event : FormEvent<HTMLFormElement>){
    const formData = new FormData(event.currentTarget);
    const epoux : Epoux = {
        nomEpoux: formData.get('nomEpoux')?.toString() || "",
        prenomEpoux: formData.get('prenomEpoux')?.toString() || "",
        date_naissanceEpoux:  formData.get("date_naissanceEpoux")?.toString() || "",
        telephoneEpoux: formData.get("telephoneEpoux")?.toString() || ""
    }

    const epouse : Epouse = {
        nomEpouse: formData.get('nomEpouse')?.toString() || "",
        prenomEpouse: formData.get('prenomEpouse')?.toString() || "",
        date_naissanceEpouse:  formData.get("date_naissanceEpouse")?.toString() || "",
        telephoneEpouse: formData.get("telephoneEpoux")?.toString() || ""
    }

    setEpouse(epouse)
    setEpoux(epoux)
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
              Informations sur l'epoux
            </h2>
            <div className="flex flex-col md:flex-row md:gap-4">
              <FormField
                control={form.control}
                name="nomEpoux"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Nom de l'époux</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le nom de l'époux
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="prenomEpoux"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Prenom de l'époux</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le prenom de l'époux
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="date_naissanceEpoux"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Date naissance Epoux</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer la date de naissance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="telephoneEpoux"
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
              Informations sur l'epouse
            </h2>
            <div className="flex flex-col md:flex-row md:gap-4">
              <FormField
                control={form.control}
                name="nomEpouse"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Nom de l'épouse</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le nom de l'épouse
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="prenomEpouse"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Prenom de l'épouse</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le prenom de l'épouse
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="date_naissanceEpouse"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Date naissance Epouse</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer la date de naissance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="telephoneEpouse"
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
          <div className="flex justify-end">
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ConjointForm;
