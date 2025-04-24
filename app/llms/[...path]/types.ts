// Define the types for category configuration
export interface CategoryConfig {
  title: string;
  description: string;
  patterns: string[];
  excludePatterns?: string[];
}

// Define a type for the mapping of category paths to their configurations
export interface CategoryConfigMap {
  [categoryPath: string]: CategoryConfig;
}

// Define route params type explicitly
export interface RouteParams {
  path: string[];
} 