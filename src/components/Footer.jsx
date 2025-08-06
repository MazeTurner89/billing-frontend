export default function Footer() {
    return (
        <footer className="bg-white mt-12 border-t">
            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} BillWise. A project by Martin. All rights reserved.</p>
            </div>
        </footer>
    );
}