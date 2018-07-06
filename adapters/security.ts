import { createLogger } from '../helpers';
import { appContext } from '../core/context';

// --------------------------------------------------------------
// Types
// --------------------------------------------------------------

interface IRequestConfig {
  endpoint?: string;
}

export interface ISecurityService {
  currentUser(opts: { token: string }, configs?: IRequestConfig): Promise<any>;

  roles(opts: { token: string }, configs?: IRequestConfig): Promise<any>;

  updatePassword(
    opts: { token: string },
    data: { body: { email: string; password: string } },
    configs?: IRequestConfig,
  ): Promise<any>;
}

// --------------------------------------------------------------
// Main
// --------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
const logger = createLogger('adapters:security');

export const securityProxy = {
  currentUser: (opts: { token: string }, configs?: IRequestConfig) =>
    appContext.ctx.security.currentUser(opts, configs),

  roles: (opts: { token: string }, configs?: IRequestConfig) =>
    appContext.ctx.security.roles(opts, configs),

  updatePassword: (
    opts: { token: string },
    data: { body: { email: string; password: string } },
    configs?: IRequestConfig,
  ) => appContext.ctx.security.updatePassword(opts, data, configs),
};

export class SecurityAdapter {
  private service: ISecurityService;

  constructor(service: ISecurityService) {
    this.service = service;
  }

  currentUser = (opts: { token: string }, configs?: IRequestConfig) =>
    this.service.currentUser(opts, configs);

  roles = (opts: { token: string }, configs?: IRequestConfig) => this.service.roles(opts, configs);

  updatePassword = (
    opts: { token: string },
    data: { body: { email: string; password: string } },
    configs?: IRequestConfig,
  ) => this.service.updatePassword(opts, data, configs);
}
