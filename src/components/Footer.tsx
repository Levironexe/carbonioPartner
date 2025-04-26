import React from "react";
import coal from "../assets/coal.webp";

const Footer = () => {
  return (
    <div>
      <footer className="w-full text-black my-10 sm:mb-12 md:mb-14 lg:mb-16 sm:p-4 md:p-6 px-4 sm:px-6 md:px-10 mt-36">
        <div className="relative flex max-w-6xl mx-auto rounded-[4px] shadow-carbon shadow-xl border-carbon border-2 pr-4 sm:pr-6 md:pr-8 lg:pr-12">
          <div className="relative flex-[1]">
            <div className="absolute bottom-0 -left-10">
              <img
                alt="coal"
                width="400"
                height="400"
                style={{ color: "transparent" }}
                src={coal}
              />
            </div>
          </div>
          <div className="flex-[1] flex flex-col justify-between gap-12 py-4 sm:py-6 md:py-8 lg:py-12">
            <div>
              <h2 className="text-4xl sm:text-4xl md:text-6xl text-purple-700 font-semibold">
                carbonio
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-[18px] w-full md:w-4/5">
                Transforming Carbon Footprint Auditing with the Power of Solana
                Blockchain Technology.
              </p>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-[18px]">
              © 2025 carbonio. All rights reserved.
            </p>
          </div>
          <div className="flex-[1] flex flex-col items-end justify-end gap-12 py-4 sm:py-6 md:py-8 lg:py-12">
            <div className="flex gap-8">
              <a
                href="https://www.instagram.com/levironhere/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-125 transition-all duration-200 text-purple-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com/your_mom"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-125 transition-all duration-200 text-purple-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/bao.nam.703289"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-125 transition-all duration-200 text-purple-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
            <div className="flex gap-8 text-[18px]">
              <div className="group relative transition-all duration-300">
                <div className="absolute inset-0 bg-carbon transition-all duration-300 group-hover:-bottom-2 group-hover:-right-2 rounded-[4px]"></div>
                <a className="relative" href="/cookies-policy">
                  <p className="p-4 shadow z-10 bg-white border-carbon border-2 rounded">
                    Cookies Policy
                  </p>
                </a>
              </div>
              <div className="group relative transition-all duration-300">
                <div className="absolute inset-0 bg-carbon transition-all duration-300 group-hover:-bottom-2 group-hover:-right-2 rounded-[4px]"></div>
                <a className="relative" href="/privacy-policy">
                  <p className="p-4 shadow z-10 bg-white border-carbon border-2 rounded">
                    Privacy Policy
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
