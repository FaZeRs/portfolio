interface SectionHeadingProps {
  children: React.ReactNode;
}

export default function SectionHeading({ children }: Readonly<SectionHeadingProps>) {
  return (
    <h2 className="font-heading mb-8 text-center text-3xl font-medium capitalize">
      {children}
    </h2>
  );
}
