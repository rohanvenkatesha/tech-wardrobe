import React from 'react';
import ToolCard from '@/components/ToolCard';
import { tools } from '@/data/tools';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Tech Wardrobe
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          A modular collection of open source tools for your everyday tech needs.
        </p>
      </header>

      <section className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {tools
          .filter(tool => tool.status === 'active')
          .map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
      </section>
    </main>
  );
};

export default HomePage;