import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-98px)] p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to FGS Staffing Agency</h1>
      <p className="max-w-2xl mb-6 text-gray-600">
        We provide high-quality staffing solutions for your business. Find the right staff members to help your organization grow.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/clients/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">
          Client Dashboard
        </Link>
        <Link href="/clients/hiring" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">
          Start Hiring
        </Link>
      </div>
    </div>
  );
}
