import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 m-4 rounded-lg shadow-lg ring-1 ring-white/10">
            <ul className="flex space-x-4 font-bold">
                <Link href="/" className="text-white hover:text-gray-300">
                    Compressio
                </Link>
            </ul>
        </nav>
    );
}