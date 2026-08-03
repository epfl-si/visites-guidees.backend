export interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependency?: string | string[],
      callback?: (updatedDependencies: any) => void,
    ): void;
    dispose(callback: (data: any) => void): void;
  };
}
