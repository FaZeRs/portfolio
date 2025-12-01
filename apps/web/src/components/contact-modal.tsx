import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { ContactForm } from "./contact-form";

type ContactModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContactModal({
  open,
  onOpenChange,
}: Readonly<ContactModalProps>) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send me a message</DialogTitle>
          <DialogDescription>
            Fill out the form below and I'll get back to you as soon as
            possible.
          </DialogDescription>
        </DialogHeader>

        <ContactForm onMessageSent={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
