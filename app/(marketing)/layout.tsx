import { Navbar } from "@/components/ui/Navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="pt-20">{children}</div>
    </div>
  );
}
