import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@acme/ui/breadcrumb";
import { Home } from "lucide-react";

export type BreadcrumbSection = {
  label: string;
  href: string;
};

export type BreadcrumbProps = {
  pageTitle: string;
  section?: BreadcrumbSection;
};

const DEFAULT_SECTION: BreadcrumbSection = {
  label: "Blog",
  href: "/blog",
};

export default function BreadcrumbNavigation({
  pageTitle,
  section = DEFAULT_SECTION,
}: Readonly<BreadcrumbProps>) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center gap-2" href="/">
            <Home className="h-4 w-4" /> Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={section.href}>{section.label}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
