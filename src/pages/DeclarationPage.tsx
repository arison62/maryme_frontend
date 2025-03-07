import Authentification from "@/components/authentification";
import Stepper from "@/components/stepper";
import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import logoImg from "../assets/logo.png";
import CheckOTP from "@/components/check-otp";
import { DeclarationProvider } from "@/components/declaration_form/declaration_provider";
import ConjointForm from "@/components/declaration_form/conjoint_form";
import MariageForm from "@/components/declaration_form/mariage_form";
import TemoinForm from "@/components/declaration_form/temoin_form";
import Confirmation from "@/components/declaration_form/confirmation_form";

const TapContext = React.createContext({
  activeTap: 0,
  setActiveTap: (value: number) => {
    console.log("value", value);
  },
});

const tabs = [
  {
    name: "Authentification",
    component: <Authentification index={0} className="max-w-md w-full mt-8" />,
  },
  {
    name: "Verification",
    component: <CheckOTP index={1} className="max-w-xl w-full mt-8" />,
  },

  {
    name: "Informations des mariés",
    component: <ConjointForm index={2} className="w-full mt-8" />,
  },
  {
    name: "Informatio sur le Celebrant",
    component: <MariageForm index={3} className="w-full mt-8"/>
  },
  {
    name: "Informations sur les témoins",
    component: <TemoinForm index={4} className="w-full mt-8" />,
  },
  {
    name: "Confirmation",
    component: <Confirmation index={5} className="w-full mt-8" />
  }
];
function DeclarationPage() {
  const [activeTap, setTap] = useState(5);

  const tabNames = useMemo(() => tabs.map((tab) => tab.name), []);
  console.log("activeTap", activeTap);
  return (
    <DeclarationProvider>
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
            </div>
          </div>
        </div>
      </TapContext.Provider>
    </DeclarationProvider>
  );
}

export { TapContext };
export default DeclarationPage;
