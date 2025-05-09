export function NotFound(
  props: Readonly<{
    children?: React.ReactNode;
  }>,
) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <img
        width={80}
        height={80}
        src="/images/searching-duck.gif"
        alt="Yellow duck searching"
      />
      <h1 className="mt-6 mb-3 font-black text-3xl leading-tight tracking-tight sm:text-6xl lg:leading-[3.7rem]">
        Error 404!
      </h1>
      <p className="max-w-2xl text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
        {props.children ?? "The page you are looking for does not exist."}
      </p>
    </div>
  );
}
