export declare enum RequestType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}
export interface IExpressHandler {
    (req: any, res: any): any;
}
export interface IExpressMiddleware {
    (req: any, res: any, next: any): any;
}
export interface ParserOptions {
    enableCors?: boolean;
    buildReactive?: boolean;
    buildEndpoints?: boolean;
    groupByFolder?: boolean;
    regional?: string;
}
export interface EndpointOptions {
    enableCors?: boolean;
    enableFileUpload?: boolean;
}
export declare class Endpoint {
    name: string | undefined;
    requestType: RequestType;
    handler: IExpressHandler;
    middleware?: IExpressMiddleware[] | undefined;
    options?: EndpointOptions | undefined;
    constructor(name: string | undefined, requestType: RequestType, handler: IExpressHandler, middleware?: IExpressMiddleware[] | undefined, options?: EndpointOptions | undefined);
}
export declare class Get extends Endpoint {
    constructor(handler: IExpressHandler, middleware?: IExpressMiddleware[], options?: EndpointOptions);
}
export declare class Post extends Endpoint {
    constructor(handler: IExpressHandler, middleware?: IExpressMiddleware[], options?: EndpointOptions);
}
export declare class Put extends Endpoint {
    constructor(handler: IExpressHandler, middleware?: IExpressMiddleware[], options?: EndpointOptions);
}
export declare class Delete extends Endpoint {
    constructor(handler: IExpressHandler, middleware?: IExpressMiddleware[], options?: EndpointOptions);
}
export declare class Patch extends Endpoint {
    constructor(handler: IExpressHandler, middleware?: IExpressMiddleware[], options?: EndpointOptions);
}
