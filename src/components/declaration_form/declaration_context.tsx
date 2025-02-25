import { createContext, useState } from "react";

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
  setEpoux: (epoux: Epoux) => void;
  setEpouse: (epouse: Epouse) => void;
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

export const DeclarationConjointProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [epoux, setEpoux] = useState<Epoux>({
    nomEpoux: "",
    date_naissanceEpoux: "",
    telephoneEpoux: "",
  });
  const [epouse, setEpouse] = useState<Epouse>({
    nomEpouse: "",
    date_naissanceEpouse: "",
    telephoneEpouse: "",
  });

  return (
    <DeclarationConjointContext.Provider value={{ epoux, epouse, setEpoux, setEpouse }}>
      {children}
    </DeclarationConjointContext.Provider>
  );
}