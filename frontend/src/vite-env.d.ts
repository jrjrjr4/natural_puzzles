/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: Record<string, string>;
}

// Allow importing CSS
declare module '*.css';

// Allow importing all TypeScript modules
declare module '*.tsx' {
  const component: any;
  export default component;
}

declare module '*.ts' {
  const content: any;
  export default content;
} 