import { useState, useEffect, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { get, post } from '@/api/client'; // Assurez-vous que le chemin est correct

// Types pour les données (Région, Département, Commune)
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

// Schéma de validation pour la création de commune
const communeSchema = z.object({
  id_region: z.string().min(1, { message: 'Veuillez sélectionner une région.' }),
  id_departement: z.string().min(1, { message: 'Veuillez sélectionner un département.' }),
  nom_commune: z.string().min(2, { message: 'Le nom de la commune doit contenir au moins 2 caractères.' }),
});

// Schéma de validation pour la création d'officier
const officerSchema = z.object({
  fullName: z.string().min(3, "Nom complet requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().regex(/^[0-9]{10}$/, "Numéro invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  id_region: z.string().min(1, "Veuillez sélectionner une région"),
  id_departement: z.string().min(1, "Veuillez sélectionner un département"),
  id_commune: z.string().min(1, "Veuillez sélectionner une commune"), // Ajout de la validation de la commune
});

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('communes');
  const [regions, setRegions] = useState<DataRegion[]>([]);
  const [departements, setDepartements] = useState<DataDepartement[]>([]);
  const [communes, setCommunes] = useState<DataCommune[]>([]); // Ajout de l'état pour les communes
  const [officers, setOfficers] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout de l'état pour le chargement

  // Initialisation du formulaire pour la création de commune
  const communeForm = useForm<z.infer<typeof communeSchema>>({
    resolver: zodResolver(communeSchema),
    defaultValues: {
      id_region: '',
      id_departement: '',
      nom_commune: '',
    },
  });

  // Initialisation du formulaire pour la création d'officier
  const officerForm = useForm<z.infer<typeof officerSchema>>({
    resolver: zodResolver(officerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      id_region: '',
      id_departement: '',
      id_commune: '', // Initialisation du champ id_commune
    },
  });

  // Utilisation de useWatch pour observer les changements de région et département
  const watchedRegionCommuneForm = useWatch({ control: communeForm.control, name: "id_region" });
  const watchedDepartementCommuneForm = useWatch({ control: communeForm.control, name: "id_departement" });

  const watchedRegionOfficerForm = useWatch({ control: officerForm.control, name: "id_region" });
  const watchedDepartementOfficerForm = useWatch({ control: officerForm.control, name: "id_departement" });

  // Récupération des régions
  const fetchRegions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get<DataRegion[]>("regions"); // Assurez-vous que "regions" est le bon endpoint

      if (data && !data.error) { // Vérification de la structure de la réponse
        setRegions(data.data);
      } else {
        console.error("Erreur lors de la récupération des régions:", data?.message || "Erreur inconnue");
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de récupérer la liste des régions.',
        });
      }
    } catch (error) {
      console.error("Erreur lors de la requête pour les régions:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur s\'est produite lors de la communication avec le serveur.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Appel de fetchRegions au chargement du composant
  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);


  // Mise à jour des départements en fonction de la région sélectionnée (Commune Form)
  useEffect(() => {
    const selectedRegionId = parseInt(watchedRegionCommuneForm);
    if (selectedRegionId) {
      const fetchDepartements = async () => {
        setLoading(true);
        try {
          // Simuler une requête API
          const response = regions.find((region) => region.id_region === selectedRegionId)?.Departements || [];
          setDepartements(response);
          communeForm.setValue('id_departement', '');
          setCommunes([]); // Réinitialise les communes quand le département change
        } catch (error) {
          console.error('Erreur lors de la récupération des départements :', error);
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Une erreur s\'est produite lors de la récupération des départements.',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchDepartements();
    } else {
      setDepartements([]);
      communeForm.setValue('id_departement', '');
      setCommunes([]);
    }
  }, [watchedRegionCommuneForm, regions, communeForm, toast]);

  // Mise à jour des communes en fonction du département sélectionné (Commune Form)
  useEffect(() => {
    const selectedDepartementId = parseInt(watchedDepartementCommuneForm);
    if (selectedDepartementId) {
      const fetchCommunes = async () => {
        setLoading(true);
        try {
          const response = departements.find((departement) => departement.id_departement === selectedDepartementId)?.Communes || [];
          setCommunes(response);
        } catch (error) {
          console.error("Erreur lors de la récupération des communes", error);
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Une erreur s\'est produite lors de la récupération des communes.',
          });
        } finally {
          setLoading(false);
        }
      }
      fetchCommunes();
    } else {
      setCommunes([]);
    }
  }, [watchedDepartementCommuneForm, departements, toast]);



  // Mise à jour des départements et des communes pour Officier Form
  useEffect(() => {
    const selectedRegionId = parseInt(watchedRegionOfficerForm);
    if (selectedRegionId) {
      const fetchOfficerDepartements = async () => {
        setLoading(true);
        try {
          const response = regions.find((region) => region.id_region === selectedRegionId)?.Departements || [];
          setDepartements(response);
          officerForm.setValue('id_departement', '');
          officerForm.setValue('id_commune', '');
        } catch (error) {
          console.error("Erreur lors de la récupération des départements (Officier):", error);
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Une erreur s\'est produite lors de la récupération des départements.',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchOfficerDepartements();
    } else {
      setDepartements([]);
      officerForm.setValue('id_departement', '');
      officerForm.setValue('id_commune', '');
    }
  }, [watchedRegionOfficerForm, regions, officerForm, toast]);

  useEffect(() => {
    const selectedDepartementId = parseInt(watchedDepartementOfficerForm);
    if (selectedDepartementId) {
      const fetchOfficerCommunes = async () => {
        setLoading(true);
        try {
          const response = departements.find((departement) => departement.id_departement === selectedDepartementId)?.Communes || [];
          setCommunes(response);
          officerForm.setValue('id_commune', '');
        } catch (error) {
          console.error("Erreur lors de la récupération des communes", error);
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Une erreur s\'est produite lors de la récupération des communes.',
          });
        } finally {
          setLoading(false);
        }
      }
      fetchOfficerCommunes();
    } else {
      setCommunes([]);
      officerForm.setValue('id_commune', '');
    }
  }, [watchedDepartementOfficerForm, departements, officerForm, toast]);



  // Fonction pour créer une commune
  const handleCreateCommune = async (values) => {
    try {
      // Simuler l'appel API pour créer une commune
      const response = await post<
      {
        nom: string,
        id_commune: number,
        id_departement: number
      }
      >('commune/create', {
        ...values,
        nom: values.nom_commune
      });
      
      if(!response.error){
        const newCommune = {
            id_commune: response.data.id_commune, // Simuler un ID
            nom: response.data.nom,
            id_departement: response.data.id_departement,
          };
    
          setCommunes([...communes, newCommune]); // Mettre à jour l'état local
          toast({ title: 'Commune créée avec succès' });
          communeForm.reset();
      }else{
        console.log(response)
        toast({
            variant: 'destructive',
            title: "Erreur creation",
            description: response.message || response.error
        })
      }
      
     
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur de création',
        description: error.message || 'Une erreur est survenue lors de la création de la commune.',
      });
    }
  };

  // Fonction pour créer un officier
  const handleCreateOfficer = async (values) => {
    try {
      // Simuler l'appel API pour créer un officier
      const newOfficer = {
        id: officers.length + 1, // Simuler un ID
        ...values,
      };

      setOfficers([...officers, newOfficer]); // Mettre à jour l'état local
      toast({ title: 'Officier créé avec succès' });
      officerForm.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur de création',
        description: error.message || "Une erreur s'est produite lors de la création de l'officier.",
      });
    }
  };

  // Fonction pour valider un admin
  const handleValidateAdmin = async (adminId: number) => {
    try {
      // Simuler l'appel API pour valider un admin
      setPendingAdmins(pendingAdmins.filter((a) => a.id !== adminId)); // Mettre à jour l'état local
      toast({ title: 'Admin validé avec succès' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur de validation',
        description: error.message || "Une erreur s'est produite lors de la validation de l'admin.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white h-screen p-4 shadow">
          <h2 className="text-xl font-bold mb-6">Tableau de bord Admin</h2>
          <div className="space-y-2">
            <Button
              variant={activeTab === 'communes' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('communes')}
            >
              Gestion des communes
            </Button>
            <Button
              variant={activeTab === 'officiers' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('officiers')}
            >
              Comptes officiers
            </Button>
            <Button
              variant={activeTab === 'validations' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('validations')}
            >
              Validation admins
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'communes' && (
            <Card>
              <CardHeader>
                <CardTitle>Création de commune</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...communeForm}>
                  <form onSubmit={communeForm.handleSubmit(handleCreateCommune)} className="space-y-4">
                    <FormField
                      control={communeForm.control}
                      name="id_region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Région <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner une région" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loading ? (
                                <SelectItem value="load" disabled>Chargement...</SelectItem>
                              ) : (
                                regions.map((region) => (
                                  <SelectItem key={region.id_region} value={region.id_region.toString()}>
                                    {region.nom}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={communeForm.control}
                      name="id_departement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Département <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un département" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loading ? (
                                <SelectItem value="load" disabled>Chargement...</SelectItem>
                              ) : (
                                departements.map((departement) => (
                                  <SelectItem key={departement.id_departement} value={departement.id_departement.toString()}>
                                    {departement.nom}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={communeForm.control}
                      name="nom_commune"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de la commune <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Entrer le nom de la commune" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={loading}>
                      {loading ? 'Chargement...' : 'Créer la commune'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'officiers' && (
            <Card>
              <CardHeader>
                <CardTitle>Création d'officier d'état civil</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...officerForm}>
                  <form onSubmit={officerForm.handleSubmit(handleCreateOfficer)} className="space-y-4">
                    <FormField
                      control={officerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom complet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={officerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={officerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="Téléphone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={officerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={officerForm.control}
                      name="id_region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Région <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner une région" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loading ? (
                                <SelectItem value="" disabled>Chargement...</SelectItem>
                              ) : (
                                regions.map((region) => (
                                  <SelectItem key={region.id_region} value={region.id_region.toString()}>
                                    {region.nom}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={officerForm.control}
                      name="id_departement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Département <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un département" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loading ? (
                                <SelectItem value="" disabled>Chargement...</SelectItem>
                              ) : (
                                departements.map((departement) => (
                                  <SelectItem key={departement.id_departement} value={departement.id_departement.toString()}>
                                    {departement.nom}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={officerForm.control}
                      name="id_commune"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commune <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner une commune" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loading ? (
                                <SelectItem value="" disabled>Chargement...</SelectItem>
                              ) : (
                                communes.map((commune) => (
                                  <SelectItem key={commune.id_commune} value={commune.id_commune.toString()}>
                                    {commune.nom}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={loading}>
                      {loading ? 'Chargement...' : 'Créer le compte'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'validations' && (
            <Card>
              <CardHeader>
                <CardTitle>Validation des comptes admin</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>{admin.fullName}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="mr-2"
                            onClick={() => handleValidateAdmin(admin.id)}
                            disabled={loading}
                          >
                            {loading ? 'Chargement...' : 'Valider'}
                          </Button>
                          <Button variant="destructive" size="sm" disabled={loading}>
                            {loading ? 'Chargement...' : 'Rejeter'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

