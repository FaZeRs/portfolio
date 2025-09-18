import { GuestbookType, UserType } from "~/types";
import Message from "./message";

type MessageProps = {
  messages: (GuestbookType & { user: UserType })[];
};
export default function Messages({ messages }: Readonly<MessageProps>) {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
