import type { AuthProvider, SiteConfig, Social } from "@acme/types";
import { siFacebook, siGithub, siGoogle, siLinkedin, siX } from "simple-icons";

export const siteConfig: SiteConfig = {
  title: "Nauris Linde",
  name: "naurislinde",
  description:
    "Full-Stack Developer specializing in custom websites, web applications, and business software solutions. Helping businesses grow with modern, scalable, and high-performance digital products.",
  keywords:
    "Nauris Linde, Full-Stack Developer, Custom Website Development, Web Application Development, Business Software Solutions, React Developer, TypeScript Expert, Hire Web Developer, Freelance Developer",
  url: "https://naurislinde.dev",
  links: {
    mail: "naurislinde@gmail.com",
    twitter: "https://twitter.com/naurislinde",
    github: "https://github.com/fazers",
    githubRepo: "https://github.com/fazers/portfolio",
  },
  author: {
    name: "Nauris Linde",
    email: "naurislinde@gmail.com",
    url: "https://naurislinde.dev",
    handle: "@naurislinde",
  },
  calendlyUrl: "https://calendly.com/naurislinde/30min",
};

export const socialConfig: Social[] = [
  {
    name: "Twitter",
    url: "https://twitter.com/naurislinde",
    username: "naurislinde",
    icon: siX,
  },
  {
    name: "Github",
    url: "https://github.com/fazers",
    username: "fazers",
    icon: siGithub,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/naurislinde/",
    username: "naurislinde",
    icon: siLinkedin,
  },
];

export const authProviders: AuthProvider[] = [
  {
    label: "GitHub",
    icon: siGithub,
    provider: "github",
  },
  {
    label: "Twitter (X)",
    icon: siX,
    provider: "twitter",
  },
  {
    label: "Google",
    icon: siGoogle,
    provider: "google",
  },
  {
    label: "Facebook",
    icon: siFacebook,
    provider: "facebook",
  },
];
