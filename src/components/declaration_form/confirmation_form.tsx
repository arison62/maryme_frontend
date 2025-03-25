import { z } from "zod";
import { useForm } from "react-hook-form";
import { get, post } from "@/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeclarationCelebrantContext,
  DeclarationConjointContext,
  DeclarationMariageContext,
  DeclarationTemoinContext,
} from "./declaration_provider";
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
import CircularProgressIndicator from "../ui/circular-progress-indicator";
import { useToast } from "@/hooks/use-toast";
import generatePDF from 'react-to-pdf';

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
  const { celebrant } = useContext(DeclarationCelebrantContext);
  const { epouse, epoux } = useContext(DeclarationConjointContext);
  const { temoins } = useContext(DeclarationTemoinContext);

  const { setActiveTap } = useContext(TapContext);
  const [regions, setRegions] = useState<DataRegion[]>([]);
  const [departements, setDepartements] = useState<DataDepartement[]>([]);
  const [communes, setCommunes] = useState<DataCommune[]>([]);
  const [isProgress, setIsProgess] = useState(false);
  const isFirtstRender = useRef(true);
  const [id_declaration, setIdDeclaration] = useState<number | null>(null);
  const [isSent, setIsSent] = useState(false);
  const {toast} = useToast();
  const pdfDeclaration = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setIsProgess(true);
    async function getData() {
      const data = await get<DataRegion[]>("regions");

      if (
        (typeof data.error == "boolean" && data.error == false) ||
        data.error == undefined
      ) {
        setRegions(data.data);
        setIsProgess(false);
      } else {
        console.log(data.message);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (!isFirtstRender.current) {
      setIsProgess(true);
      async function setDeclaration() {
        console.log("Set declaration");
        const data = await post<{
          id: number;
        }>("declaration/create", {
          celebrant: celebrant,
          temoins: temoins,
          id_commune: mariage.id_commune,
          date_celebration: mariage.date_mariage,
          epoux: {
            nom: epoux.nomEpoux,
            prenom: epoux.prenomEpoux,
            telephone: epoux.telephoneEpoux,
            date_naissance: epoux.date_naissanceEpoux,
          },
          epouse: {
            nom: epouse.nomEpouse,
            prenom: epouse.prenomEpouse,
            telephone: epouse.telephoneEpouse,
            date_naissance: epouse.date_naissanceEpouse,
          },
        });

        if (
          (typeof data.error == "boolean" && data.error == false) ||
          data.error == undefined
        ) {
          console.log(data);
          setIdDeclaration(data.data.id);
          toast({
            title: "Déclaration envoyée",
            description: "Votre déclaration a été envoyée avec succès",
          })
        } else {
          console.log(data.message);
          toast({
            variant: "destructive",
            title: "Déclaration non envoyée",
            description: data.message,
          })
        }
        setIsProgess(false);
        setIsSent(false);
      }
      setDeclaration();
    }else{
      isFirtstRender.current = false;
    }
    console.log("isFirtstRender", isFirtstRender);
   
  }, [isSent]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_region: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  function onChange(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const id_region = formData.get("id_region") as string;
    const id_departement = formData.get("id_departement") as string;
    const id_commune = formData.get("id_commune") as string;

    console.log("onchange : ", id_region, id_departement, id_commune);
    const departement = regions.find(
      (region) => region.id_region == parseInt(id_region)
    )?.Departements;
    console.log(departement);
    const communes = departement?.find(
      (departement) => departement.id_departement == parseInt(id_departement)
    )?.Communes;
    setDepartements(departement ?? []);
    setCommunes(communes ?? []);
    if (id_commune) {
      console.log("onchange : ", id_region, id_departement, id_commune);
      setMariage({
        ...mariage,
        nom_commune: communes?.find(
          (commune) => commune.id_commune == parseInt(id_commune)
        )?.nom,
        id_commune: parseInt(id_commune),
      });
    }
  }

  return (
    <div className={clsx("w-full mb-4", className)}>
      <Form {...form}>
        <form
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
                        {!isProgress &&
                          regions.map((region) => (
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
                    <Select name={field.name}>
                      <FormControl>
                        <SelectTrigger className="w-[280px] border border-gray-300 rounded-md">
                          <SelectValue placeholder="Choisissez votre departement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!isProgress &&
                          departements.map((departement) => (
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
                    <Select name={field.name}>
                      <FormControl>
                        <SelectTrigger className="w-[280px] border border-gray-300 rounded-md">
                          <SelectValue placeholder="Choisissez votre commune" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!isProgress &&
                          communes.map((commune) => (
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
          <MarriageCard idDeclaration={id_declaration} ref={pdfDeclaration}/>
          <div className="flex justify-between max-w-4xl">

            <Button
              variant={"outline"}
              onClick={() => {
                setActiveTap(index - 1);
              }}
            >
              Precedent
            </Button>
            {
              id_declaration == null ? (
                <Button
                  type="submit"
                  disabled={isProgress}
                  onClick={() => {
                    setIsSent(true);
                  }}
                >
                  {isProgress && <CircularProgressIndicator />}
                  Enregister
                </Button>
              ):(
                <Button
                  onClick={
                    ()=> generatePDF(pdfDeclaration, {filename: `declaration-${id_declaration}.pdf`})
                  }
                >
                  Telecharger
                </Button>
              )
            }
          
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Confirmation;
