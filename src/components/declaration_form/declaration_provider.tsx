import { useState } from "react";
import {
  Epoux,
  Epouse,
  DeclarationConjointContext,
  Celebrant,
  DeclarationCelebrantContext,
  DeclarationMariageContext,
  DeclarationTemoinContext,
  Temoin,
  Mariage,
} from "./context";

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
    <DeclarationConjointContext.Provider
      value={{ epoux, epouse, setEpoux, setEpouse }}
    >
      {children}
    </DeclarationConjointContext.Provider>
  );
};

export const DeclarationCelebrantProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [celebrant, setCelebrant] = useState<Celebrant>({
    nom: "",
    date_naissance: "",
    telephone: "",
  });
  return (
    <DeclarationCelebrantContext.Provider value={{ celebrant, setCelebrant }}>
      {children}
    </DeclarationCelebrantContext.Provider>
  );
};

export const DeclarationMariageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mariage, setMariage] = useState({
    date_mariage: "",
    lieu_mariage: "",
    id_commune: 0,
  });
  return (
    <DeclarationMariageContext.Provider value={{ mariage, setMariage }}>
      {children}
    </DeclarationMariageContext.Provider>
  );
};

export const DeclarationTemoinProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [temoins, setTemoins] = useState<Temoin[]>([
    {
      nom: "",
      prenom: "",
      date_naissance: "",
      telephone: "",
    },
    {
      nom: "",
      prenom: "",
      date_naissance: "",
      telephone: "",
    }
  ]);
  return (
    <DeclarationTemoinContext.Provider value={{ temoins, setTemoins }}>
      {children}
    </DeclarationTemoinContext.Provider>
  );
};

export const DeclarationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DeclarationConjointProvider>
      <DeclarationCelebrantProvider>
        <DeclarationMariageProvider>
          <DeclarationTemoinProvider>{children}</DeclarationTemoinProvider>
        </DeclarationMariageProvider>
      </DeclarationCelebrantProvider>
    </DeclarationConjointProvider>
  );
};

export {
  DeclarationConjointContext,
  DeclarationCelebrantContext,
  DeclarationMariageContext,
  DeclarationTemoinContext,
  type Epouse,
  type Epoux,
  type Celebrant,
  type Mariage,
  type Temoin,
};
