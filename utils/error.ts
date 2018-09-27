export class ConfigError extends Error {
  public name: string;

  constructor(message: string) {
      super(message);
      this.name = 'ConfigError';
  }
};

export default { ConfigError };
