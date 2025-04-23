export function ProjectsForm() {
  return <></>;
  //   const title = form.watch("title");
  //   useEffect(() => {
  //     if (title) {
  //       const slug = generateSlug(title);
  //       form.setValue("slug", slug, { shouldValidate: true });
  //     }
  //   }, [title, form]);

  //   return (
  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-8">
  //         <FormField
  //           control={form.control}
  //           name="title"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Title</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Portfolio Project" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="slug"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Slug</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="portfolio-project" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="description"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Description</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="Portfolio Project" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="content"
  //           render={({ field }) => (
  //             <FormItem className="space-y-2">
  //               <FormLabel>Content (Markdown)</FormLabel>
  //               <FormControl>
  //                 <Tabs defaultValue="write" className="w-full">
  //                   <TabsList className="mb-2">
  //                     <TabsTrigger value="write">Write</TabsTrigger>
  //                     <TabsTrigger value="preview">Preview</TabsTrigger>
  //                   </TabsList>
  //                   <TabsContent value="write" className="mt-0">
  //                     <Textarea
  //                       placeholder="# Project Details

  // ## Overview
  // A brief overview of your project.

  // ## Features
  // - Feature 1
  // - Feature 2

  // ## Implementation
  // Details about how you implemented the project."
  //                       className="min-h-[300px] font-mono"
  //                       {...field}
  //                     />
  //                   </TabsContent>
  //                   <TabsContent value="preview" className="mt-0">
  //                     <div className="min-h-[300px] rounded-md border border-input p-4">
  //                       {field.value ? (
  //                         <Markdown source={field.value} />
  //                       ) : (
  //                         <div className="text-muted-foreground">Nothing to preview</div>
  //                       )}
  //                     </div>
  //                   </TabsContent>
  //                 </Tabs>
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="image"
  //           render={({ field: { onChange, value, ...fieldProps } }) => (
  //             <FormItem>
  //               <FormLabel>Image</FormLabel>
  //               <FormControl>
  //                 <Input
  //                   placeholder="Select file"
  //                   type="file"
  //                   {...fieldProps}
  //                   onChange={(event) => {
  //                     const file = event.target.files?.[0];
  //                     onChange(file);
  //                   }}
  //                 />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="githubUrl"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>GitHub URL</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="https://github.com/example" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="demoUrl"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Demo URL</FormLabel>
  //               <FormControl>
  //                 <Input placeholder="https://example.com" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <Button type="submit">Submit</Button>
  //       </form>
  //     </Form>
  //   );
}
