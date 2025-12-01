type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({
  children,
}: Readonly<SectionHeadingProps>) {
  return (
    <h2 className="mb-8 text-center font-heading font-medium text-3xl capitalize">
      {children}
    </h2>
  );
}
