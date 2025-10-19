import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Link,
  Tailwind,
} from "@react-email/components";

interface ThankYouEmailProps {
  amount: string;
  orderId: string;
}

export const ThankYouEmail = ({ amount, orderId }: ThankYouEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for supporting RaktaXetu ❤️</Preview>
      <Tailwind>
        <Body className="bg-gray-50 text-neutral-500 font-sans">
          <Container className="max-w-[600px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <Section className="bg-rose-600 text-white text-center p-6">
              <Heading as="h1" className="m-0 text-2xl font-bold">
                RaktaXetu
              </Heading>
              <Text className="m-0 text-sm">Connecting Life, Sharing Hope</Text>
            </Section>
            <Section className="p-8 text-left">
              <Heading as="h2" className="text-xl font-semibold mt-0">
                🙏 Thank You for Your Generous Support!
              </Heading>
              <Text className="text-base leading-relaxed mb-6">
                We deeply appreciate your financial contribution to{" "}
                <strong>RaktaXetu</strong>. Your donation helps us keep the
                lifeline of hope alive for those in need.
              </Text>
              <table className="w-full border-collapse mb-6">
                <tbody>
                  <tr>
                    <td className="py-2 font-semibold">Donation Amount:</td>
                    <td className="py-2">₹{amount}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Order ID:</td>
                    <td className="py-2">{orderId}</td>
                  </tr>
                </tbody>
              </table>
              <Text className="text-sm text-gray-600">
                Every drop counts—and so does every rupee. Your kindness makes a
                real difference.
              </Text>
              <div className="text-center my-8">
                <Button
                  href={process.env.BETTER_AUTH_URL!}
                  className="bg-rose-600 text-white px-6 py-3 rounded-md text-base no-underline"
                >
                  Go Back to Home
                </Button>
              </div>
              <Text className="text-xs text-center text-gray-500">
                By donating, you agree to our{" "}
                <Link
                  href={`${process.env.BETTER_AUTH_URL!}/privacy-policy`}
                  className="text-red-600 no-underline"
                >
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ThankYouEmail;
