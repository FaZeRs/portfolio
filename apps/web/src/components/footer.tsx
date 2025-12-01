import { siteConfig } from "@acme/config";

const Footer = () => (
  <footer className="border-t">
    <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
      <p className="text-center text-sm leading-loose md:text-left">
        Built by{" "}
        <a
          className="font-medium underline underline-offset-4"
          href={siteConfig.links.twitter}
          rel="noreferrer"
          target="_blank"
        >
          {siteConfig.author.name}
        </a>
        . Hosted on{" "}
        <a
          className="font-medium underline underline-offset-4"
          href="https://vercel.com"
          rel="noreferrer"
          target="_blank"
        >
          Vercel
        </a>
        . The source code is available on{" "}
        <a
          className="font-medium underline underline-offset-4"
          href={siteConfig.links.githubRepo}
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  </footer>
);

export default Footer;
