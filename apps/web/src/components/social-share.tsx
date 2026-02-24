import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import Icon from "@acme/ui/icon";
import { Mail, Share2 } from "lucide-react";
import { siFacebook, siLinkedin, siX, siYcombinator } from "simple-icons";

interface SocialShareProps {
  text?: string;
  url: string;
}

const SocialShare = ({ url, text }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = text ? encodeURIComponent(text) : "";

  const shareLinks = [
    {
      name: "Twitter",
      icon: siX,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "Facebook",
      icon: siFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: siLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Hacker News",
      icon: siYcombinator,
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}`,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" size="sm" variant="outline">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareLinks.map((link) => (
          <DropdownMenuItem asChild key={link.name}>
            <a
              className="flex items-center gap-3"
              href={link.href}
              rel="noreferrer noopener"
              target="_blank"
            >
              <Icon className="h-4 w-4" icon={link.icon} />
              {link.name}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <a
            className="flex items-center gap-3"
            href={`mailto:?subject=${encodedText}&body=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
