export interface Tool {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
}

export const tools: Tool[] = [
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    description: 'Merge multiple PDF files into one easily.',
    slug: 'pdf-merger',
    status: 'active',
  },
  {
    id: 'pdf-converter',
    name: 'PDF Converter',
    description: 'Convert files to and from PDF format.',
    slug: 'pdf-converter',
    status: 'active',
  },
];