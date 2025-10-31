import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import NewsOverview from "./NewsOverview";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();
  return (
    <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo.svg"
            alt="FinPulse-AI logo"
            width={40}
            height={40}
            className="h-14 w-40"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden sm:flex flex-1 justify-center">
          <NavItems initialStocks={initialStocks} />
        </nav>

        {/* User dropdown */}
        <div className="flex items-center gap-3">
          <NewsOverview />
          <UserDropdown user={user} initialStocks={initialStocks} />
        </div>
      </div>
    </header>
  );
};

export default Header;
