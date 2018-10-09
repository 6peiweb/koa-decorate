"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
;
exports.default = { ConfigError };
