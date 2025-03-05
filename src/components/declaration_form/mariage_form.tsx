import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeclarationCelebrantContext, DeclarationMariageContext} from "./declaration_provider";
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
  nomCelebrant: z.string().nonempty(),
  prenomCelebrant: z.string().optional(),
  date_naissanceCelebrant: z.string().min(8).max(10),
  telephoneCelebrant: z.string().nonempty().min(6).max(12),
  date_mariage: z.string().min(8).max(10),
  id_commune: z.number()
});

function MariageForm({
        index,
        className
}:{index: number, className: string}) {
  const {celebrant, setCelebrant} = useContext(DeclarationCelebrantContext);
  const {mariage, setMariage} = useContext(DeclarationMariageContext);


  const {setActiveTap} = useContext(TapContext)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomCelebrant: celebrant.nom,
      prenomCelebrant: celebrant.prenom,
      date_naissanceCelebrant: celebrant.date_naissance,
      telephoneCelebrant: celebrant.telephone,
      date_mariage: mariage.date_mariage,
      id_commune: mariage.id_commune
    },
      
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setActiveTap( index + 1)
  }

  function onChange(event : FormEvent<HTMLFormElement>){
    const formData = new FormData(event.currentTarget);
    const nomCelebrant = formData.get("nomCelebrant") as string;
    const prenomCelebrant = formData.get("prenomCelebrant") as string;
    const telephoneCelebrant = formData.get("telephoneCelebrant") as string;
    const date_mariage = formData.get("date_mariage") as string;
    setCelebrant({
      nom: nomCelebrant,
      prenom: prenomCelebrant,
      telephone: telephoneCelebrant,
      date_naissance: ""
    });
    setMariage({
      date_mariage: date_mariage,
      lieu_mariage: "",
      id_commune: 0
    });
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
              Informations sur le mariage
            </h2>
            <div className="flex flex-col md:flex-row md:gap-4">
              <FormField
                control={form.control}
                name="date_mariage"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Date mariage</FormLabel>
                    <FormControl>
                      <Input {...field} type="date"/>
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer la date du mariage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="nomCelebrant"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Nom du celebrant</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrer le nom du celebrant
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="prenomCelebrant"
                render={({ field }) => (
                  <FormItem className="w-full max-w-md pb-4">
                    <FormLabel>Prenom celebrant</FormLabel>
                    <FormControl>
                      <Input {...field}  />
                    </FormControl>
                    <FormDescription>
                      Veuillez entrez le prenom du celebrant
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="telephoneCelebrant"
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
          {/* <div>
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
          </div> */}
          <div className="flex justify-between max-w-4xl">
            <Button 
              variant={"outline"}
              onClick={()=>{
                setActiveTap(index-1)
              }}
            >Precedent</Button>
            <Button 
              type="submit"
              onClick={()=>{
                setActiveTap(index+1)
              }}
              >Suivant</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default MariageForm;
