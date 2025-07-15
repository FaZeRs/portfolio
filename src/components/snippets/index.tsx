import { Link } from "@tanstack/react-router";
import { formatDate } from "~/lib/utils";
import { SnippetType } from "~/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface SnippetsProps {
  snippets: SnippetType[];
}

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
                to="/snippets/$snippetId"
                params={{
                  snippetId: snippet.slug,
                }}
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
