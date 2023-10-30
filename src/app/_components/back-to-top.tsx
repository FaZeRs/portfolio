"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScrollButtonVisibility = () => {
      window.scrollY > 300 ? setVisible(true) : setVisible(false);
    };

    window.addEventListener("scroll", handleScrollButtonVisibility);

    return () => {
      window.removeEventListener("scroll", handleScrollButtonVisibility);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="
        fixed
        bottom-0
        right-0
        z-50
        mb-6
        mr-8
        flex
        items-center
        space-x-2
        sm:space-x-4
      "
    >
      <button
        id="back-to-top"
        className="
        ring-none
        flex
        transform
        cursor-pointer
        items-center
        rounded-full
        border-none
        bg-indigo-500
        p-2
        text-white
        outline-none
        transition
        duration-500
        hover:scale-110
        hover:bg-indigo-600
        hover:shadow-sm
      "
        onClick={scrollToTop}
      >
        <ChevronUpIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default BackToTop;
