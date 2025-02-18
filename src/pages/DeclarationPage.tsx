import Authentification from "@/components/authentification";
import Stepper from "@/components/stepper";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import logoImg from "../assets/logo.png";

function DeclarationPage() {
  const [activeTap, setTap] = useState(0);
  const taps = useMemo(() => ["Authentification", "Verification"], []);

  const onTapChange = (newIndex: number) => {
    setTap(newIndex);
  };

  return (
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
          elements={taps} 
          className="mt-8 overflow-x-scroll scroll-smooth scroll"
        />
        <div className="flex justify-center">
          <Authentification onSubmit={()=> onTapChange(1)} className="mt-12 max-w-sm sm:max-w-md w-full"/>
        </div>
      </div>
    </div>
  );
}

export default DeclarationPage;
