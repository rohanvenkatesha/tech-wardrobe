import React from 'react';
import Link from 'next/link';
import { Tool } from '@/data/tools';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <a className="block p-6 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
        <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
        <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
      </a>
    </Link>
  );
};

export default ToolCard;