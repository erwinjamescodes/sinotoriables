export const metadata = {
  title: "About | SinoToriables PH",
  description: "Learn about the SinoToriables PH application",
};

export default function AboutPage() {
  return (
    <div className="container py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="space-y-10">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            About SinoToriables PH
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about our mission and how to use this platform.
          </p>
        </div>

        {/* Personal Project Notice */}
        <div className="bg-blue-50 border-l-4 border-gray-500 p-6 rounded-md">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="font-medium">
                This is a personal project. All election-related information
                presented here is sourced from Rappler.
              </p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none dark:prose-invert prose-img:mx-auto prose-img:max-w-full">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-6">
            SinoToriables PH aims to provide a transparent and accessible
            platform for Philippine citizens to learn about Senate candidates,
            their platforms, and engage with the democratic process. We believe
            that an informed electorate is essential for a healthy democracy.
          </p>

          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <p className="text-lg mb-4">Our platform allows you to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Browse all Senate candidates in the upcoming election</li>
            <li>View detailed profiles of each candidate</li>
            <li>Show your support by liking candidates</li>
            <li>Explore statistics and insights about candidate popularity</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Liking Candidates</h2>
          <p className="text-lg mb-6">
            The "like" feature allows you to show support for candidates without
            requiring an account. Each device can like a candidate once,
            providing a simple way to gauge public sentiment. This is not an
            official voting mechanism but rather a way to engage with the
            platform and show interest in particular candidates.
          </p>

          <h2 className="text-2xl font-bold mb-4">Data & Privacy</h2>
          <p className="text-lg mb-6">
            We do not collect personal information from users. The "like"
            feature uses anonymous identifiers to prevent duplicate likes from
            the same device. All data displayed on this platform is for
            informational purposes only.
          </p>

          <h2 className="text-2xl font-bold mb-4">Content Attribution</h2>
          <p className="text-lg mb-6">
            The candidate information, election news, and other political data
            presented on this site are sourced from Rappler, a Philippine-based
            news website. We strive to present this information accurately and
            objectively, but this platform is not affiliated with any political
            party, candidate, or Rappler itself.
          </p>

          <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
          <p className="text-lg mb-6">
            SinoToriables PH is created as an educational tool and personal
            project. While we aim to provide accurate information, users should
            verify critical election details with official sources such as the
            Commission on Elections (COMELEC). This platform does not represent
            any official election mechanism or polling system.
          </p>

          {/* <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg">
            If you have questions, feedback, or suggestions, please reach out to
            us at{" "}
            <a
              href="mailto:contact@philsenatepulse.example.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              contact@philsenatepulse.example.com
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
}
