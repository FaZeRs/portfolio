import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactEmailProps {
  name?: string;
  email?: string;
  message?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ContactEmail = ({
  name = "John Doe",
  email = "john@doe.com",
  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, elit non aliquet ultricies, nunc elit dictum nunc, vitae aliquam nunc nisl quis nunc.",
}: ContactEmailProps) => (
  <Html>
    <Head />
    <Preview>Contact Message</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Contact Message</Heading>
        <Text style={{ ...text, marginBottom: "14px" }}>
          <strong>Name:</strong> {name}
        </Text>
        <Text style={{ ...text, marginBottom: "14px" }}>
          <strong>Email:</strong> {email}
        </Text>
        <Text style={{ ...text, marginBottom: "14px" }}>
          <strong>Message:</strong> {message}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ContactEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};
