import { createContext } from "react";

export type Mariage = {
  date_mariage: string;
  lieu_mariage: string;
  id_commune: number
}


export type Celebrant = {
  nom: string;
  prenom?: string;
  date_naissance: string;
  telephone: string;
}

export type Temoin = {
  nom: string;
  prenom?: string;
  date_naissance: string;
  telephone: string;
}


export type Epouse = {
  nomEpouse: string;
  prenomEpouse?: string;
  date_naissanceEpouse: string;
  telephoneEpouse: string;
}

export type Epoux = {
    nomEpoux: string;
    prenomEpoux?: string;
    date_naissanceEpoux: string;
    telephoneEpoux: string;
}

type DeclarationConjointContextType = {
  epoux: Epoux;
  epouse: Epouse;
  setEpoux: React.Dispatch<React.SetStateAction<Epoux>>;
  setEpouse: React.Dispatch<React.SetStateAction<Epouse>>;
};

export const DeclarationConjointContext = createContext<DeclarationConjointContextType>({
  epoux: {
    nomEpoux: "",
    date_naissanceEpoux: "",
    telephoneEpoux: "",
  },
  epouse: {
    nomEpouse: "",
    date_naissanceEpouse: "",
    telephoneEpouse: "",
  },
  setEpoux: () => {},
  setEpouse: () => {},
});

export const DeclarationMariageContext = createContext<{
    mariage: Mariage;
    setMariage: React.Dispatch<React.SetStateAction<Mariage>>;
}>({
    mariage: {
      date_mariage: "",
      lieu_mariage: "",
      id_commune: 0
    },
    setMariage: () => {},
});

export const DeclarationCelebrantContext = createContext<{
    celebrant: Celebrant;
    setCelebrant: React.Dispatch<React.SetStateAction<Celebrant>>;
  }>({
    celebrant: {
      nom: "",
      date_naissance: "",
      telephone: "",
    },
    setCelebrant: () => {},
  });

export const DeclarationTemoinContext = createContext<{
    temoins: Temoin[];
    setTemoins: React.Dispatch<React.SetStateAction<Temoin[]>>;
  }>({
    temoins: [],
    setTemoins: () => {},
  });

