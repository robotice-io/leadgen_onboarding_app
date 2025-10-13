import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const LanguageToggle = dynamic(() => import("@/components/ui/LanguageToggle"), { ssr: false });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`relative min-h-screen w-full bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0)_60%,rgba(2,6,23,0.03)_100%)]`}>
      <LanguageToggle />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/landing_logo.png"
                alt="Robotice"
                width={120}
                height={120}
                priority
                className="mx-auto"
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
