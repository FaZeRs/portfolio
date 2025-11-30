export default function YouTube({ id }: Readonly<{ id: string }>) {
  return (
    <div className="relative mt-6 h-0 max-w-full overflow-hidden pb-[56.25%]">
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 h-full w-full"
        sandbox="allow-same-origin allow-popups allow-forms"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
      />
    </div>
  );
}
