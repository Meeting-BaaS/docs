/**
 * Interface for service update configuration
 */
export interface ServiceConfig {
  /** Display name of the service */
  name: string;
  /** Directory pattern to search for changes */
  dirPattern: string;
  /** Icon for the service */
  icon: string;
  /** Key used in filenames and references */
  serviceKey: string;
  /** Optional path to OpenAPI file for API services */
  openapiFile?: string;
  /** Additional tags for categorization */
  additionalTags?: string[];
  /** Patterns to exclude from changes */
  excludePatterns?: string[];
}

/**
 * Interface for API change data
 */
export interface APIChange {
  path: string;
  method: string;
  type: 'breaking' | 'enhancement' | 'feature';
  description: string;
  category?: string;
}

/**
 * Interface for NPM package information
 */
export interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
  versions: Record<
    string,
    {
      description: string;
      homepage: string;
      repository?: {
        url: string;
      };
      license: string;
      dependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    }
  >;
}

/**
 * Interface for LLM model data
 */
export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
  version?: string;
  releaseDate?: string;
  description?: string;
}

/**
 * Interface for git changes
 */
export interface GitChanges {
  modified: string[];
  added: string[];
  deleted: string[];
}
