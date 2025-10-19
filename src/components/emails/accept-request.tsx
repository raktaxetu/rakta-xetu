import { IDonor } from "../../../types/schema";
import {
  Body,
  Container,
  Section,
  Column,
  Heading,
  Text,
  Button,
  Img,
  Row,
} from "@react-email/components";

interface Props {
  image: string;
  donor: IDonor;
  ctaUrl?: string;
  email: string;
}

export function AcceptRequest({ donor, ctaUrl, email, image }: Props) {
  const name = donor.name;
  const details = [
    { label: "Name", value: donor.name },
    { label: "Email", value: email },
    { label: "Phone", value: donor.phoneNumber ?? "N/A" },
    { label: "Location", value: donor.location ?? "N/A" },
    { label: "Gender", value: donor.gender ?? "N/A" },
    { label: "Blood Group", value: donor.bloodGroup ?? "N/A" },
    { label: "Date of Birth", value: donor.dateOfBirth ?? "N/A" },
  ];

  return (
    <Body
      style={{
        backgroundColor: "#f6f9fc",
        fontFamily:
          'Inter, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <Container
        style={{
          margin: "40px auto",
          padding: 24,
          maxWidth: 680,
          backgroundColor: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(16,24,40,0.08)",
        }}
      >
        <Section style={{ textAlign: "center", paddingBottom: 12 }}>
          <Img
            src={image}
            alt="Rakta Xetu"
            width={72}
            height={72}
            style={{ margin: "0 auto" }}
          />
          <Heading style={{ fontSize: 20, marginTop: 12, marginBottom: 6 }}>
            Someone has accepted your blood request
          </Heading>
          <Text style={{ color: "#64748b", marginTop: 0, marginBottom: 18 }}>
            A person has accepted your request — see the details below and respond
            quickly.
          </Text>
        </Section>

        <Section
          style={{
            backgroundColor: "#f8fafc",
            padding: 16,
            borderRadius: 8,
            marginBottom: 18,
          }}
        >
          <Heading style={{ fontSize: 16, margin: 0 }}>
            {name} has accepted your request
          </Heading>
          <Text style={{ color: "#475569", marginTop: 8, marginBottom: 0 }}>
            If this is a match, please get in touch as soon as possible.
          </Text>
        </Section>

        <Section>
          <Heading style={{ fontSize: 15, marginBottom: 8 }}>
            Donor details
          </Heading>

          <Container
            style={{
              padding: 12,
              border: "1px solid #eef2f7",
              borderRadius: 8,
            }}
          >
            {details.map((d) => (
              <Row
                key={d.label}
                style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}
              >
                <Column style={{ width: "35%", paddingRight: 8 }}>
                  <Text style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
                    {d.label}
                  </Text>
                </Column>
                <Column>
                  <Text style={{ color: "#0f172a", fontSize: 14, margin: 0 }}>
                    {d.value}
                  </Text>
                </Column>
              </Row>
            ))}
          </Container>
        </Section>

        <Section style={{ textAlign: "center", marginTop: 22 }}>
          <Button
            href={ctaUrl ?? "mailto:" + email}
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-block",
              fontWeight: 600,
            }}
          >
            Contact Donor
          </Button>
        </Section>

        <Section
          style={{
            marginTop: 28,
            borderTop: "1px solid #eef2f7",
            paddingTop: 16,
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>
            If you didn't expect this email, you can ignore it. For support,
            reply to raktaxetu@gmail.com
          </Text>
        </Section>
      </Container>
    </Body>
  );
}
