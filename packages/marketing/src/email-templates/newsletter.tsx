import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Markdown,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type NewsletterEmailProps = {
  subject: string;
  content: string;
  unsubscribeUrl?: string;
};

export function NewsletterEmail({
  subject,
  content,
  unsubscribeUrl = "{{unsubscribe_url}}",
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{subject}</Heading>
          </Section>
          <Section style={contentSection}>
            <Markdown>{content}</Markdown>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you subscribed to my newsletter.
            </Text>
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  padding: "20px 0",
  borderBottom: "2px solid #eee",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const contentSection = {
  padding: "30px 0",
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.6",
};

const footer = {
  textAlign: "center" as const,
  padding: "20px 0",
  borderTop: "2px solid #eee",
  fontSize: "14px",
  color: "#666",
};

const footerText = {
  margin: "0 0 10px 0",
};

const link = {
  color: "#0066cc",
  textDecoration: "none",
};

export default NewsletterEmail;
