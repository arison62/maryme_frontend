import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import CircularProgressIndicator from "./ui/circular-progress-indicator";
import { FormEvent, useEffect, useState} from "react";
import { post } from "@/api/client";

type Data = {
  error: boolean | string | undefined;
  message: string | undefined;
};

function Authentification({
  index,
  className,
  onSubmit,
}: {
  index: number;
  className?: string;
  onSubmit: (value?: unknown) => void;
}) {

  const [isProgress, setIsProgess] = useState(false);
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string | undefined>(undefined);


  useEffect(() => {

    if(isProgress){
    setIsProgess(true)
    async function sendOtp() {
        const data = await post<Data>("/user/auth/token", {
            email: email
        });
        if (typeof data.data.error == "boolean" && data.data.error == false) {
          onSubmit(index);
        } else if (data.data.error == "INVALID EMAIL") {
          setError(
            "Votr adresse electronique n'est pas valide verifier l'orthographe"
          );
        } else if (data.data.error == "INTERNAL ERROR") {
          setError("Erreur du serveur ressayer plustart");
        } else {
            console.log(data)
          setError("Oups quelque chose a mal fonctionne");
        }
  
        setIsProgess(false)
      }
      sendOtp()
    }
    
  }, [index, isProgress, onSubmit]);

  function onSubmitHandler(event : FormEvent){
    event.preventDefault()
    setIsProgess(true)
  }
  return (
    <div className={clsx(className)}>
      <h1 className="text-2xl font-bold text-green-950">Authentification</h1>
      <p className="text-slate-500 mt-2">
        Accedez au portail de declaration de mariage
      </p>
      <form className="flex flex-col gap-2 mt-8" onSubmit={onSubmitHandler}>
        <Label htmlFor="email">Entrez votre adresse electronique</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          placeholder="jeanmarie@gamil.com"
          required={true}
          disabled={isProgress}
        />
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex justify-end mt-2">
          <Button disabled={isProgress}>
            {isProgress ? (
              <>
                <CircularProgressIndicator /> Chargement
              </>
            ) : (
              <>Valider</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Authentification;
