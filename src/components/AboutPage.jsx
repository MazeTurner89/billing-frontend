export default function AboutPage() {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About This Project</h1>
        <div className="space-y-4 text-gray-700">
          <p>
            This platform was born from a simple, frustrating question: "Why is my electricity bill so high?" Many of us feel like we're being overcharged, but without data, it's just a feeling. This project aims to replace that feeling with facts.
          </p>
          <p>
            By crowdsourcing anonymized bill data, we can create a transparent, community-driven benchmark. Our goal is to empower consumers with the information they need to understand their bills in context and hold utility providers accountable.
          </p>
          <h2 className="text-2xl font-bold text-gray-800 pt-4">Our Commitment to Anonymity</h2>
          <p>
            Your privacy is paramount. We do not ask for, collect, or store any personally identifiable information (PII). No names, no account numbers, no addresses. The data you submit is aggregated anonymously to power the comparison engine, ensuring that your participation helps the community without compromising your identity.
          </p>
        </div>
      </div>
    );
  }