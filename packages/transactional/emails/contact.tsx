import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  email?: string;
  message?: string;
}

export const ContactEmail = ({
  email = "john@doe.com",
  message = "Hello, I'm John Doe",
}: ContactEmailProps) => {
  const previewText = `New contact message from ${email}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading>New contact message</Heading>
            <Text>
              <b>From: </b>
              {email}
            </Text>
            <Text>
              <b>Message: </b>
              {message}
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This message was sent from your portfolio website's contact form.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactEmail;
