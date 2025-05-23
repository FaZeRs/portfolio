export default function YouTube({ id }: Readonly<{ id: string }>) {
  return (
    <div className="relative mt-6 h-0 max-w-full overflow-hidden pb-[56.25%]">
      <iframe
        className="absolute top-0 left-0 h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-popups allow-forms"
        allowFullScreen
      />
    </div>
  );
}
