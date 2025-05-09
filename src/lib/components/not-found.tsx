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
      <h1 className="mb-3 mt-6 text-3xl font-black leading-tight tracking-tight sm:text-6xl lg:leading-[3.7rem]">
        Error 404!
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {props.children ?? <p>The page you are looking for does not exist.</p>}
      </p>
    </div>
  );
}
