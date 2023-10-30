import Image from 'next/image'

import iconWebDevelopment from '~/app/_assets/icon-web-development.svg'
import iconAppDevelopment from '~/app/_assets/icon-app-development.svg'
import iconServer from '~/app/_assets/icon-server.svg'
import iconSeo from '~/app/_assets/icon-seo.svg'
import iconMobile from '~/app/_assets/icon-mobile.svg'
import iconEmail from '~/app/_assets/icon-email.svg'


interface Service {
  title: string
  description: string
  icon: string
}

const services: Service[] = [
  {
    title: 'Web Development',
    description: 'Modern and mobile-ready website that will help you reach all of your marketing.',
    icon: iconWebDevelopment,
  },
  {
    title: 'Application Development',
    description: 'User-friendly desktop application development to boost your productivity.',
    icon: iconAppDevelopment,
  },
  {
    title: 'Mobile Development',
    description: 'Mobile application development is a highlight that businesses are interested in.',
    icon: iconMobile,
  },
  {
    title: 'Email Marketing',
    description: 'Email marketing is a service that is needed by many companies to keep their business running.',
    icon: iconEmail,
  },
  {
    title: 'SEO',
    description: 'SEO is a service that is needed by many companies to keep their business running.',
    icon: iconSeo,
  },
  {
    title: 'Server Management',
    description: 'Server management is a service that is needed by many companies to keep their business running.',
    icon: iconServer,
  },
]

const Services = () => {
  return (
    <div className="container py-16 md:py-20 mx-auto dark:text-white text-primary px-8">
      <h2
        className="
          text-center
          text-4xl
          font-semibold
          text-indigo-700
          uppercase
          sm:text-5xl
          lg:text-6xl
          font-header
        "
      >
        Here's what I'm good at
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
            className="group rounded px-8 py-12 shadow dark:bg-gray-800 dark:hover:bg-indigo-700 hover:bg-indigo-700 transform transition-all hover:scale-105"
          >
            <div className="mx-auto h-24 w-24 text-center xl:h-28 xl:w-28">
              <div className="block">
                <Image
                  src={service.icon}
                  alt={service.title}
                  loading="lazy"
                  width="150"
                  height="150"
                  className="dark:grayscale-0 dark:invert group-hover:invert"
                />
              </div>
            </div>
            <div className="text-center">
              <h3
                className="
                  pt-8
                  text-lg
                  font-semibold
                  text-indigo-700
                  dark:text-indigo-500
                  uppercase
                  group-hover:text-yellow-400
                  lg:text-xl
                "
              >
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 pt-4 text-sm group-hover:text-white md:text-base">
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