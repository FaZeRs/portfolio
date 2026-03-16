import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { queryKeys } from "~/lib/query-keys";
import { $getAllPublicServices } from "~/lib/server";
import ServiceCard from "./service-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Services() {
  const { data: services } = useSuspenseQuery({
    queryKey: queryKeys.service.listPublic(),
    queryFn: () => $getAllPublicServices(),
  });

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col items-center px-1 text-center sm:mb-10">
        <motion.span
          animate={{ opacity: 1 }}
          className="mb-3 font-medium text-primary text-sm uppercase tracking-widest"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          What I Offer
        </motion.span>
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-3xl tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          Services That Drive Results
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          From concept to deployment, I provide end-to-end development services
          tailored to your business needs.
        </motion.p>
      </div>

      <motion.div
        animate="visible"
        className="flex flex-col gap-4 sm:gap-8"
        initial="hidden"
        variants={containerVariants}
        viewport={{ once: true }}
        whileInView="visible"
      >
        {services.map((service) => (
          <motion.div key={service.slug} variants={itemVariants}>
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
