import {
  CollapsibleContent as CollapsibleContentPrimitive,
  CollapsibleTrigger as CollapsibleTriggerPrimitive,
  Root,
} from "@radix-ui/react-collapsible";

function Collapsible({ ...props }: React.ComponentProps<typeof Root>) {
  return <Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsibleTriggerPrimitive>) {
  return (
    <CollapsibleTriggerPrimitive data-slot="collapsible-trigger" {...props} />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsibleContentPrimitive>) {
  return (
    <CollapsibleContentPrimitive data-slot="collapsible-content" {...props} />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
