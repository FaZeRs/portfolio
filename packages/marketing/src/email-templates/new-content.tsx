import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type NewContentEmailProps = {
  title: string;
  description: string;
  contentUrl: string;
  contentType: "blog" | "project" | "snippet";
  unsubscribeUrl?: string;
};

export function NewContentEmail({
  title,
  description,
  contentUrl,
  contentType,
  unsubscribeUrl = "{{unsubscribe_url}}",
}: NewContentEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New {contentType}: {title}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h2}>New {contentType} Published!</Heading>
          </Section>
          <Section style={contentSection}>
            <Heading style={h1}>{title}</Heading>
            <Text style={descriptionStyle}>{description}</Text>
            <Button href={contentUrl} style={button}>
              Read More
            </Button>
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
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0",
};

const contentSection = {
  padding: "30px 0",
  textAlign: "center" as const,
};

const descriptionStyle = {
  color: "#666",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const button = {
  backgroundColor: "#0066cc",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "20px 0",
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

export default NewContentEmail;
