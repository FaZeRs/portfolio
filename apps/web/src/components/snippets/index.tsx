import { SnippetType } from "@acme/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import { formatDate } from "@acme/utils";
import { Link } from "@tanstack/react-router";

type SnippetsProps = {
  snippets: SnippetType[];
};

export default function Snippets({ snippets }: Readonly<SnippetsProps>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="uppercase">
          <TableHead className="w-[200px]">Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {snippets.map((snippet) => (
          <TableRow key={snippet.slug}>
            <TableCell className="font-medium underline">
              <Link
                params={{
                  snippetId: snippet.slug,
                }}
                to="/snippets/$snippetId"
              >
                {snippet.title}
              </Link>
            </TableCell>
            <TableCell>{snippet.description}</TableCell>
            <TableCell>{snippet.category}</TableCell>
            <TableCell className="text-right">
              {formatDate(snippet.updatedAt ?? snippet.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
