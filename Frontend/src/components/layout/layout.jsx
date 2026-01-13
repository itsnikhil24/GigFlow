import { Header } from './Header';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}