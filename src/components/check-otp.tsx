import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import CircularProgressIndicator from "./ui/circular-progress-indicator";
import { post } from "@/api/client";
import clsx from "clsx";
import { TapContext } from "@/pages/DeclarationPage";

function CheckOTP({
  key,
  className,
  index,
}: {
  key?: React.Key;
  className?: string;
  index: number;
}) {
  const [isProgess, setIsProgess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [otp, setOtp] = useState("");
  const { setActiveTap } = React.useContext(TapContext);


  useEffect(() => {
    async function checkOpt() {
      if (isProgess) {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          const response = await post<{ token: string }>("/user/auth/login", {
            email: userEmail,
            otp: otp,
          });
          console.log("response", response);
          if (typeof response.error == "boolean" && response.error == false) {
            console.log("response.data.token", response.data.token);
            localStorage.setItem("token", response.data.token);
            setActiveTap(index + 1);
          } else if (
            typeof response.error == "string" &&
            response.error == "INVALID TOKEN"
          ) {
            setErrorMessage("Votre code est invalide");
          } else if (
            typeof response.error == "string" &&
            response.error == "EXPIRED TOKEN"
          ) {
            setErrorMessage("Votre code a expire");
          } else {
            setErrorMessage(
              response.message ?? "Oups quelque chose a mal fonctionne"
            );
          }
        } else {
          setErrorMessage("Email invalide redemandez le code");
        }

        setIsProgess(false);
      }
    }

    checkOpt();
  }, [isProgess]);

  return (
    <div
      key={key}
      className={clsx(
        "relative flex items-center flex-col justify-center gap-8 h-full",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-950">Verification</h2>
        <p className="text-slate-600">
          Vérifiez votre boîte mail ou spam pour le code de 6 chiffres. Il
          expire dans 5 minutes.
        </p>
      </div>
      <div>
        <InputOTP
          maxLength={6}
          onComplete={(otp) => {
            setOtp(otp);
            setIsProgess(true);
            console.log(otp);
          }}
          disabled={isProgess}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSeparator />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      {isProgess && (
        <div
          className="absolute min-w-full
         flex items-center justify-center h-full
         bg-slate-300 opacity-50 shadow-lg p-8
         "
        >
          <div>
            <CircularProgressIndicator className="fill-green-600" />
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckOTP;
