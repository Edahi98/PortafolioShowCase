export type Category = 'Frontend' | 'Backend' | 'DevOps' | 'ML' | 'Database';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type DataItem = {
	id: number;
	name: string;
	category: Category;
	language: string;
	difficulty: Difficulty;
	description: string;
	stars: number;
};

/** Mirrors the contents of /public/datasets/denki-sample.docx */
export const DATASET: DataItem[] = [
	{ id: 1, name: 'React', category: 'Frontend', language: 'JavaScript', difficulty: 'Intermediate', description: 'Library for building reactive user interfaces with component model', stars: 228 },
	{ id: 2, name: 'Vue.js', category: 'Frontend', language: 'JavaScript', difficulty: 'Beginner', description: 'Progressive framework for building modern web UIs', stars: 48 },
	{ id: 3, name: 'Svelte', category: 'Frontend', language: 'JavaScript', difficulty: 'Beginner', description: 'Compiler-based UI framework with zero runtime overhead', stars: 82 },
	{ id: 4, name: 'TailwindCSS', category: 'Frontend', language: 'CSS', difficulty: 'Beginner', description: 'Utility-first CSS framework for rapid UI development', stars: 85 },
	{ id: 5, name: 'TypeScript', category: 'Frontend', language: 'TypeScript', difficulty: 'Intermediate', description: 'Typed superset of JavaScript that compiles to plain JS', stars: 101 },
	{ id: 6, name: 'FastAPI', category: 'Backend', language: 'Python', difficulty: 'Intermediate', description: 'Modern high-performance web framework for Python APIs', stars: 78 },
	{ id: 7, name: 'Express.js', category: 'Backend', language: 'JavaScript', difficulty: 'Beginner', description: 'Minimal Node.js web framework for REST APIs', stars: 65 },
	{ id: 8, name: 'Laravel', category: 'Backend', language: 'PHP', difficulty: 'Intermediate', description: 'Full-featured PHP framework with elegant syntax', stars: 77 },
	{ id: 9, name: 'Django', category: 'Backend', language: 'Python', difficulty: 'Intermediate', description: 'Batteries-included Python web framework for rapid development', stars: 79 },
	{ id: 10, name: 'Rust Actix', category: 'Backend', language: 'Rust', difficulty: 'Advanced', description: 'Blazing-fast actor framework for building Rust web services', stars: 22 },
	{ id: 11, name: 'Docker', category: 'DevOps', language: 'Go', difficulty: 'Intermediate', description: 'Container platform for shipping and running applications anywhere', stars: 94 },
	{ id: 12, name: 'Kubernetes', category: 'DevOps', language: 'Go', difficulty: 'Advanced', description: 'Production-grade container orchestration and scaling', stars: 112 },
	{ id: 13, name: 'GitHub Actions', category: 'DevOps', language: 'YAML', difficulty: 'Beginner', description: 'CI/CD pipelines built right into GitHub repositories', stars: 43 },
	{ id: 14, name: 'Nginx', category: 'DevOps', language: 'C', difficulty: 'Intermediate', description: 'High-performance reverse proxy and web server', stars: 20 },
	{ id: 15, name: 'Terraform', category: 'DevOps', language: 'HCL', difficulty: 'Advanced', description: 'Infrastructure as code tool for cloud resource management', stars: 44 },
	{ id: 16, name: 'scikit-learn', category: 'ML', language: 'Python', difficulty: 'Intermediate', description: 'Classic machine learning algorithms and pipelines for Python', stars: 60 },
	{ id: 17, name: 'PyTorch', category: 'ML', language: 'Python', difficulty: 'Advanced', description: 'Dynamic computation graph deep learning framework', stars: 85 },
	{ id: 18, name: 'LangChain', category: 'ML', language: 'Python', difficulty: 'Advanced', description: 'Framework for composing LLM-powered applications and agents', stars: 96 },
	{ id: 19, name: 'Polars', category: 'ML', language: 'Rust', difficulty: 'Intermediate', description: 'Lightning-fast DataFrame library built on Apache Arrow', stars: 31 },
	{ id: 20, name: 'PostgreSQL', category: 'Database', language: 'C', difficulty: 'Intermediate', description: 'Powerful open-source relational database with JSON support', stars: 16 },
	{ id: 21, name: 'MongoDB', category: 'Database', language: 'C++', difficulty: 'Beginner', description: 'Document-oriented NoSQL database for flexible schemas', stars: 25 },
	{ id: 22, name: 'Redis', category: 'Database', language: 'C', difficulty: 'Beginner', description: 'In-memory data store used as cache, broker and database', stars: 67 },
	{ id: 23, name: 'SQLite', category: 'Database', language: 'C', difficulty: 'Beginner', description: 'Serverless embedded SQL database engine for local storage', stars: 4 },
];

export const CATEGORIES: Category[] = ['Frontend', 'Backend', 'DevOps', 'ML', 'Database'];
export const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
