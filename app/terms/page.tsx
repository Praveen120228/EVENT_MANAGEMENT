import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Terms of Service</h1>
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
                <h2 className="text-2xl font-bold tracking-tight">1. Introduction</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Welcome to Specyf ("Company", "we", "our", "us")! As you have just clicked our Terms of Service, please make a pause, grab a cup of coffee and carefully read the following pages. It will take you approximately 20 minutes.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  These Terms of Service ("Terms", "Terms of Service") govern your use of our web pages located at specyf.com and our mobile application Specyf (together or individually "Service") operated by Specyf.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@specyf.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Thank you for being responsible.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">2. Communications</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@specyf.com.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">3. Purchases</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">4. Subscriptions</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Some parts of Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or Specyf cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting Specyf customer support team.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  A valid payment method, including credit card, is required to process the payment for your subscription. You shall provide Specyf with accurate and complete billing information including full name, address, state, zip code, telephone number, and a valid payment method information. By submitting such payment information, you automatically authorize Specyf to charge all Subscription fees incurred through your account to any such payment instruments.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Should automatic billing fail to occur for any reason, Specyf will issue an electronic invoice indicating that you must proceed manually, within a certain deadline date, with the full payment corresponding to the billing period as indicated on the invoice.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">5. Free Trial</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Specyf may, at its sole discretion, offer a Subscription with a free trial for a limited period of time ("Free Trial").
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  You may be required to enter your billing information in order to sign up for Free Trial.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  If you do enter your billing information when signing up for Free Trial, you will not be charged by Specyf until Free Trial has expired. On the last day of Free Trial period, unless you canceled your Subscription, you will be automatically charged the applicable Subscription fees for the type of Subscription you have selected.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  At any time and without notice, Specyf reserves the right to (i) modify Terms of Service of Free Trial offer, or (ii) cancel such Free Trial offer.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">6. Content</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  By posting Content on or through Service, You represent and warrant that: (i) Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  You retain any and all of your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service. You agree that this license includes the right for us to make your Content available to other users of Service, who may also use your Content subject to these Terms.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Specyf has the right but not the obligation to monitor and edit all Content provided by users.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">7. Prohibited Uses</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                  <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                  <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">8. Analytics</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We may use third-party Service Providers to monitor and analyze the use of our Service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">9. Intellectual Property</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Specyf and its licensors. Service is protected by copyright, trademark, and other laws of the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Specyf.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">10. Copyright Policy</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights ("Infringement") of any person or entity.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to dmca@specyf.com, with the subject line: "Copyright Infringement" and include in your claim a detailed description of the alleged Infringement as detailed below, under "DMCA Notice and Procedure for Copyright Infringement Claims"
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  You may be held accountable for damages (including costs and attorneys' fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">11. Contact Us</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Please send your feedback, comments, and requests for technical support:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
                  <li>By email: support@specyf.com</li>
                  <li>By visiting this page on our website: <Link href="/contact" className="text-emerald-600 hover:underline">Contact Us</Link></li>
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