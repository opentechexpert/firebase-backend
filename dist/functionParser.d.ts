import { ParserOptions } from './models';
export declare class FunctionParser {
    rootPath: string;
    enableCors: boolean;
    exports: any;
    constructor(rootPath: string, exports: any, options?: ParserOptions);
    private buildReactiveFunctions;
    private buildRestfulApi;
    private buildEndpoint;
}
