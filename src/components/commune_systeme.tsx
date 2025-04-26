import { useEffect, useState } from "react";
import { get } from "@/api/client";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import CircularProgressIndicator from "@/components/ui/circular-progress-indicator";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Types pour les données retournées par l'API
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
  isOpen?: boolean; // Pour l'animation UI
};

type DataRegion = {
  id_region: number;
  nom: string;
  Departements: DataDepartement[];
  isOpen?: boolean; // Pour l'animation UI
};

export default function CommunesAvecSysteme({ 
  onSelect 
}: { 
  onSelect?: (commune: { id: number; nom: string }) => void 
}) {
  const [regions, setRegions] = useState<DataRegion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Charger la structure régions/départements/communes
        const response = await get<DataRegion[]>("regions");
        
        if ((typeof response.error === "boolean" && response.error === false) || 
            response.error === undefined) {
          
          // Filtrer les départements sans communes et ajouter propriétés UI
          const filteredRegions = response.data.map(region => ({
            ...region,
            isOpen: false,
            // Filtrer pour ne garder que les départements avec au moins une commune
            Departements: region.Departements
              .filter(dept => dept.Communes && dept.Communes.length > 0)
              .map(dept => ({
                ...dept,
                isOpen: false
              }))
          }))
          // Filtrer pour ne garder que les régions avec au moins un département
          .filter(region => region.Departements.length > 0);
          
          setRegions(filteredRegions);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: "Impossible de charger les données des régions",
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des données",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  const toggleRegion = (regionId: number) => {
    setRegions(prevRegions => 
      prevRegions.map(region => ({
        ...region,
        isOpen: region.id_region === regionId ? !region.isOpen : region.isOpen
      }))
    );
  };

  const toggleDepartement = (regionId: number, deptId: number) => {
    setRegions(prevRegions => 
      prevRegions.map(region => ({
        ...region,
        Departements: region.Departements.map(dept => ({
          ...dept,
          isOpen: region.id_region === regionId && dept.id_departement === deptId 
            ? !dept.isOpen 
            : dept.isOpen
        }))
      }))
    );
  };

  const handleCommuneSelect = (commune: DataCommune) => {
    if (onSelect) {
      onSelect({ id: commune.id_commune, nom: commune.nom });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgressIndicator />
      </div>
    );
  }

  if (regions.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        Aucune commune avec le système de déclaration n'a été trouvée.
      </div>
    );
  }

  return (
    <div className="communes-list bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold text-green-800 mb-4">
        Communes avec système de déclaration numérique
      </h2>
      
      <div className="nested-list">
        {regions.map(region => (
          <div key={region.id_region} className="region-item mb-2">
            <button 
              onClick={() => toggleRegion(region.id_region)}
              className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded transition-colors font-medium"
            >
              {region.isOpen ? (
                <ChevronDown className="w-5 h-5 mr-2 text-green-700" />
              ) : (
                <ChevronRight className="w-5 h-5 mr-2 text-green-700" />
              )}
              {region.nom}
            </button>
            
            {region.isOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-6"
              >
                {region.Departements.map(dept => (
                  <div key={dept.id_departement} className="dept-item mb-1">
                    <button 
                      onClick={() => toggleDepartement(region.id_region, dept.id_departement)}
                      className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      {dept.isOpen ? (
                        <ChevronDown className="w-4 h-4 mr-2 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2 text-blue-600" />
                      )}
                      {dept.nom}
                    </button>
                    
                    {dept.isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-6"
                      >
                        {dept.Communes.map(commune => (
                          <div 
                            key={commune.id_commune}
                            onClick={() => handleCommuneSelect(commune)}
                            className="commune-item p-2 pl-4 hover:bg-green-50 cursor-pointer rounded flex items-center"
                          >
                            <Check className="w-4 h-4 mr-2 text-green-600" />
                            <span>{commune.nom}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}