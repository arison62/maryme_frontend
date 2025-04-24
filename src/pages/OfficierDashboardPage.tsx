/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  CheckCircle,
  AlertTriangle,
  KeyRound,
  Check,
  X,
  Calendar,
  Eye,
  Send,
} from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { post, get } from "@/api/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextDisplay from "@/components/text-dispay";

// Types pour les données
interface Declaration {
  id_declaration: number;
  id_utilisateur: number;
  status: string;
  date_declaration: string;
  date_celebration: string;
  id_celebrant: number;
  id_commune: number;
  id_epoux: number;
  id_epouse: number;
  createdAt: string;
  updatedAt: string;
  Commune: {
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
  Messages: Message[];
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
  Oppositions: Opposition[];
  Utilisateur?: {
    email: string;
  };
}

interface Message {
  contenu: string,
  type_message: string,
  date_envoi: string,
}

interface Opposition {
  id_opposition?: number;
  motif: string;
  date_opposition: string;
}

// Schéma de validation pour la modification du mot de passe
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, {
      message: "L'ancien mot de passe doit contenir au moins 8 caractères.",
    }),
    newPassword: z.string().min(8, {
      message: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

const OfficerDashboard = () => {
  const { toast } = useToast();
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [selectedDeclarationMessages, setMessages] = useState<Message[]>([])
  const [, setSelectedDeclaration] =
    useState<Declaration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("en_attente");
  const [sortBy, setSortBy] = useState("date_declaration");
  const [sortOrder, setSortOrder] = useState("desc");
  const [officerInfo, setOfficerInfo] = useState<{ email: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [emailContent, setEmailContent] = useState("");

  const changePasswordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fonction pour récupérer les déclarations
  const fetchDeclarations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get<Declaration[]>(
        `/declaration/get?status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les déclarations.",
        });
        setError(response.message ?? "Erreur inconnue");
        setLoading(false);
        return;
      }
      console.log(response.data)
      setDeclarations(response.data);
    } catch (error: any) {
      console.error("Error fetching declarations:", error);
      setError(error.message || "Une erreur inattendue s'est produite.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les déclarations.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, status, sortBy, sortOrder]);

  // Récupérer les déclarations au chargement du composant ou lorsque les filtres changent
  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  // Fonction pour récupérer les informations de l'officier
  const fetchOfficerInfo = useCallback(async () => {
    setError(null);
    try {
      // À remplacer par votre appel API réel
      const response = await get<{
        email: string
      }>("/officier/me");
      if (response.error) {
        throw new Error(
          response.message || "Erreur lors de la récupération des informations"
        );
      }
      setOfficerInfo({ email: response.data.email });
    } catch (error: any) {
      console.error("Error fetching officer info:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les informations de l'officier.",
      });
    }
  }, [toast]);

  // Récupérer les informations de l'officier connecté
  useEffect(() => {
    fetchOfficerInfo();
  }, [fetchOfficerInfo]);

  // Fonction pour afficher les détails de la déclaration
  const handleViewDetails = (declaration: Declaration) => {
    setSelectedDeclaration(declaration);
    setMessages(declaration.Messages);
    setEmailContent(""); // Réinitialiser le contenu de l'email
  };

  // Fonction pour approuver une déclaration
  const handleApproveDeclaration = async (declarationId: number) => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await post(
        `/declaration/traitement/${declarationId}?status=accepte`
      );
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Erreur traitement",
          description: response.message ?? response.error,
        });
        return;
      }
      toast({
        title: "Déclaration Acceptée",
        description: "La déclaration a été acceptée.",
      });

      // Mettre à jour l'UI
      setDeclarations((prevDeclarations) =>
        prevDeclarations.map((decl) => {
          if (decl.id_declaration === declarationId) {
            return { ...decl, status: "accepte" };
          }
          return decl;
        })
      );
    } catch (error: any) {
      console.error("Error approving declaration:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'approbation de la déclaration.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonction pour refuser une déclaration
  const handleRejectDeclaration = async (declarationId: number) => {
    setIsProcessing(true);
    setError(null);
    try {
      // Commentaire: Appel API pour refuser la déclaration
      // Implémentation à ajouter par vous-même
      const response = await post(
        `/declaration/traitement/${declarationId}?status=refuse`
      );
      if (response.error) {
        console.log(response);
        toast({
          variant: "destructive",
          title: "Erreur traitement",
          description: response.message ?? response.error,
        });
        return;
      }
      toast({
        title: "Déclaration refusée",
        description: "La déclaration a été refusée.",
      });

      // Mettre à jour l'UI
      setDeclarations((prevDeclarations) =>
        prevDeclarations.map((decl) => {
          if (decl.id_declaration === declarationId) {
            return { ...decl, status: "refuse" };
          }
          return decl;
        })
      );
    } catch (error: any) {
      console.error("Error rejecting declaration:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur s'est produite lors du refus de la déclaration.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async (declarationId: number) => {
    setIsProcessing(true);
    setError(null);
    try {
      // Commentaire: Appel API pour publier la déclaration
      // Implémentation à ajouter par vous-même
      const response = await post(`/declaration/publier/${declarationId}`);
      if (response.error) {
        console.log(response);
        toast({
          variant: "destructive",
          title: "Erreur traitement",
          description: response.message ?? response.error,
        });
        return;
      }
      toast({
        title: "Déclaration publiée",
        description: "La déclaration a été publiée.",
      });
    } catch (error: any) {
      console.error("Error publishing declaration:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de la publication de la déclaration.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  // Fonction pour envoyer un e-mail
  //Je suis entreain de monter ma vistees framppe ;
  const handleSendEmail = async (declarationId: number) => {
    if (!emailContent.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir le contenu de l'email.",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const response = await post(
        `/declaration/message/send/${declarationId}`, {
          
          message: emailContent,
        });
      if (response.error) {
        console.log(response);
        toast({
          variant: "destructive",
          title: "Erreur traitement",
          description: response.message ?? response.error,
        });
        return;
      }
      // Commentaire: Appel API pour envoyer l'email
      // Implémentation à ajouter par vous-même

      toast({
        title: "Email envoyé",
        description: "L'email a été envoyé avec succès.",
      });
      setEmailContent("");
      setSelectedDeclaration(null);
    } catch (error: any) {
      console.error("Error sending email:", error);
      setError(error.message);
      toast({
        variant: "destructive",

        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de l'email.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePassword = async (
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      /**
       *
       */

      toast({
        title: "Mot de passe changé",
        description: "Votre mot de passe a été changé avec succès",
      });
      changePasswordForm.reset();
      setShowPasswordForm(false);
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur s'est produite lors du changement de mot de passe",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Officier</h1>

      {officerInfo && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-700">
            Email de l'officier : {officerInfo.email}
          </p>
          <Button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            {showPasswordForm ? "Masquer" : "Changer le mot de passe"}
          </Button>
        </div>
      )}

      {showPasswordForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Modifier votre mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...changePasswordForm}>
              <form
                onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
                className="space-y-4"
              >
                <FormField
                  control={changePasswordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ancien mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez votre ancien mot de passe"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={changePasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez votre nouveau mot de passe"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={changePasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirmez votre nouveau mot de passe"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Traitement..." : "Changer le mot de passe"}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle>Déclarations de mariage</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                defaultValue={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="accepte">Accepté</SelectItem>
                  <SelectItem value="refuse">Refusé</SelectItem>
                </SelectContent>
              </Select>

              <Select
                defaultValue={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_declaration">
                    Date de déclaration
                  </SelectItem>
                  <SelectItem value="date_celebration">
                    Date de célébration
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                defaultValue={sortOrder}
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
            <p>Chargement des déclarations...</p>
          ) : declarations.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Aucune déclaration trouvée
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date de déclaration</TableHead>
                    <TableHead>Date de célébration</TableHead>
                    <TableHead>Époux</TableHead>
                    <TableHead>Épouse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {declarations.map((declaration) => (
                      <motion.tr
                        key={declaration.id_declaration}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={
                          declaration.Oppositions?.length ? "bg-red-50" : ""
                        }
                      >
                        <TableCell>{declaration.id_declaration}</TableCell>
                        <TableCell>
                          {formatDate(declaration.date_declaration)}
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
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              declaration.status === "en_attente"
                                ? "bg-yellow-100 text-yellow-800"
                                : declaration.status === "accepte"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {declaration.status === "en_attente"
                              ? "En attente"
                              : declaration.status === "accepte"
                              ? "Accepté"
                              : "Refusé"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {declaration.status === "en_attente" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleApproveDeclaration(
                                      declaration.id_declaration
                                    )
                                  }
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  disabled={isProcessing}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleRejectDeclaration(
                                      declaration.id_declaration
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={isProcessing}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            <Dialog
                              onOpenChange={(open) => {
                                if (open) handleViewDetails(declaration);
                                else setSelectedDeclaration(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl overflow-scroll max-h-[95vh]">
                                <DialogHeader>
                                  <DialogTitle>
                                    Détails de la déclaration #
                                    {declaration.id_declaration}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Déclaration de mariage déposée le{" "}
                                    {formatDate(declaration.date_declaration)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Informations générales
                                      </h3>
                                      <div className="grid grid-cols-2 gap-2">
                                        <p className="text-sm font-medium">
                                          Statut:
                                        </p>
                                        <p className="text-sm">
                                          <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${
                                              declaration.status ===
                                              "en_attente"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : declaration.status ===
                                                  "accepte"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                          >
                                            {declaration.status === "en_attente"
                                              ? "En attente"
                                              : declaration.status === "accepte"
                                              ? "Accepté"
                                              : "Refusé"}
                                          </span>
                                        </p>
                                        <p className="text-sm font-medium">
                                          Date de déclaration:
                                        </p>
                                        <p className="text-sm">
                                          {formatDate(
                                            declaration.date_declaration
                                          )}
                                        </p>
                                        <p className="text-sm font-medium">
                                          Date de célébration:
                                        </p>
                                        <p className="text-sm">
                                          {formatDate(
                                            declaration.date_celebration
                                          )}
                                        </p>
                                        <p className="text-sm font-medium">
                                          Commune:
                                        </p>
                                        <p className="text-sm">
                                          {declaration.Commune.nom}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                      <h3 className="font-semibold text-lg mb-2">
                                        Célébrant
                                      </h3>
                                      <div className="grid grid-cols-2 gap-2">
                                        <p className="text-sm font-medium">
                                          Nom:
                                        </p>
                                        <p className="text-sm">
                                          {declaration.Celebrant?.nom}
                                        </p>
                                        <p className="text-sm font-medium">
                                          Prénom:
                                        </p>
                                        <p className="text-sm">
                                          {declaration.Celebrant?.prenom}
                                        </p>
                                        <p className="text-sm font-medium">
                                          Téléphone:
                                        </p>
                                        <p className="text-sm">
                                          {declaration.Celebrant?.telephone}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-semibold text-lg mb-2">
                                          Époux
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2">
                                          <p className="text-sm font-medium">
                                            Nom:
                                          </p>
                                          <p className="text-sm">
                                            {declaration.Epoux?.nom}
                                          </p>
                                          <p className="text-sm font-medium">
                                            Prénom:
                                          </p>
                                          <p className="text-sm">
                                            {declaration.Epoux?.prenom}
                                          </p>
                                          <p className="text-sm font-medium">
                                            Téléphone:
                                          </p>
                                          <p className="text-sm">
                                            {declaration.Epoux?.telephone}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="font-semibold text-lg mb-2">
                                          Épouse
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2">
                                          <p className="text-sm font-medium">
                                            Nom:
                                          </p>
                                          <p className="text-sm">
                                            {declaration.Epouse?.nom}
                                          </p>
                                          <p className="text-sm font-medium">
                                            Prénom:
                                          </p>
                                          <p className="text-sm">
                                            {declaration.Epouse?.prenom}
                                          </p>
                                          <p className="text-sm font-medium">
                                            Téléphone:
                                          </p>
                                          <p className="text-sm">
                                            {declaration.Epouse?.telephone}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                      <h3 className="font-semibold text-lg mb-2">
                                        Témoins
                                      </h3>
                                      {declaration.Temoins?.length > 0 ? (
                                        <div className="space-y-4">
                                          {declaration.Temoins.map(
                                            (temoin, index) => (
                                              <div
                                                key={index}
                                                className="grid grid-cols-2 gap-2 border-b pb-2 last:border-0"
                                              >
                                                <p className="text-sm font-medium">
                                                  Nom:
                                                </p>
                                                <p className="text-sm">
                                                  {temoin.nom}
                                                </p>
                                                <p className="text-sm font-medium">
                                                  Prénom:
                                                </p>
                                                <p className="text-sm">
                                                  {temoin.prenom}
                                                </p>
                                                <p className="text-sm font-medium">
                                                  Téléphone:
                                                </p>
                                                <p className="text-sm">
                                                  {temoin.telephone}
                                                </p>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-500">
                                          Aucun témoin enregistré
                                        </p>
                                      )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                        {declaration.Oppositions?.length > 0 ? (
                                          <AlertTriangle className="w-4 h-4 text-red-500" />
                                        ) : (
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                        Oppositions
                                      </h3>
                                      {declaration.Oppositions?.length > 0 ? (
                                        <div className="space-y-4">
                                          {declaration.Oppositions.map(
                                            (opposition, index) => (
                                              <div
                                                key={index}
                                                className="bg-red-50 p-3 rounded-md"
                                              >
                                                <p className="text-sm font-medium text-red-700">
                                                  Motif:
                                                </p>
                                                <p className="text-sm text-red-700">
                                                  {opposition.motif}
                                                </p>
                                                <p className="text-sm font-medium text-red-700 mt-2">
                                                  Date d'opposition:
                                                </p>
                                                <p className="text-sm text-red-700">
                                                  {formatDate(
                                                    opposition.date_opposition
                                                  )}
                                                </p>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                          <CheckCircle className="w-4 h-4" />
                                          Aucune opposition enregistrée
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                      <Mail className="w-4 h-4" />
                                      Envoyer un e-mail
                                    </h3>
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-sm font-medium mb-1">
                                          Destinataire:
                                        </p>
                                        <p className="text-sm bg-gray-100 p-2 rounded">
                                          {declaration.Utilisateur?.email ||
                                            "Email non disponible"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium mb-1">
                                          Objet:
                                        </p>
                                        <Input
                                          defaultValue={`Déclaration de mariage #${declaration.id_declaration}`}
                                          disabled
                                        />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium mb-1">
                                          Message:
                                        </p>
                                        <Textarea
                                          rows={12}
                                          placeholder="Saisissez votre message ici..."
                                          value={emailContent}
                                          onChange={(e) =>
                                            setEmailContent(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="flex justify-end">
                                        <Button
                                          onClick={() =>
                                            handleSendEmail(
                                              declaration.id_declaration
                                            )
                                          }
                                          disabled={
                                            isProcessing || !emailContent.trim()
                                          }
                                          className="flex items-center gap-2"
                                        >
                                          <Mail className="w-4 h-4" />
                                          {isProcessing
                                            ? "Envoi en cours..."
                                            : "Envoyer l'email"}
                                        </Button>
                                      </div>
                                      <div className="mt-4">
                                        <h3 className="font-bold">Messages precedents</h3>
                                        <ul className="space-y-4">
                                            {selectedDeclarationMessages.length == 0 && <p>Pas de message envoyes</p>}
                                            {selectedDeclarationMessages.map((msg, idx)=>{
                                              return <li key={idx.toString() + msg}>
                                                  <TextDisplay text={msg.contenu} sendDate={msg.date_envoi} />
                                              </li>
                                            })}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  {declaration.status === "en_attente" && (
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          handlePublish(
                                            declaration.id_declaration
                                          )
                                        }
                                      >
                                        <Send className="w-4 h-4" />
                                        Publier sur le banc
                                      </Button>

                                      <Button
                                        onClick={() =>
                                          handleApproveDeclaration(
                                            declaration.id_declaration
                                          )
                                        }
                                        disabled={isProcessing}
                                        className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                                      >
                                        <Check className="w-4 h-4" />
                                        {isProcessing
                                          ? "Traitement..."
                                          : "Approuver"}
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleRejectDeclaration(
                                            declaration.id_declaration
                                          )
                                        }
                                        disabled={isProcessing}
                                        className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                                      >
                                        <X className="w-4 h-4" />
                                        {isProcessing
                                          ? "Traitement..."
                                          : "Refuser"}
                                      </Button>
                                    </div>
                                  )}
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerDashboard;
