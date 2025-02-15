import {useState, useEffect} from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import CircularProgressIndicator from "./ui/circular-progress-indicator";
import { post } from "@/api/client";

function CheckOTP() {
  const [isProgess, setIsProgess] = useState(false);
  const [isFirstRender, setFirstRender] = useState(true)
  const [otp, setOtp] = useState<string | null>(null)
  const [data, setData]= useState(undefined)

  useEffect(()=>{
    

    (async function(){
      if(!isFirstRender){
        setIsProgess(true);
        const result = await post<{
          error: string | boolean,
          data: any
        }>("/auth/user/token", {
          email:"legrandpone1@gmail.com",
          otp: otp
        })
        console.log(result)
        setData(result)
        setIsProgess(false)
      }else{
        setFirstRender(false)
      }
        
    })()
   
  },[otp])
  console.log(isProgess)
  return (
    <div className="relative flex min-w-full
    items-center justify-center h-full
    ">
      
      <div>
        <InputOTP maxLength={6} onComplete={(otp) => setOtp(otp)} disabled={isProgess}>
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
      {isProgess && (
         <div className="absolute min-w-full
         flex items-center justify-center h-full
         bg-slate-300 opacity-50 shadow-lg p-8
         ">
           <div>
              <CircularProgressIndicator className="fill-green-600"/>
           </div>
          
         </div>
      )}
     
    </div>
  );
}

export default CheckOTP;
