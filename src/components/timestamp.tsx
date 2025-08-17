import { format, formatDistanceToNow, isToday } from "date-fns";
import { useEffect, useState } from "react";

type TimestampProps = {
  datetime: string;
};

const INTERVAL_MS = 60_000 as const; // 1 minute

const Timestamp = ({ datetime }: TimestampProps) => {
  const [formattedTimestamp, setFormattedTimestamp] = useState<string>(
    formatDistanceToNow(new Date(datetime), { addSuffix: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTimestamp(
        formatDistanceToNow(new Date(datetime), { addSuffix: true })
      );
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [datetime]);

  return (
    <div className="text-muted-foreground text-xs">
      {isToday(new Date(datetime))
        ? formattedTimestamp
        : format(new Date(datetime), "dd MMM yyyy HH:mm")}
    </div>
  );
};

export default Timestamp;
