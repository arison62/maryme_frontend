import { useState, useEffect } from 'react';

const ComingSoon = () => {
  const [days, setDays] = useState<string | number>('00');
  const [hours, setHours] = useState<string | number>('00');
  const [minutes, setMinutes] = useState<string | number>('00');
  const [seconds, setSeconds] = useState<string | number>('00');
  const [dest, setDest] = useState(new Date("february 28, 2025 23:59:59").getTime());

  useEffect(() => {
    const x = setInterval(() => {
      const now = new Date().getTime();
      const diff = dest - now;

      if (diff <= 0) {
        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

        if (nextMonthDate.getMonth() === 0) {
          nextMonthDate.setFullYear(nextMonthDate.getFullYear() + 1);
        }

        setDest(nextMonthDate.getTime());
        return;
      }

      let newDays : string | number = Math.floor(diff / (1000 * 60 * 60 * 24));
      let newHours : string | number = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let newMinutes: string | number = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let newSeconds : string | number = Math.floor((diff % (1000 * 60)) / 1000);

      newDays = newDays < 10 ? `0${newDays}` : newDays;
      newHours = newHours < 10 ? `0${newHours}` : newHours;
      newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;
      newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds;

      setDays(newDays);
      setHours(newHours);
      setMinutes(newMinutes);
      setSeconds(newSeconds);
    }, 10);

    return () => clearInterval(x);
  }, [dest]);

  return (
    <section className="relative h-full">
      <div className="w-full h-full">
        <div className="w-full bg-green-50 flex-col justify-center h-full lg:gap-28 md:gap-16 gap-10 inline-flex">
          <div className="flex-col justify-end items-center lg:gap-16 gap-10 flex">
            <img src="/logo.svg" alt="maryme logo image" className="object-cover w-24" />
            <div className="flex-col justify-center items-center gap-10 flex">
              <div className="flex-col justify-start items-center gap-2.5 flex">
                <h2 className="text-center text-green-700 md:text-6xl text-5xl font-bold font-manrope leading-normal">Coming Soon</h2>
                <p className="text-center text-gray-500 text-base font-normal leading-relaxed">Just {days} days remaining until the big reveal of our new product!</p>
              </div>
              <div className="flex items-start justify-center w-full gap-2 count-down-main">
                <div className="timer flex flex-col gap-0.5">
                  <div>
                    <h3 className="countdown-element days text-center text-black text-2xl font-bold font-manrope leading-9">{days}</h3>
                  </div>
                  <p className="text-center text-gray-500 text-xs font-normal leading-normal w-full">DAYS</p>
                </div>
                <h3 className="w-3 text-center text-gray-500 text-2xl font-medium font-manrope leading-9">:</h3>
                <div className="timer flex flex-col gap-0.5">
                  <div>
                    <h3 className="countdown-element hours text-center text-black text-2xl font-bold font-manrope leading-9">{hours}</h3>
                  </div>
                  <p className="text-center text-gray-500 text-xs font-normal leading-normal w-full">HRS</p>
                </div>
                <h3 className="w-3 text-center text-gray-500 text-2xl font-medium font-manrope leading-9">:</h3>
                <div className="timer flex flex-col gap-0.5">
                  <div>
                    <h3 className="countdown-element minutes text-center text-black text-2xl font-bold font-manrope leading-9">{minutes}</h3>
                  </div>
                  <p className="text-center text-gray-500 text-xs font-normal leading-normal w-full">MINS</p>
                </div>
                <h3 className="w-3 text-center text-gray-500 text-2xl font-medium font-manrope leading-9">:</h3>
                <div className="timer flex flex-col gap-0.5">
                  <div>
                    <h3 className="countdown-element seconds text-center text-black text-2xl font-bold font-manrope leading-9">{seconds}</h3>
                  </div>
                  <p className="text-center text-gray-500 text-xs font-normal leading-normal w-full">SECS</p>
                </div>
              </div>
              <div className="w-full flex-col justify-center items-center gap-5 flex">
                <h6 className="text-center text-emerald-400 text-base font-semibold leading-relaxed">Launched Date: Feb 28, 2025</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;