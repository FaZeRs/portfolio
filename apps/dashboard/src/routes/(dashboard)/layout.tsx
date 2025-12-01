import type { UserType } from "@acme/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@acme/ui/breadcrumb";
import { Separator } from "@acme/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@acme/ui/sidebar";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { useMemo } from "react";
import { DashboardSidebar } from "~/components/sidebar";
import { env } from "~/lib/env/client";

export const Route = createFileRoute("/(dashboard)")({
  component: LayoutComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }

    if (context.user.role !== "admin") {
      throw redirect({ href: env.VITE_APP_URL });
    }

    // `context.queryClient` is also available in our loaders
    // https://tanstack.com/start/latest/docs/framework/react/examples/start-basic-react-query
    // https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
  },
  loader: ({ context }) => ({ user: context.user }),
});

type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

function generateBreadcrumbs(pathname: string): BreadcrumbCrumb[] {
  const breadcrumbs: BreadcrumbCrumb[] = [{ label: "Home", href: "/" }];

  if (pathname === "/") {
    return breadcrumbs;
  }

  const segments = pathname.split("/").filter(Boolean);

  // Map of route segments to display names
  const segmentNames: Record<string, string> = {
    blog: "Blog",
    projects: "Projects",
    experiences: "Experiences",
    snippets: "Snippets",
    services: "Services",
    users: "Users",
    create: "Create",
    edit: "Edit",
  };

  let currentPath = "/";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) {
      continue;
    }

    currentPath += `/${segment}`;

    // Skip parameter segments (like $articleId)
    if (segment.startsWith("$")) {
      continue;
    }

    // Check if it's an action (create/edit)
    if (segment === "create" || segment === "edit") {
      breadcrumbs.push({
        label: segmentNames[segment] || segment,
      });
    } else {
      breadcrumbs.push({
        label:
          segmentNames[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1),
        href: i === segments.length - 1 ? undefined : currentPath,
      });
    }
  }

  return breadcrumbs;
}

function LayoutComponent() {
  const { user } = Route.useLoaderData();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(currentPath),
    [currentPath]
  );

  return (
    <SidebarProvider>
      <DashboardSidebar user={user as UserType} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <div className="contents" key={crumb.href || crumb.label}>
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    <BreadcrumbItem
                      className={index === 0 ? "hidden md:block" : ""}
                    >
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mx-auto w-full max-w-6xl py-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
