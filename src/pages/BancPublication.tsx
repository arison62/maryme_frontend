/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { get } from "@/api/client";
import { Eye, Calendar, Search, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

// Types pour les données
interface Declaration {
  id_declaration: number;
  id_utilisateur: number;
  status: string;
  date_declaration: string;
  date_celebration: string;
  date_publication: string;
  id_celebrant: number;
  id_commune: number;
  id_epoux: number;
  id_epouse: number;
  createdAt: string;
  updatedAt: string;
  Commune: {
    id_commune: number;
    nom: string;
  };
  Celebrant: {
    nom: string;
    prenom: string;
    telephone: string;
  };
  Epoux: {
    nom: string;
    prenom: string;
    telephone: string;
  };
  Epouse: {
    nom: string;
    prenom: string;
    telephone: string;
  };
  Temoins: [
    {
      nom: string;
      prenom: string;
      telephone: string;
      DeclarationTemoin: {
        id: number;
        id_temoin: number;
        id_declaration: number;
      };
    }
  ];
}

interface Commune {
  id_commune: number;
  nom: string;
  declarations: Declaration[];
}

const BancPublication = () => {
  const [, setDeclarations] = useState<Declaration[]>([]);
  const [communesData, setCommunesData] = useState<Commune[]>([]);
  const [, setSelectedDeclaration] = useState<Declaration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date_publication");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);

  // Fonction pour récupérer les déclarations publiées
  const fetchPublishedDeclarations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get<Declaration[]>(
        `/declaration/publier?sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (response.error) {
        throw new Error(response.message || "Impossible de récupérer les déclarations.");
      }
      console.log(response.data)
      setDeclarations(response.data);
      
      // Organiser les déclarations par commune
      const communesMap = new Map<number, Commune>();
      
      response.data.forEach(declaration => {
        const communeId = declaration.id_commune;
        const communeNom = declaration.Commune.nom;
        
        if (!communesMap.has(communeId)) {
          communesMap.set(communeId, {
            id_commune: communeId,
            nom: communeNom,
            declarations: []
          });
        }
        
        communesMap.get(communeId)?.declarations.push(declaration);
      });
      
      // Convertir la Map en Array pour le rendu
      setCommunesData(Array.from(communesMap.values()));
      
    } catch (error: any) {
      console.error("Error fetching published declarations:", error);
      setError(error.message || "Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  // Récupérer les déclarations au chargement du composant ou lorsque les filtres changent
  useEffect(() => {
    fetchPublishedDeclarations();
  }, [fetchPublishedDeclarations]);

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fonction pour afficher les détails de la déclaration
  const handleViewDetails = (declaration: Declaration) => {
    setSelectedDeclaration(declaration);
  };

  // Filtrer les déclarations en fonction du terme de recherche
  const filteredCommunes = communesData.filter(commune => {
    // Si une commune spécifique est sélectionnée, ne montrer que celle-là
    if (selectedCommune && commune.id_commune.toString() !== selectedCommune) {
      return false;
    }
    
    // Filtrer par terme de recherche si présent
    if (searchTerm) {
      return commune.declarations.some(declaration => 
        declaration.Epoux.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        declaration.Epoux.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        declaration.Epouse.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        declaration.Epouse.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(declaration.date_celebration).includes(searchTerm)
      );
    }
    
    return true;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Banc de Publication des Mariages</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Publications de Mariage
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select
                value={selectedCommune || ""}
                onValueChange={(value) => setSelectedCommune(value || null)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes les communes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">Toutes les communes</SelectItem>
                  {communesData.map((commune) => (
                    <SelectItem key={commune.id_commune} value={commune.id_commune.toString()}>
                      {commune.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_publication">Date de publication</SelectItem>
                  <SelectItem value="date_celebration">Date de célébration</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Croissant</SelectItem>
                  <SelectItem value="desc">Décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Chargement des publications...</p>
          ) : filteredCommunes.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Aucune publication trouvée
            </p>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              <AnimatePresence>
                {filteredCommunes.map((commune) => {
                  // Filtrer les déclarations par terme de recherche si présent
                  const filteredDeclarations = searchTerm 
                    ? commune.declarations.filter(declaration => 
                        declaration.Epoux.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        declaration.Epoux.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        declaration.Epouse.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        declaration.Epouse.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        formatDate(declaration.date_celebration).includes(searchTerm)
                      )
                    : commune.declarations;
                    
                  if (filteredDeclarations.length === 0) return null;
                  
                  return (
                    <motion.div
                      key={commune.id_commune}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AccordionItem value={`commune-${commune.id_commune}`} className="border rounded-md">
                        <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{commune.nom}</span>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {filteredDeclarations.length}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-2">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date de publication</TableHead>
                                  <TableHead>Date de célébration</TableHead>
                                  <TableHead>Époux</TableHead>
                                  <TableHead>Épouse</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredDeclarations.map((declaration) => (
                                  <TableRow key={declaration.id_declaration}>
                                    <TableCell>
                                      {declaration.date_publication ? formatDate(declaration.date_publication) : "Non publiée"}
                                    </TableCell>
                                    <TableCell>
                                      {formatDate(declaration.date_celebration)}
                                    </TableCell>
                                    <TableCell>
                                      {declaration.Epoux?.nom} {declaration.Epoux?.prenom}
                                    </TableCell>
                                    <TableCell>
                                      {declaration.Epouse?.nom} {declaration.Epouse?.prenom}
                                    </TableCell>
                                    <TableCell>
                                      <Dialog onOpenChange={(open) => {
                                        if (open) handleViewDetails(declaration);
                                        else setSelectedDeclaration(null);
                                      }}>
                                        <DialogTrigger asChild>
                                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            Détails
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl overflow-auto max-h-[90vh]">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Publication de Mariage
                                            </DialogTitle>
                                            <DialogDescription>
                                              Publication de mariage pour la commune de {declaration.Commune.nom}
                                            </DialogDescription>
                                          </DialogHeader>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="bg-blue-50 p-4 rounded-md">
                                              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Informations générales
                                              </h3>
                                              <div className="grid grid-cols-2 gap-2">
                                                <p className="text-sm font-medium">Commune:</p>
                                                <p className="text-sm">{declaration.Commune.nom}</p>
                                                
                                                <p className="text-sm font-medium">Date de publication:</p>
                                                <p className="text-sm">
                                                  {declaration.date_publication ? formatDate(declaration.date_publication) : "Non publiée"}
                                                </p>
                                                
                                                <p className="text-sm font-medium">Date de célébration:</p>
                                                <p className="text-sm">{formatDate(declaration.date_celebration)}</p>
                                              </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 p-4 rounded-md">
                                              <h3 className="font-semibold text-lg mb-2">Célébrant</h3>
                                              <div className="grid grid-cols-2 gap-2">
                                                <p className="text-sm font-medium">Nom:</p>
                                                <p className="text-sm">{declaration.Celebrant?.nom}</p>
                                                
                                                <p className="text-sm font-medium">Prénom:</p>
                                                <p className="text-sm">{declaration.Celebrant?.prenom}</p>
                                              </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 p-4 rounded-md">
                                              <h3 className="font-semibold text-lg mb-2">Époux</h3>
                                              <div className="grid grid-cols-2 gap-2">
                                                <p className="text-sm font-medium">Nom:</p>
                                                <p className="text-sm">{declaration.Epoux?.nom}</p>
                                                
                                                <p className="text-sm font-medium">Prénom:</p>
                                                <p className="text-sm">{declaration.Epoux?.prenom}</p>
                                              </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 p-4 rounded-md">
                                              <h3 className="font-semibold text-lg mb-2">Épouse</h3>
                                              <div className="grid grid-cols-2 gap-2">
                                                <p className="text-sm font-medium">Nom:</p>
                                                <p className="text-sm">{declaration.Epouse?.nom}</p>
                                                
                                                <p className="text-sm font-medium">Prénom:</p>
                                                <p className="text-sm">{declaration.Epouse?.prenom}</p>
                                              </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 p-4 rounded-md md:col-span-2">
                                              <h3 className="font-semibold text-lg mb-2">Témoins</h3>
                                              {declaration.Temoins?.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                  {declaration.Temoins.map((temoin, index) => (
                                                    <div key={index} className="border border-blue-100 rounded p-3">
                                                      <p className="text-sm">
                                                        <span className="font-medium">Nom:</span> {temoin.nom}
                                                      </p>
                                                      <p className="text-sm">
                                                        <span className="font-medium">Prénom:</span> {temoin.prenom}
                                                      </p>
                                                    </div>
                                                  ))}
                                                </div>
                                              ) : (
                                                <p className="text-sm text-gray-500">Aucun témoin enregistré</p>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                            <p className="text-sm italic text-center">
                                              Cette publication est affichée conformément aux dispositions du Code civil. 
                                              Toute opposition au mariage doit être présentée dans les formes légales 
                                              auprès de l'officier d'état civil de la commune concernée.
                                            </p>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BancPublication;