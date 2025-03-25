import { useContext } from "react";
import {
  DeclarationCelebrantContext,
  DeclarationConjointContext,
  DeclarationMariageContext,
  DeclarationTemoinContext
} from "./declaration_form/context";



const MarriageCard = ({idDeclaration, ref}: {
  idDeclaration: number | null,
  ref: React.Ref<HTMLDivElement> | undefined
}) => {
    const {mariage} = useContext(DeclarationMariageContext)
    const {celebrant} = useContext(DeclarationCelebrantContext)
    const {epouse, epoux} = useContext(DeclarationConjointContext)
    const {temoins} = useContext(DeclarationTemoinContext)
  return (
    <div ref={ref} className="bg-white rounded-lg shadow-lg p-6 max-w-4xl my-8 border-2 border-[rgb(1,167,1)] w-full">
      {/* En-tête */}
      <div className="mb-8 text-center border-b-2 border-[rgb(1,167,1)] pb-4">
        <h1
          className="text-2xl font-bold text-[rgb(1,167,1)]"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Declaration No: {idDeclaration}
        </h1>
        <p className="text-[rgb(1,167,1)] mt-2 text-sm opacity-80">
          Commune : {mariage.nom_commune}
        </p>
      </div>

      {/* Section Mariage */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[rgb(1,167,1)] mb-4">
          Détails du Mariage
        </h2>
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm">
              <span className="font-medium text-[rgb(1,167,1)]">Date:</span>{" "}
              {mariage.date_mariage}
            </p>
          </div>
         
        </div>
      </div>

      {/* Section Célébrant */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[rgb(1,167,1)] mb-4">
          Officiant
        </h2>
        <div className="border-2 border-[rgb(1,167,1)] rounded-lg p-4 bg-[rgba(1,167,1,0.05)]">
          <p className="text-sm">
            <span className="font-medium text-[rgb(1,167,1)]">Nom:</span>{" "}
            {celebrant.nom}
          </p>
          {celebrant.prenom && (
            <p className="text-sm">
              <span className="font-medium text-[rgb(1,167,1)]">Prénom:</span>{" "}
              {celebrant.prenom}
            </p>
          )}
         
          <p className="text-sm">
            <span className="font-medium text-[rgb(1,167,1)]">Téléphone:</span>{" "}
            {celebrant.telephone}
          </p>
        </div>
      </div>

      {/* Section Couple */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Époux */}
        <div className="border-2 border-[rgb(1,167,1)] rounded-lg p-4 bg-[rgba(1,167,1,0.05)]">
          <h3 className="font-medium text-[rgb(1,167,1)] mb-2">Époux</h3>
          <p className="text-sm">Nom: {epoux.nomEpoux}</p>
          {epoux.prenomEpoux && (
            <p className="text-sm">Prénom: {epoux.prenomEpoux}</p>
          )}
          <p className="text-sm">Naissance: {epoux.date_naissanceEpoux}</p>
          <p className="text-sm">Téléphone: {epoux.telephoneEpoux}</p>
        </div>

        {/* Épouse */}
        <div className="border-2 border-[rgb(1,167,1)] rounded-lg p-4 bg-[rgba(1,167,1,0.05)]">
          <h3 className="font-medium text-[rgb(1,167,1)] mb-2">Épouse</h3>
          <p className="text-sm">Nom: {epouse.nomEpouse}</p>
          {epouse.prenomEpouse && (
            <p className="text-sm">Prénom: {epouse.prenomEpouse}</p>
          )}
          <p className="text-sm">Naissance: {epouse.date_naissanceEpouse}</p>
          <p className="text-sm">Téléphone: {epouse.telephoneEpouse}</p>
        </div>
      </div>

      {/* Témoins */}
      <div className="grid grid-cols-2 gap-6">
        {temoins.map((temoin, index) => (
          <div
            key={index}
            className="border-2 border-[rgb(1,167,1)] rounded-lg p-4 bg-[rgba(1,167,1,0.05)]"
          >
            <h3 className="font-medium text-[rgb(1,167,1)] mb-2">
              Témoin {index + 1}
            </h3>
            <p className="text-sm">Nom: {temoin.nom}</p>
            {temoin.prenom && (
              <p className="text-sm">Prénom: {temoin.prenom}</p>
            )}
          
            <p className="text-sm">Téléphone: {temoin.telephone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarriageCard;
