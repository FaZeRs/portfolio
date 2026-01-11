import { motion } from "framer-motion";
import { Briefcase, Clock, Star, Users } from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: "10+",
    label: "Projects Delivered",
    description: "Across various industries",
  },
  {
    icon: Users,
    value: "5+",
    label: "Happy Clients",
    description: "Startups to enterprises",
  },
  {
    icon: Clock,
    value: "10+",
    label: "Years Experience",
    description: "Building web solutions",
  },
  {
    icon: Star,
    value: "100%",
    label: "Satisfaction Rate",
    description: "Based on client feedback",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const TrustIndicators = () => {
  return (
    <section className="w-full py-8 sm:py-16">
      <motion.div
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8"
        initial="hidden"
        variants={containerVariants}
        viewport={{ once: true }}
        whileInView="visible"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              className="group relative overflow-hidden rounded-2xl border bg-card p-4 text-center transition-all hover:border-foreground/20 hover:shadow-lg sm:p-6"
              key={stat.label}
              variants={itemVariants}
            >
              {/* Background gradient on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 sm:mb-3 sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <p className="font-bold text-2xl tracking-tight sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-medium text-foreground text-sm sm:text-base">
                  {stat.label}
                </p>
                <p className="mt-0.5 hidden text-muted-foreground text-sm sm:block">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default TrustIndicators;
