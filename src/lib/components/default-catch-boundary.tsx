export function DefaultCatchBoundary() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <img
        width={80}
        height={80}
        src="/images/searching-duck.gif"
        alt="Yellow duck searching"
      />
      <h1 className="mt-6 mb-3 font-black text-3xl leading-tight tracking-tight sm:text-6xl lg:leading-[3.7rem]">
        Error!
      </h1>
      <p className="max-w-2xl text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
        Oop! Something went wrong.
      </p>
    </div>
  );
}
