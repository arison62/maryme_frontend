import { useState } from "react";
import { Link } from "react-router";
import logoImg from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useWindowPosition from "@/hooks/use-scrollposition";

const dossiers = [
  {
    titre: "Celebrant",
    description: "Un seul celebrant",
    modalites: [
      "Une copie certifiee de la carte nationale d'identite",
      "Une copie certifiee de l'acte de naissance",
    ],
  },

  {
    titre: "Mariés",
    description: "Chaque conjoint a son dossier unique",
    modalites: [
      "Une copie certifiee de la carte nationale d'identite",
      "Une copie certifiee de l'acte de naissance",
      "04 photos au format 4x4",
      "Une attestation de divorce pour le conjoint marie par le passe",
    ],
  },
  {
    titre: "Temoins",
    description: "Chaque temoin a son dossier unique",
    modalites: [
      "Une copie certifiee de la carte nationale d'identite",
      "Une copie certifiee de l'acte de naissance",
    ],
  },
];

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const windowPosition = useWindowPosition();
  return (
    <div className="h-screen relative scroll-smooth">
      <div
        className={`fixed w-full border-b 
        border-slate-200 shadow-sm flex 
        justify-between items-center
         h-[72px] px-4 z-20 ${windowPosition > 400 ? "bg-white" : ""}`}
      >
        <div className="flex flex-row gap-1 text-green-700 items-baseline w-fit">
          <Link to="/">
            <img src={logoImg} alt="Logo image" className="w-8" />
          </Link>
          <span className="text-2xl font-bold block">Maryme</span>
        </div>
        <div className="flex gap-4 items-baseline relative">
          <div className="md:hidden">
            <div>
              {isMenuOpen ? (
                <X
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                />
              ) : (
                <Menu
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                />
              )}
            </div>
            <div
              className={`${
                isMenuOpen ? "flex" : "hidden"
              } flex-col gap-4 absolute min-w-[300px] top-12 right-0 bg-white p-4 rounded-md shadow-lg`}
            >
              <span>Informations Generales</span>
              <Link to="/login">Se connecter</Link>
              <Link to="/officier/login">Officier</Link>
              <Button>
                <Link to="/declaration">Declarer un Mariage</Link>
              </Button>
            </div>
          </div>
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex gap-6 items-baseline">
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Informations Generales
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/officier/login">Officier</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/login">Se connecter</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button>
                  <Link to="/declaration">Declarer un Mariage</Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="relative mask h-[500px]"></div>
      <div>
        <p className="text-4xl font-semibold text-green-700 text-center">
          Simplifiez la gestion de vos declaration de Mariage
        </p>
      </div>
      <div className="max-container mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Constitution du dossier physique
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3">
          {dossiers.map((dossier, idx) => (
            <Card key={idx} className="h-fit">
              <CardHeader>
                <CardTitle>{dossier.titre}</CardTitle>
                <CardDescription>{dossier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-8 mb-8">
                  {dossier.modalites.map((mod, idx) => (
                    <li key={idx} className="flex gap-4 items-baseline">
                      <span className="w-2 h-2 bg-green-500 block rounded-full"></span>
                      <div>{mod}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Link to="/declaration">Commencer</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="h-[600px] bg-green-600 mt-24"></div>
    </div>
  );
}

export default HomePage;
