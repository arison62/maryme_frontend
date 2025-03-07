import { z } from "zod";
import { useForm } from "react-hook-form";
import { get } from "@/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeclarationMariageContext } from "./declaration_provider";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import clsx from "clsx";
import { TapContext } from "@/pages/DeclarationPage";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import MarriageCard from "../mariage_card";

type DataCommune = {
  id_commune: number;
  id_departement: number;
  nom: string;
};

type DataDepartement = {
  id_departement: number;
  id_region: number;
  nom: string;
  Communes: DataCommune[];
};

type DataRegion = {
  id_region: number;
  nom: string;
  Departements: DataDepartement[];
};

const formSchema = z.object({
  id_region: z.string(),
  id_departement: z.string(),
  id_commune: z.string(),
});

function Confirmation({
  index,
  className,
}: {
  index: number;
  className: string;
}) {
  const { mariage, setMariage } = useContext(DeclarationMariageContext);
  const { setActiveTap } = useContext(TapContext);
  const [regions, setRegions] = useState<DataRegion[]>([]);
  const [departements, setDepartements] = useState<DataDepartement[]>([]);
  const [communes, setCommunes] = useState<DataCommune[]>([]);
  const [isProgress, setIsProgess] = useState(false);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setIsProgess(true);
    async function getData() {
      const data = await get<DataRegion[]>("regions");

      if (
        (typeof data.error == "boolean" && data.error == false) ||
        data.error == undefined
      ) {
        console.log(data);
        setRegions(data.data);
        setIsProgess(false);
      } else {
        console.log(data.message);
      }
    }
    getData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_region: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setMariage({
      ...mariage,
      id_commune: parseInt(values.id_commune),
    });
  }
  console.log(communes)
  function onChange(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const id_region = formData.get("id_region") as string;
    const id_departement = formData.get("id_departement") as string;
   
    const departement = regions.find((region) => region.id_region == parseInt(id_region))?.Departements;
    console.log(departement)
    const communes = departement?.find((departement) => departement.id_departement == parseInt(id_departement))?.Communes;
    setDepartements(departement ?? []);
    setCommunes(communes ?? []);
  }

  return (
    <div className={clsx("w-full mb-4", className)}>
      <Form {...form}>
        <form
            ref={ref}
          className="flex gap-8 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={onChange}
        >
          <div>
            <h2 className="text-xl font-bold text-green-800 mb-4">
              Choisissez la region
            </h2>
            <div className="flex flex-col md:gap-4">
              <FormField
                control={form.control}
                name="id_region"
                render={({ field }) => (
                  <FormItem className="w-full max-w-sm pb-4 flex flex-col">
                    <FormLabel>Region</FormLabel>
                    <Select onValueChange={field.onChange} name={field.name}>
                      <FormControl>
                        <SelectTrigger className="w-[280px] border border-gray-300 rounded-md">
                          <SelectValue placeholder="Choisissez votre region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        
                        {!isProgress && regions.map((region) => (
                          <SelectItem
                            value={region.id_region.toString()}
                            key={region.id_region}
                          >
                            {region.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
             <FormField
                control={form.control}
                name="id_departement"
                render={({ field }) => (
                  <FormItem className="w-full max-w-sm pb-4 flex flex-col">
                    <FormLabel>Departement</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger className="w-[280px] border border-gray-300 rounded-md">
                          <SelectValue placeholder="Choisissez votre departement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!isProgress && departements.map((departement) => (
                          <SelectItem
                            value={departement.id_departement.toString()}
                            key={departement.id_departement}
                          >
                            {departement.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
               <FormField
                control={form.control}
                name="id_commune"
                render={({ field }) => (
                  <FormItem className="w-full max-w-sm pb-4 flex flex-col">
                    <FormLabel>Commune</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger className="w-[280px] border border-gray-300 rounded-md">
                          <SelectValue placeholder="Choisissez votre commune" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!isProgress && communes.map((commune) => (
                          <SelectItem
                            value={commune.id_commune.toString()}
                            key={commune.id_commune}
                          >
                            {commune.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
            </div>
           
          </div>
        <MarriageCard />
          <div className="flex justify-between max-w-4xl">
            <Button
              variant={"outline"}
              onClick={() => {
                setActiveTap(index - 1);
              }}
            >
              Precedent
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setActiveTap(index + 1);
              }}
            >
              Suivant
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Confirmation;
