import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Privacy Policy</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Introduction</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Specyf ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Specyf.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service") alongside our application, Specyf. By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Information We Collect</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We collect information from you when you visit our website, register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
                  <li>Name and contact information such as email address, delivery address, and phone number</li>
                  <li>Billing information such as credit card number, cardholder name and billing address</li>
                  <li>Account information such as username, password, preferences and feedback</li>
                  <li>Event information such as event details, guest lists, RSVPs, and responses</li>
                  <li>Usage data such as information about how you use our website and services</li>
                  <li>Technical data such as IP address, browser type and version, time zone setting and location, operating system and platform</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">How We Use Your Information</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We use the information we collect in various ways, including to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
                  <li>Provide, operate, and maintain our website and services</li>
                  <li>Improve, personalize, and expand our website and services</li>
                  <li>Understand and analyze how you use our website and services</li>
                  <li>Develop new products, services, features, and functionality</li>
                  <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                  <li>Send you emails</li>
                  <li>Find and prevent fraud</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Sharing Your Information</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We may share the information we collect in various ways, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
                  <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                  <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process</li>
                  <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Specyf or others</li>
                  <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
                  <li>Between and among Specyf and our current and future parents, affiliates, subsidiaries, and other companies under common control and ownership</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Data Retention</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We will retain your information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Your Rights</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
                  <li>Access the personal information we hold about you</li>
                  <li>Correct inaccuracies in your personal information</li>
                  <li>Delete your personal information</li>
                  <li>Object to the processing of your personal information</li>
                  <li>Request that we limit our processing of your personal information</li>
                  <li>Request portability of your personal information</li>
                </ul>
                <p className="text-gray-500 dark:text-gray-400">
                  To exercise these rights, please contact us at privacy@specyf.com.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Changes to This Privacy Policy</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Contact Us</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
                  <li>By email: privacy@specyf.com</li>
                  <li>By visiting the contact page on our website: <Link href="/contact" className="text-emerald-600 hover:underline">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 