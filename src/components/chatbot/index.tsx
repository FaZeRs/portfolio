import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { lazy, Suspense, useCallback, useState } from "react";
import { Button } from "~/components/ui/button";

const ChatbotContent = lazy(() => import("./content"));

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <motion.div
        animate={{ scale: 1 }}
        className="fixed right-6 bottom-6 z-50"
        initial={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          className="h-12 w-12 rounded-full border border-primary/20 bg-gradient-to-br from-primary to-primary/80 shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/90 hover:to-primary/70 hover:shadow-2xl"
          onClick={handleOpen}
          onMouseEnter={() => {
            import("./content");
          }}
          size="lg"
        >
          <MessageCircle className="h-16 w-16 text-primary-foreground" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen ? (
          <Suspense fallback={null}>
            <ChatbotContent setIsOpen={handleClose} />
          </Suspense>
        ) : null}
      </AnimatePresence>
    </>
  );
}
