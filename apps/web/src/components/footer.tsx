import { siteConfig, socialConfig } from "@acme/config";
import Icon from "@acme/ui/icon";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="relative mt-20 border-t bg-muted/30">
    {/* Decorative gradient */}
    <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

    <div className="container py-12 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex flex-col items-center gap-8">
        {/* Social links */}
        <div className="flex items-center gap-3">
          {socialConfig.map((social) => (
            <a
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:shadow-md"
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
              title={social.name}
            >
              <Icon className="h-4 w-4" icon={social.icon} />
            </a>
          ))}
        </div>

        {/* Copyright and links */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="flex items-center gap-1 text-muted-foreground text-sm">
            Built with <Heart className="h-4 w-4 text-red-500" /> by{" "}
            <a
              className="font-medium text-foreground transition-colors hover:text-primary"
              href={siteConfig.links.twitter}
              rel="noreferrer"
              target="_blank"
            >
              {siteConfig.author.name}
            </a>
          </p>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <a
              className="transition-colors hover:text-foreground"
              href="https://vercel.com"
              rel="noreferrer"
              target="_blank"
            >
              Hosted on Vercel
            </a>
            <span>•</span>
            <a
              className="transition-colors hover:text-foreground"
              href={siteConfig.links.githubRepo}
              rel="noreferrer"
              target="_blank"
            >
              View Source
            </a>
          </div>
        </div>

        {/* Year */}
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} {siteConfig.title}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
