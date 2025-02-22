import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import CircularProgressIndicator from "./ui/circular-progress-indicator";
import { FormEvent, useContext, useEffect, useState } from "react";
import { post } from "@/api/client";
import { TapContext } from "@/pages/DeclarationPage";

type Data = {
  error: boolean | string | undefined;
  message: string | undefined;
};

function Authentification({
  key,
  index,
  className,

}: {
  key?: React.Key;
  index: number;
  className?: string;
}) {
  const [isProgress, setIsProgess] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const {setActiveTap} = useContext(TapContext);

  useEffect(() => {
    if (isProgress) {
      setIsProgess(true);
      async function sendOtp() {
        const data = await post<Data>("/user/auth/token", {
          email: email,
        });
        if (
          (typeof data.error == "boolean" && data.error == false) ||
          data.error == undefined
        ) {
          localStorage.setItem("userEmail", email);
          setActiveTap(index + 1);
        } else if (data.error == "INVALID EMAIL") {
          setError(
            "Votr adresse electronique n'est pas valide verifier l'orthographe"
          );
        } else if (data.error == "INTERNAL ERROR") {
          setError("Erreur du serveur ressayer plustart");
        } else {
          setError(data.message)
        }

        setIsProgess(false);
      }
      sendOtp();
    }
  }, [isProgress]);

  function onSubmitHandler(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    setEmail(email.trim());
    setIsProgess(true);
  }
  return (
    <div key={key} className={clsx(className)}>
      <h2 className="text-2xl font-bold text-green-950">Authentification</h2>
      <p className="text-slate-500 mt-2">
        Accedez au portail de declaration de mariage
      </p>
      <form className="flex flex-col gap-2 mt-8" onSubmit={onSubmitHandler}>
        <Label htmlFor="email">Entrez votre adresse electronique</Label>
        <Input
          id="email"
          name="email"
          type="email"
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
