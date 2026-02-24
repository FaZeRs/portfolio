import { siteConfig, socialConfig } from "@acme/config";
import { useTheme } from "@acme/shared/theme-provider";
import { Button } from "@acme/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@acme/ui/command";
import Icon from "@acme/ui/icon";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Code,
  CommandIcon,
  File,
  FileText,
  FolderKanban,
  Laptop,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { navbarLinks } from "~/lib/constants/navbar";
import { useTRPC } from "~/lib/trpc";

export default function CommandMenu({ ...props }: Readonly<DialogProps>) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { setTheme } = useTheme();
  const trpc = useTRPC();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    ...trpc.search.query.queryOptions({ query: debouncedQuery }),
    enabled: debouncedQuery.length >= 2,
  });

  const hasSearchResults =
    searchResults &&
    (searchResults.articles.length > 0 ||
      searchResults.projects.length > 0 ||
      searchResults.snippets.length > 0);

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
        <CommandInput
          onValueChange={setSearchQuery}
          placeholder="Type a command or search..."
          value={searchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>

          {hasSearchResults && (
            <>
              {searchResults.articles.length > 0 && (
                <CommandGroup heading="Articles">
                  {searchResults.articles.map((article) => (
                    <CommandItem
                      key={article.id}
                      onSelect={() => {
                        runCommand(() =>
                          navigate({
                            to: "/blog/$articleId",
                            params: { articleId: article.slug },
                          })
                        );
                      }}
                      value={`article-${article.slug}`}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{article.title}</span>
                        {article.description && (
                          <span className="text-muted-foreground text-xs">
                            {article.description.slice(0, 60)}
                            {article.description.length > 60 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.projects.length > 0 && (
                <CommandGroup heading="Projects">
                  {searchResults.projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      onSelect={() => {
                        runCommand(() =>
                          navigate({
                            to: "/projects/$projectId",
                            params: { projectId: project.slug },
                          })
                        );
                      }}
                      value={`project-${project.slug}`}
                    >
                      <FolderKanban className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{project.title}</span>
                        {project.description && (
                          <span className="text-muted-foreground text-xs">
                            {project.description.slice(0, 60)}
                            {project.description.length > 60 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.snippets.length > 0 && (
                <CommandGroup heading="Snippets">
                  {searchResults.snippets.map((snippet) => (
                    <CommandItem
                      key={snippet.id}
                      onSelect={() => {
                        runCommand(() =>
                          navigate({
                            to: "/snippets/$snippetId",
                            params: { snippetId: snippet.slug },
                          })
                        );
                      }}
                      value={`snippet-${snippet.slug}`}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{snippet.title}</span>
                        {snippet.description && (
                          <span className="text-muted-foreground text-xs">
                            {snippet.description.slice(0, 60)}
                            {snippet.description.length > 60 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="General">
            <CommandItem
              onSelect={() =>
                window.open(
                  siteConfig.links.githubRepo,
                  "_blank",
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
              <CommandItem
                key={social.name}
                onSelect={() => {
                  window.open(social.url, "_blank", "noopener,noreferrer");
                }}
              >
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
            <CommandItem onSelect={() => runCommand(() => setTheme("auto"))}>
              <Laptop className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

interface MenuCommandProps {
  onSelect?: (value: string) => void;
  value: string;
}

const MenuCommandItem = ({ value, onSelect }: MenuCommandProps) => (
  <CommandItem onSelect={onSelect} value={value}>
    <File className="mr-2 h-4 w-4" />
    <span>{value}</span>
  </CommandItem>
);
