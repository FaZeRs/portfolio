import Image from "next/image";

interface Service {
  title: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  {
    title: "Web Development",
    description:
      "Modern and mobile-ready website that will help you reach all of your marketing.",
    icon: "/images/icon-web-development.svg",
  },
  {
    title: "Application Development",
    description:
      "User-friendly desktop application development to boost your productivity.",
    icon: "/images/icon-app-development.svg",
  },
  {
    title: "Mobile Development",
    description:
      "Mobile application development is a highlight that businesses are interested in.",
    icon: "/images/icon-mobile.svg",
  },
  {
    title: "Email Marketing",
    description:
      "Email marketing is a service that is needed by many companies to keep their business running.",
    icon: "/images/icon-email.svg",
  },
  {
    title: "SEO",
    description:
      "SEO is a service that is needed by many companies to keep their business running.",
    icon: "/images/icon-seo.svg",
  },
  {
    title: "Server Management",
    description:
      "Server management is a service that is needed by many companies to keep their business running.",
    icon: "/images/icon-server.svg",
  },
];

const Services = () => {
  return (
    <div className="text-primary container mx-auto px-8 py-16 dark:text-white md:py-20">
      <h2
        className="
          font-header
          text-center
          text-4xl
          font-semibold
          uppercase
          text-indigo-700
          sm:text-5xl
          lg:text-6xl
        "
      >
        Here&apos;s what I&apos;m good at
      </h2>
      <h3
        className="
          pt-6
          text-center
          text-xl
          font-medium
          sm:text-2xl
          lg:text-3xl
        "
      >
        These are the services I offer
      </h3>

      <div
        className="
          grid grid-cols-1
          gap-6
          pt-10
          sm:grid-cols-2
          md:gap-10 md:pt-12
          lg:grid-cols-3
        "
      >
        {services.map((service) => (
          <div
            key={service.title}
            className="group transform rounded px-8 py-12 shadow transition-all hover:scale-105 hover:bg-indigo-700 dark:bg-gray-800 dark:hover:bg-indigo-700"
          >
            <div className="mx-auto h-24 w-24 text-center xl:h-28 xl:w-28">
              <div className="block">
                <Image
                  src={service.icon}
                  alt={service.title}
                  loading="lazy"
                  width="150"
                  height="150"
                  className="group-hover:invert dark:grayscale-0 dark:invert"
                />
              </div>
            </div>
            <div className="text-center">
              <h3
                className="
                  pt-8
                  text-lg
                  font-semibold
                  uppercase
                  text-indigo-700
                  group-hover:text-yellow-400
                  dark:text-indigo-500
                  lg:text-xl
                "
              >
                {service.title}
              </h3>
              <p className="pt-4 text-sm text-slate-600 group-hover:text-white dark:text-slate-300 md:text-base">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
