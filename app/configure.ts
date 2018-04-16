export const enum StringCase {
  None  = 'None',
  Snake = 'snake',
  Camel = 'Camel',
}

export const enum ApiResponsePageMode {
  SQLAlchemy = 'SQLAlchemy',
  SpringJPA  = 'SpringJPA',
  Default    = 'Default',
}

export const enum ApiResponseAssociationMode {
  ID     = 'ids',
  ENTITY = 'entity',
}

export const enum AuthHeader {
  /**
   * header: Authorization: token
   * default
   */
  AuthHeader              = 'AuthHeader',
  /**
   * header: Authorization: `Bearer ${token}`
   */
  AuthHeaderAsBearerToken = 'AuthHeaderAsBearerToken',
}

export const enum ConfigKeys {
  MODEL_KEYS_CASE               = 'MODEL_KEYS_CASE',
  AUTH_HEADER                   = 'AUTH_HEADER',

  API_RESPONSE_PAGE_MODE        = 'API_RESPONSE_PAGE_MODE',
  API_RESPONSE_ASSOCIATION_MODE = 'API_RESPONSE_ASSOCIATION_MODE',

  IMAGE_API                     = 'IMAGE_API',
  VIDEO_API                     = 'VIDEO_API',
}

interface ConfigOpts {
  MODEL_KEYS_CASE?: StringCase;
  AUTH_HEADER?: AuthHeader;
  API_RESPONSE_PAGE_MODE?: ApiResponsePageMode;
  API_RESPONSE_ASSOCIATION_MODE?: ApiResponseAssociationMode;
  IMAGE_API?: string;
  VIDEO_API?: string;
}

const defaultConfiguration: ConfigOpts = {
  MODEL_KEYS_CASE              : StringCase.None,
  AUTH_HEADER                  : AuthHeader.AuthHeaderAsBearerToken,
  API_RESPONSE_PAGE_MODE       : ApiResponsePageMode.Default,
  /**
   * 配置关联数据返回的是 id 还是 entity，默认是 ID 模式
   */
  API_RESPONSE_ASSOCIATION_MODE: ApiResponseAssociationMode.ID,
};

class Config {
  opts = defaultConfiguration;

  update(opts: ConfigOpts = {}) {
    this.opts = Object.assign(this.opts, opts);
  }

  get(key: string, defaultValue?) {
    return this.opts[key] || defaultValue;
  }

  is(key: string, value) {
    // console.log({ opts: this.opts, key, value, result: this.opts[key] === value });
    return this.opts[key] === value;
  }
}

const config = new Config();

export { config };