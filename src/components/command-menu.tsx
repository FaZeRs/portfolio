import type { DialogProps } from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { Code, CommandIcon, File, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import Icon from "~/components/ui/icon";

import { navbarLinks } from "~/lib/config/navbar";
import { siteConfig, socialConfig } from "~/lib/config/site";

export default function CommandMenu({ ...props }: Readonly<DialogProps>) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((currentOpen) => !currentOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        className="size-8 px-0"
        onClick={() => setOpen(true)}
        size="sm"
        variant="ghost"
        {...props}
      >
        <CommandIcon className="size-5" strokeWidth="1.5" />
      </Button>

      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="General">
            <CommandItem
              onSelect={() =>
                window.open(
                  siteConfig.links.githubRepo,
                  "_ blank",
                  "noopener,noreferrer"
                )
              }
            >
              <Code className="mr-2 h-4 w-4" />
              Source code
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Links">
            {navbarLinks.map((link) =>
              link.content ? (
                link.content.map((subLink) => (
                  <MenuCommandItem
                    key={subLink.href}
                    onSelect={() => {
                      runCommand(() =>
                        navigate({
                          href: subLink.href,
                        })
                      );
                    }}
                    value={subLink.title}
                  />
                ))
              ) : (
                <MenuCommandItem
                  key={link.href}
                  onSelect={() => {
                    runCommand(() =>
                      navigate({
                        href: link.href ?? "#",
                      })
                    );
                  }}
                  value={link.title}
                />
              )
            )}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Social">
            {socialConfig.map((social) => (
              <CommandItem key={social.name}>
                <Icon className="mr-2 h-4 w-4" icon={social.icon} />
                {social.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

type MenuCommandProps = {
  value: string;
  onSelect?: (value: string) => void;
};

const MenuCommandItem = ({ value, onSelect }: MenuCommandProps) => (
  <CommandItem onSelect={onSelect} value={value}>
    <File className="mr-2 h-4 w-4" />
    <span>{value}</span>
  </CommandItem>
);
