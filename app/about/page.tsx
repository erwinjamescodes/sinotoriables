export const metadata = {
  title: "About | SinoToriables",
  description: "Learn about the SinoToriables application",
};

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            About SinoToriables
          </h1>
          <p className="text-muted-foreground">
            Learn about our mission and how to use this platform.
          </p>
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <h2>Our Mission</h2>
          <p>
            SinoToriables aims to provide a transparent and accessible platform
            for Philippine citizens to learn about Senate candidates, their
            platforms, and engage with the democratic process. We believe that
            an informed electorate is essential for a healthy democracy.
          </p>

          <h2>How It Works</h2>
          <p>Our platform allows you to:</p>
          <ul>
            <li>Browse all Senate candidates in the upcoming election</li>
            <li>View detailed profiles of each candidate</li>
            <li>Show your support by liking candidates</li>
            <li>Explore analytics and insights about candidate popularity</li>
          </ul>

          <h2>Liking Candidates</h2>
          <p>
            The "like" feature allows you to show support for candidates without
            requiring an account. Each device can like a candidate once,
            providing a simple way to gauge public sentiment. This is not an
            official voting mechanism but rather a way to engage with the
            platform and show interest in particular candidates.
          </p>

          <h2>Data & Privacy</h2>
          <p>
            We do not collect personal information from users. The "like"
            feature uses anonymous identifiers to prevent duplicate likes from
            the same device. All data displayed on this platform is for
            informational purposes only.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions, feedback, or suggestions, please reach out to
            us at{" "}
            <a href="mailto:contact@philsenatepulse.example.com">
              contact@philsenatepulse.example.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
