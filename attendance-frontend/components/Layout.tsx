import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center">
            <p className="text-sm text-slate-500">
              Built by <a href="https://tukesh.sbs/">Tukesh with ❤️</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
