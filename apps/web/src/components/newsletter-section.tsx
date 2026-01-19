import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/lib/trpc";

export default function NewsletterSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const trpc = useTRPC();

  const { mutateAsync, isPending } = useMutation({
    ...trpc.emailMarketing.subscribe.mutationOptions(),
    onSuccess: (data) => {
      formRef.current?.reset();
      setEmail("");
      if (data.alreadySubscribed) {
        toast.info("You're already subscribed to our newsletter!");
      } else if (data.reactivated) {
        toast.success("Welcome back! Your subscription has been reactivated.");
      } else {
        toast.success("Thanks for subscribing!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    await mutateAsync({ email: email.trim() });
  };

  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-5 sm:rounded-3xl sm:p-8 md:p-12">
        {/* Background decorations */}
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-pink-500/10 to-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          {/* Header */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col items-center sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-3 font-medium text-primary text-sm uppercase tracking-widest">
              Stay Updated
            </span>
            <h2 className="font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl">
              Join the newsletter
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
              Get exclusive insights on web development, new project releases,
              and tips delivered straight to your inbox.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap justify-center gap-4 text-muted-foreground text-sm sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Weekly insights
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              No spam
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Unsubscribe anytime
            </span>
          </motion.div>

          {/* Form */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div className="relative flex flex-1 items-center">
                <Mail className="pointer-events-none absolute left-3 z-10 h-4 w-4 text-muted-foreground" />
                <Input
                  aria-label="Email address"
                  className="h-11 border-border/50 bg-background/80 pl-10 backdrop-blur-sm"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                />
              </div>
              <Button
                className="group h-11"
                disabled={isPending}
                type="submit"
                variant="default"
              >
                {isPending ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
            <p className="mt-4 text-muted-foreground/70 text-xs">
              Join 500+ developers. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
