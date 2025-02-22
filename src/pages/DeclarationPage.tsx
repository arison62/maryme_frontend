import Authentification from "@/components/authentification";
import Stepper from "@/components/stepper";
import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import logoImg from "../assets/logo.png";
import CheckOTP from "@/components/check-otp";
import { Button } from "@/components/ui/button";

const TapContext = React.createContext({
  activeTap: 0,
  setActiveTap: (value: number) => {},
});

const tabs = [
  {
    name: "Authentification",
    component: <Authentification index={0} className="max-w-md w-full mt-8"/>,
  },
  {
    name: "Verification",
    component: <CheckOTP index={1} className="max-w-xl w-full mt-8" />,
  },  
]
function DeclarationPage() {
  const [activeTap, setTap] = useState(0);

  const tabNames = useMemo(() => tabs.map((tab) => tab.name), []);
  console.log("activeTap", activeTap);
  return (
    <TapContext.Provider
      value={{
        activeTap,
        setActiveTap: (tap) => {
          console.log("tap");
          setTap(tap);
        },
      }}
    >
      <div className="h-screen">
        <div className=" bg-green-500">
          <div className="flex h-[80px] max-container items-center">
            <div className="flex flex-row gap-1 text-green-950 items-baseline w-fit">
              <Link to="/">
                <img src={logoImg} alt="Logo image" className="w-8" />
              </Link>
              <span className="text-2xl font-bold block">Maryme</span>
            </div>
          </div>
        </div>
        <div className="max-container">
          <Stepper
            activeIndex={activeTap}
            elements={tabNames}
            className="mt-8 overflow-x-scroll scroll-smooth scroll"
          />
          <div className="flex justify-center items-center flex-col">
            {tabs[activeTap].component}
            <div className="flex max-w-xl w-full">
              {activeTap >= 1 && (
                <div className="mt-8 max-w-md borde w-full">
                  <Button
                    variant={"outline"}
                    onClick={() => setTap(activeTap - 1)}
                  >
                    Retour
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TapContext.Provider>
  );
}

export { TapContext };
export default DeclarationPage;
