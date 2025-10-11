import { Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "~/lib/config/site";
import ContactModal from "../contact-modal";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";

export default function ServiceContact() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <Card className="border-2 border-dashed">
        <CardHeader>
          <h3 className="font-semibold text-xl">Ready to get started?</h3>
          <CardDescription>
            Let's discuss your project and see how I can help bring your ideas
            to life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="group flex-1"
              onClick={() => setIsContactModalOpen(true)}
              size="lg"
              variant="default"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send a Message
            </Button>
            <Button
              asChild
              className="group flex-1"
              size="lg"
              variant="secondary"
            >
              <a
                href={siteConfig.calendlyUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book a Meeting
              </a>
            </Button>
          </div>
          <p className="mt-4 text-center text-muted-foreground text-sm">
            Or email me directly at{" "}
            <a
              className="underline hover:text-foreground"
              href={`mailto:${siteConfig.links.mail}`}
            >
              {siteConfig.links.mail}
            </a>
          </p>
        </CardContent>
      </Card>

      <ContactModal
        onOpenChange={setIsContactModalOpen}
        open={isContactModalOpen}
      />
    </>
  );
}
