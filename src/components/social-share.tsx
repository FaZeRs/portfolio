import { Mail } from "lucide-react";
import { siFacebook, siLinkedin, siX, siYcombinator } from "simple-icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Icon from "./ui/icon";

interface SocialShareProps {
  url: string;
  text?: string;
}

const SocialShare = ({ url, text }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Share</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Share Post</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Icon icon={siX} className="mr-2 h-3 w-3" />
            Twitter
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Icon icon={siFacebook} className="mr-2 h-3 w-3" />
            Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Icon icon={siLinkedin} className="mr-2 h-3 w-3" />
            LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://news.ycombinator.com/submitlink?u=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Icon icon={siYcombinator} className="mr-2 h-3 w-3" />
            Hacker News
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`mailto:info@example.com?&subject=&cc=&bcc=&body=${encodedUrl}%20${text}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Mail className="mr-2 h-3 w-3" />
            Email
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
