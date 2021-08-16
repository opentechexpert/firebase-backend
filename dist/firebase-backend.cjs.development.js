'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var fileUpload = _interopDefault(require('express-fileupload'));
var functions = require('firebase-functions');
var glob = _interopDefault(require('glob'));
var cors = _interopDefault(require('cors'));
var path = require('path');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

(function (RequestType) {
  RequestType["GET"] = "GET";
  RequestType["POST"] = "POST";
  RequestType["PUT"] = "PUT";
  RequestType["DELETE"] = "DELETE";
  RequestType["PATCH"] = "PATCH";
})(exports.RequestType || (exports.RequestType = {}));

var Endpoint = function Endpoint(name, requestType, handler, middleware, options) {
  this.name = name;
  this.requestType = requestType;
  this.handler = handler;
  this.middleware = middleware;
  this.options = options;

  if (!handler) {
    throw new Error('Please provide a endpoint request handler.');
  }

  this.name = name;
  this.handler = handler;
  this.middleware = middleware;
  this.requestType = requestType;
  this.options = options;
};
var Get = /*#__PURE__*/function (_Endpoint) {
  _inheritsLoose(Get, _Endpoint);

  function Get(handler, middleware, options) {
    return _Endpoint.call(this, undefined, exports.RequestType.GET, handler, middleware, options) || this;
  }

  return Get;
}(Endpoint);
var Post = /*#__PURE__*/function (_Endpoint2) {
  _inheritsLoose(Post, _Endpoint2);

  function Post(handler, middleware, options) {
    return _Endpoint2.call(this, undefined, exports.RequestType.POST, handler, middleware, options) || this;
  }

  return Post;
}(Endpoint);
var Put = /*#__PURE__*/function (_Endpoint3) {
  _inheritsLoose(Put, _Endpoint3);

  function Put(handler, middleware, options) {
    return _Endpoint3.call(this, undefined, exports.RequestType.PUT, handler, middleware, options) || this;
  }

  return Put;
}(Endpoint);
var Delete = /*#__PURE__*/function (_Endpoint4) {
  _inheritsLoose(Delete, _Endpoint4);

  function Delete(handler, middleware, options) {
    return _Endpoint4.call(this, undefined, exports.RequestType.DELETE, handler, middleware, options) || this;
  }

  return Delete;
}(Endpoint);
var Patch = /*#__PURE__*/function (_Endpoint5) {
  _inheritsLoose(Patch, _Endpoint5);

  function Patch(handler, middleware, options) {
    return _Endpoint5.call(this, undefined, exports.RequestType.PATCH, handler, middleware, options) || this;
  }

  return Patch;
}(Endpoint);

var _console = console,
    log = _console.log;
var FunctionParser = /*#__PURE__*/function () {
  function FunctionParser(rootPath, exports, options) {
    var _options$enableCors, _options$groupByFolde, _options$buildReactiv, _options$buildEndpoin, _options$regional;

    if (!rootPath) {
      throw new Error('rootPath is required to find the functions.');
    }

    this.rootPath = rootPath;
    this.exports = exports;
    this.enableCors = (_options$enableCors = options == null ? void 0 : options.enableCors) != null ? _options$enableCors : false;
    var groupByFolder = (_options$groupByFolde = options == null ? void 0 : options.groupByFolder) != null ? _options$groupByFolde : true;
    var buildReactive = (_options$buildReactiv = options == null ? void 0 : options.buildReactive) != null ? _options$buildReactiv : true;
    var buildEndpoints = (_options$buildEndpoin = options == null ? void 0 : options.buildEndpoints) != null ? _options$buildEndpoin : true;
    var regional = (_options$regional = options == null ? void 0 : options.regional) != null ? _options$regional : '';

    if (buildReactive) {
      this.buildReactiveFunctions(groupByFolder);
    }

    if (buildEndpoints) {
      this.buildRestfulApi(groupByFolder, regional);
    }
  }

  var _proto = FunctionParser.prototype;

  _proto.buildReactiveFunctions = function buildReactiveFunctions(groupByFolder) {
    var _this = this;

    log('Reactive Functions - Building...');
    var functionFiles = glob.sync(this.rootPath + "/**/*.function.js", {
      cwd: this.rootPath,
      ignore: './node_modules/**'
    });
    functionFiles.forEach(function (file) {
      var filePath = path.parse(file);
      var directories = filePath.dir.split('/');
      var groupName = groupByFolder ? directories[directories.length - 2] || '' : directories[directories.length - 1] || '';
      var functionName = filePath.name.replace('.function', '');

      if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName) {
        if (!_this.exports[groupName]) _this.exports[groupName] = {};
        log("Reactive Functions - Added " + groupName + "/" + functionName);
        _this.exports[groupName] = _extends({}, _this.exports[groupName], require(file));
      }
    });
    log('Reactive Functions - Built');
  };

  _proto.buildRestfulApi = function buildRestfulApi(groupByFolder, regional) {
    var _this2 = this;

    log('Restful Endpoints - Building...');
    var apiFiles = glob.sync(this.rootPath + "/**/*.endpoint.js", {
      cwd: this.rootPath,
      ignore: './node_modules/**'
    });
    var app = express();
    var groupRouters = new Map();
    apiFiles.forEach(function (file) {
      var filePath = path.parse(file);
      var directories = filePath.dir.split('/');
      var groupName = groupByFolder ? directories[directories.length - 2] || '' : directories[directories.length - 1] || '';
      var router = groupRouters.get(groupName);

      if (!router) {
        router = express.Router();
        groupRouters.set(groupName, router);
      }

      try {
        _this2.buildEndpoint(file, groupName, router);
      } catch (e) {
        throw new Error("Restful Endpoints - Failed to add the endpoint defined in " + file + " to the " + groupName + " Api.");
      }

      app.use('/', router);
      _this2.exports[groupName] = _extends({}, _this2.exports[groupName], {
        api: regional == '' ? functions.https.onRequest(app) : functions.region("" + regional).https.onRequest(app)
      });
    });
    log('Restful Endpoints - Built');
  };

  _proto.buildEndpoint = function buildEndpoint(file, groupName, router) {
    var _endpoint$options, _endpoint$options2;

    var filePath = path.parse(file);

    var endpoint = require(file)["default"];

    var name = endpoint.name || filePath.name.replace('.endpoint', '');
    var handler = endpoint.handler;
    var middleware = endpoint.middleware;

    if (this.enableCors) {
      router.use(cors());
    } else if ((_endpoint$options = endpoint.options) != null && _endpoint$options.enableCors) {
      log("Cors enabled for " + name);
      router.use(cors());
    }

    if ((_endpoint$options2 = endpoint.options) != null && _endpoint$options2.enableFileUpload) {
      log("File upload enabled for " + name);
      router.use(fileUpload());
    }

    switch (endpoint.requestType) {
      case exports.RequestType.GET:
        if (middleware) {
          var mw = middleware;
          router.get("/" + name, mw, handler);
          break;
        }

        router.get("/" + name, handler);
        break;

      case exports.RequestType.POST:
        if (middleware) {
          var _mw = middleware;
          router.post("/" + name, _mw, handler);
          break;
        }

        router.post("/" + name, handler);
        break;

      case exports.RequestType.PUT:
        if (middleware) {
          var _mw2 = middleware;
          router.put("/" + name, _mw2, handler);
          break;
        }

        router.put("/" + name, handler);
        break;

      case exports.RequestType.DELETE:
        if (middleware) {
          var _mw3 = middleware;
          router["delete"]("/" + name, _mw3, handler);
          break;
        }

        router["delete"]("/" + name, handler);
        break;

      case exports.RequestType.PATCH:
        if (middleware) {
          var _mw4 = middleware;
          router.patch("/" + name, _mw4, handler);
          break;
        }

        router.patch("/" + name, handler);
        break;

      default:
        throw new Error("A unsupported RequestType was defined for a Endpoint.\n\n          Please make sure that the Endpoint file exports a RequestType\n          using the constants in src/system/constants/requests.ts.\n\n          **This value is required to add the Endpoint to the API**");
    }

    log("Restful Endpoints - Added " + groupName + "/" + endpoint.requestType + ":" + name);
  };

  return FunctionParser;
}();

exports.Delete = Delete;
exports.Endpoint = Endpoint;
exports.FunctionParser = FunctionParser;
exports.Get = Get;
exports.Patch = Patch;
exports.Post = Post;
exports.Put = Put;
//# sourceMappingURL=firebase-backend.cjs.development.js.map
