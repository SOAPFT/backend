/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./config/logging.config.ts":
/*!**********************************!*\
  !*** ./config/logging.config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.winstonConfig = void 0;\nconst nest_winston_1 = __webpack_require__(/*! nest-winston */ \"nest-winston\");\nconst winston = __webpack_require__(/*! winston */ \"winston\");\nconst DailyRotateFile = __webpack_require__(/*! winston-daily-rotate-file */ \"winston-daily-rotate-file\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nif (!fs.existsSync('logs')) {\n    fs.mkdirSync('logs');\n}\nconst fileFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());\nconst fileOptions = {\n    flags: 'a',\n    flush: true,\n};\nexports.winstonConfig = {\n    transports: [\n        new winston.transports.Console({\n            level:  false ? 0 : 'debug',\n            format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike('SOAPFT', {\n                prettyPrint: true,\n                colors: true,\n            })),\n        }),\n        new DailyRotateFile({\n            filename: 'logs/error-%DATE%.log',\n            datePattern: 'YYYY-MM-DD',\n            level: 'error',\n            maxSize: '20m',\n            maxFiles: '14d',\n            format: fileFormat,\n            options: fileOptions,\n            auditFile: 'logs/error-audit.json',\n        }),\n        new DailyRotateFile({\n            filename: 'logs/combined-%DATE%.log',\n            datePattern: 'YYYY-MM-DD',\n            maxSize: '20m',\n            maxFiles: '14d',\n            format: fileFormat,\n            options: fileOptions,\n            auditFile: 'logs/combined-audit.json',\n        }),\n        new DailyRotateFile({\n            filename: 'logs/http-%DATE%.log',\n            datePattern: 'YYYY-MM-DD',\n            level: 'debug',\n            maxSize: '20m',\n            maxFiles: '7d',\n            options: fileOptions,\n            auditFile: 'logs/http-audit.json',\n            format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.printf((info) => {\n                if (info.context === 'HttpLogger') {\n                    return JSON.stringify(info);\n                }\n                return null;\n            })),\n        }),\n    ],\n    exitOnError: false,\n    handleExceptions: true,\n};\n\n\n//# sourceURL=webpack://soapft-backend/./config/logging.config.ts?");

/***/ }),

/***/ "./config/orm.config.ts":
/*!******************************!*\
  !*** ./config/orm.config.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AppDataSource = exports.dataSourceOptions = exports.typeOrmConfig = void 0;\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst dotenv_1 = __webpack_require__(/*! dotenv */ \"dotenv\");\nconst nodeEnv = \"development\" || 0;\n(0, dotenv_1.config)({ path: `env/.${nodeEnv}.env` });\nconst typeOrmConfig = (configService) => {\n    return {\n        type: 'postgres',\n        host: configService.get('DB_HOST') || 'localhost',\n        port: parseInt(configService.get('DB_PORT') || '5432', 10),\n        username: configService.get('DB_USERNAME') || 'postgres',\n        password: configService.get('DB_PASSWORD') || 'postgres',\n        database: configService.get('DB_DATABASE') || 'soapft',\n        entities: [__dirname + '/../**/*.entity.{js,ts}'],\n        synchronize: configService.get('NODE_ENV') !== 'production',\n        logging: configService.get('NODE_ENV') !== 'production',\n        migrations: [__dirname + '/../database/migrations/**/*.{js,ts}'],\n        migrationsTableName: 'migrations',\n        ssl: configService.get('NODE_ENV') === 'production'\n            ? { rejectUnauthorized: false }\n            : false,\n    };\n};\nexports.typeOrmConfig = typeOrmConfig;\nexports.dataSourceOptions = {\n    type: 'postgres',\n    host: process.env.DB_HOST || 'localhost',\n    port: parseInt(process.env.DB_PORT || '5432', 10),\n    username: process.env.DB_USERNAME || 'postgres',\n    password: process.env.DB_PASSWORD || 'postgres',\n    database: process.env.DB_DATABASE || 'soapft',\n    entities: [__dirname + '/../**/*.entity.{js,ts}'],\n    migrations: [__dirname + '/../database/migrations/**/*.{js,ts}'],\n    migrationsTableName: 'migrations',\n    ssl:  false\n        ? 0\n        : false,\n};\nexports.AppDataSource = new typeorm_1.DataSource(exports.dataSourceOptions);\nexports[\"default\"] = exports.typeOrmConfig;\n\n\n//# sourceURL=webpack://soapft-backend/./config/orm.config.ts?");

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!******************************************************!*\
  !*** ./node_modules/webpack/hot/log-apply-result.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\n/**\n * @param {(string | number)[]} updatedModules updated modules\n * @param {(string | number)[] | null} renewedModules renewed modules\n */\nmodule.exports = function (updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function (moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function (moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function (moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function (moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t'[HMR] Consider using the optimization.moduleIds: \"named\" for module names.'\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack://soapft-backend/./node_modules/webpack/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!*****************************************!*\
  !*** ./node_modules/webpack/hot/log.js ***!
  \*****************************************/
/***/ ((module) => {

eval("/** @typedef {\"info\" | \"warning\" | \"error\"} LogLevel */\n\n/** @type {LogLevel} */\nvar logLevel = \"info\";\n\nfunction dummy() {}\n\n/**\n * @param {LogLevel} level log level\n * @returns {boolean} true, if should log\n */\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\n/**\n * @param {(msg?: string) => void} logFn log function\n * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient\n */\nfunction logGroup(logFn) {\n\treturn function (level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\n/**\n * @param {LogLevel} level log level\n * @param {string|Error} msg message\n */\nmodule.exports = function (level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\n/**\n * @param {LogLevel} level log level\n */\nmodule.exports.setLogLevel = function (level) {\n\tlogLevel = level;\n};\n\n/**\n * @param {Error} err error\n * @returns {string} formatted error\n */\nmodule.exports.formatError = function (err) {\n\tvar message = err.message;\n\tvar stack = err.stack;\n\tif (!stack) {\n\t\treturn message;\n\t} else if (stack.indexOf(message) < 0) {\n\t\treturn message + \"\\n\" + stack;\n\t}\n\treturn stack;\n};\n\n\n//# sourceURL=webpack://soapft-backend/./node_modules/webpack/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!**********************************************!*\
  !*** ./node_modules/webpack/hot/poll.js?100 ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var __resourceQuery = \"?100\";\n/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/* globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.slice(1) || 0;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\t/**\n\t * @param {boolean=} fromUpdate true when called from update\n\t */\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function (updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function (err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + log.formatError(err));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + log.formatError(err));\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n\n//# sourceURL=webpack://soapft-backend/./node_modules/webpack/hot/poll.js?");

/***/ }),

/***/ "./src/app.controller.ts":
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AppController = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst app_service_1 = __webpack_require__(/*! ./app.service */ \"./src/app.service.ts\");\nconst winston_1 = __webpack_require__(/*! winston */ \"winston\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ./decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nlet AppController = class AppController {\n    constructor(appService, logger) {\n        this.appService = appService;\n        this.logger = logger;\n    }\n    getHello() {\n        this.logger.info('Called getHello()');\n        this.logger.debug('Debug message');\n        this.logger.error('Error message');\n        return this.appService.getHello();\n    }\n    healthCheck() {\n        return {\n            status: 'ok',\n            timestamp: new Date().toISOString(),\n            uptime: process.uptime(),\n        };\n    }\n};\nexports.AppController = AppController;\n__decorate([\n    (0, common_1.Get)('logger'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", String)\n], AppController.prototype, \"getHello\", null);\n__decorate([\n    (0, common_1.Get)('health'),\n    (0, swagger_decorator_1.ApiHealthCheck)(),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", void 0)\n], AppController.prototype, \"healthCheck\", null);\nexports.AppController = AppController = __decorate([\n    (0, swagger_1.ApiTags)('System'),\n    (0, common_1.Controller)(),\n    __param(1, (0, common_1.Inject)('winston')),\n    __metadata(\"design:paramtypes\", [app_service_1.AppService,\n        winston_1.Logger])\n], AppController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/app.controller.ts?");

/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AppModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst app_controller_1 = __webpack_require__(/*! ./app.controller */ \"./src/app.controller.ts\");\nconst app_service_1 = __webpack_require__(/*! ./app.service */ \"./src/app.service.ts\");\nconst nest_winston_1 = __webpack_require__(/*! nest-winston */ \"nest-winston\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst orm_config_1 = __webpack_require__(/*! ../config/orm.config */ \"./config/orm.config.ts\");\nconst logging_config_1 = __webpack_require__(/*! ../config/logging.config */ \"./config/logging.config.ts\");\nconst uploads_module_1 = __webpack_require__(/*! ./modules/uploads/uploads.module */ \"./src/modules/uploads/uploads.module.ts\");\nconst s3_module_1 = __webpack_require__(/*! ./modules/s3/s3.module */ \"./src/modules/s3/s3.module.ts\");\nconst auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ \"./src/auth/auth.module.ts\");\nconst posts_module_1 = __webpack_require__(/*! ./modules/posts/posts.module */ \"./src/modules/posts/posts.module.ts\");\nconst http_logger_middleware_1 = __webpack_require__(/*! ./middlewares/http-logger.middleware */ \"./src/middlewares/http-logger.middleware.ts\");\nconst comments_module_1 = __webpack_require__(/*! ./modules/comments/comments.module */ \"./src/modules/comments/comments.module.ts\");\nconst likes_module_1 = __webpack_require__(/*! ./modules/likes/likes.module */ \"./src/modules/likes/likes.module.ts\");\nconst users_module_1 = __webpack_require__(/*! ./modules/users/users.module */ \"./src/modules/users/users.module.ts\");\nconst challenge_module_1 = __webpack_require__(/*! ./modules/challenges/challenge.module */ \"./src/modules/challenges/challenge.module.ts\");\nlet AppModule = class AppModule {\n    configure(consumer) {\n        consumer.apply(http_logger_middleware_1.HttpLoggerMiddleware).forRoutes('*');\n    }\n};\nexports.AppModule = AppModule;\nexports.AppModule = AppModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            config_1.ConfigModule.forRoot({\n                envFilePath: `env/.${\"development\" || 0}.env`,\n                isGlobal: true,\n            }),\n            nest_winston_1.WinstonModule.forRoot(logging_config_1.winstonConfig),\n            typeorm_1.TypeOrmModule.forRootAsync({\n                imports: [config_1.ConfigModule],\n                inject: [config_1.ConfigService],\n                useFactory: (configService) => (0, orm_config_1.default)(configService),\n            }),\n            uploads_module_1.UploadsModule,\n            s3_module_1.S3Module,\n            auth_module_1.AuthModule,\n            posts_module_1.PostsModule,\n            comments_module_1.CommentsModule,\n            likes_module_1.LikesModule,\n            users_module_1.UsersModule,\n            challenge_module_1.ChallengeModule,\n        ],\n        controllers: [app_controller_1.AppController],\n        providers: [app_service_1.AppService],\n    })\n], AppModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/app.module.ts?");

/***/ }),

/***/ "./src/app.service.ts":
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AppService = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nlet AppService = class AppService {\n    getHello() {\n        console.log(process.env.PORT);\n        return 'Hello World!';\n    }\n};\nexports.AppService = AppService;\nexports.AppService = AppService = __decorate([\n    (0, common_1.Injectable)()\n], AppService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/app.service.ts?");

/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AuthController = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst auth_service_1 = __webpack_require__(/*! ./auth.service */ \"./src/auth/auth.service.ts\");\nconst auth_swagger_1 = __webpack_require__(/*! ./decorators/auth.swagger */ \"./src/auth/decorators/auth.swagger.ts\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst auth_dto_1 = __webpack_require__(/*! ./dto/auth.dto */ \"./src/auth/dto/auth.dto.ts\");\nconst jwt_auth_guard_1 = __webpack_require__(/*! ./guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nconst user_uuid_decorator_1 = __webpack_require__(/*! @/decorators/user-uuid.decorator */ \"./src/decorators/user-uuid.decorator.ts\");\nlet AuthController = class AuthController {\n    constructor(authService) {\n        this.authService = authService;\n    }\n    async kakaoAuthCallback(code, res) {\n        return this.authService.kakaoLogin(code, res);\n    }\n    async naverAuthCallback(code, res) {\n        return this.authService.naverLogin(code, res);\n    }\n    async Refresh(req, res) {\n        return this.authService.RefreshToken(req, res);\n    }\n    async getDevToken(devLoginDto, res) {\n        return this.authService.generateDevToken(devLoginDto.userUuid, res);\n    }\n    async testAuth(userUuid) {\n        return {\n            message: '인증 성공',\n            userUuid,\n            timestamp: new Date().toISOString(),\n        };\n    }\n};\nexports.AuthController = AuthController;\n__decorate([\n    (0, common_1.Post)('kakao'),\n    (0, auth_swagger_1.ApiKakaoLogin)(),\n    __param(0, (0, common_1.Body)('code')),\n    __param(1, (0, common_1.Res)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"kakaoAuthCallback\", null);\n__decorate([\n    (0, common_1.Post)('naver'),\n    (0, auth_swagger_1.ApiNaverLogin)(),\n    __param(0, (0, common_1.Body)('code')),\n    __param(1, (0, common_1.Res)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"naverAuthCallback\", null);\n__decorate([\n    (0, common_1.Post)('refresh'),\n    (0, auth_swagger_1.ApiRefreshToken)(),\n    __param(0, (0, common_1.Req)()),\n    __param(1, (0, common_1.Res)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"Refresh\", null);\n__decorate([\n    (0, common_1.Post)('dev-token'),\n    (0, auth_swagger_1.ApiDevToken)(),\n    __param(0, (0, common_1.Body)()),\n    __param(1, (0, common_1.Res)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [auth_dto_1.DevLoginDto, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"getDevToken\", null);\n__decorate([\n    (0, common_1.Get)('auth-test'),\n    (0, auth_swagger_1.ApiTestAuth)(),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    __param(0, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"testAuth\", null);\nexports.AuthController = AuthController = __decorate([\n    (0, swagger_1.ApiTags)('auth'),\n    (0, common_1.Controller)('auth'),\n    __metadata(\"design:paramtypes\", [auth_service_1.AuthService])\n], AuthController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/auth/auth.controller.ts?");

/***/ }),

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AuthModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst auth_controller_1 = __webpack_require__(/*! ./auth.controller */ \"./src/auth/auth.controller.ts\");\nconst auth_service_1 = __webpack_require__(/*! ./auth.service */ \"./src/auth/auth.service.ts\");\nconst auth_entity_1 = __webpack_require__(/*! @/entities/auth.entity */ \"./src/entities/auth.entity.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst users_service_1 = __webpack_require__(/*! @/modules/users/users.service */ \"./src/modules/users/users.service.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nconst jwt_1 = __webpack_require__(/*! @nestjs/jwt */ \"@nestjs/jwt\");\nconst jwt_strategy_1 = __webpack_require__(/*! ./strategy/jwt.strategy */ \"./src/auth/strategy/jwt.strategy.ts\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nconst post_entity_1 = __webpack_require__(/*! @/entities/post.entity */ \"./src/entities/post.entity.ts\");\nconst users_module_1 = __webpack_require__(/*! @/modules/users/users.module */ \"./src/modules/users/users.module.ts\");\nlet AuthModule = class AuthModule {\n};\nexports.AuthModule = AuthModule;\nexports.AuthModule = AuthModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            config_1.ConfigModule.forRoot(),\n            typeorm_1.TypeOrmModule.forFeature([auth_entity_1.Auth, user_entity_1.User, post_entity_1.Post]),\n            passport_1.PassportModule,\n            jwt_1.JwtModule.register({}),\n            (0, common_1.forwardRef)(() => users_module_1.UsersModule),\n        ],\n        controllers: [auth_controller_1.AuthController],\n        providers: [auth_service_1.AuthService, users_service_1.UsersService, jwt_strategy_1.JwtStrategy],\n    })\n], AuthModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/auth/auth.module.ts?");

/***/ }),

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AuthService = void 0;\nconst auth_entity_1 = __webpack_require__(/*! @/entities/auth.entity */ \"./src/entities/auth.entity.ts\");\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst typeorm_2 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst users_service_1 = __webpack_require__(/*! @/modules/users/users.service */ \"./src/modules/users/users.service.ts\");\nconst uuid_1 = __webpack_require__(/*! uuid */ \"uuid\");\nconst jwt_1 = __webpack_require__(/*! @nestjs/jwt */ \"@nestjs/jwt\");\nconst nanoid_1 = __webpack_require__(/*! nanoid */ \"nanoid\");\nconst axios_1 = __webpack_require__(/*! axios */ \"axios\");\nconst bcrypt = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\nconst social_provider_enum_1 = __webpack_require__(/*! @/types/social-provider.enum */ \"./src/types/social-provider.enum.ts\");\nlet AuthService = class AuthService {\n    constructor(authRepository, userService, jwtService) {\n        this.authRepository = authRepository;\n        this.userService = userService;\n        this.jwtService = jwtService;\n    }\n    async handleSocialLogin(user, res) {\n        let findUser = await this.userService.findOneBySocialId(user.socialId);\n        if (!findUser) {\n            const uuid = (0, uuid_1.v4)();\n            findUser = await this.userService.createUser(user, uuid);\n        }\n        const findUserPayload = { userUuid: findUser.userUuid };\n        const access_token = await this.jwtService.sign(findUserPayload, {\n            secret: process.env.JWT_ACCESS_TOKEN_SECRET,\n            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,\n        });\n        const refresh_token = await this.jwtService.sign(findUserPayload, {\n            secret: process.env.JWT_REFRESH_TOKEN_SECRET,\n            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,\n        });\n        const existingAuth = await this.authRepository.findOne({\n            where: { userUuid: findUser.userUuid },\n        });\n        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);\n        if (existingAuth) {\n            existingAuth.refreshToken = hashedRefreshToken;\n            await this.authRepository.save(existingAuth);\n        }\n        else {\n            const newAuth = await this.authRepository.create({\n                userUuid: findUser.userUuid,\n                refreshToken: hashedRefreshToken,\n            });\n            await this.authRepository.save(newAuth);\n        }\n        return res.json({\n            access_token,\n            refresh_token,\n            message: '로그인 성공',\n        });\n    }\n    async kakaoLogin(code, res) {\n        try {\n            const tokenResponse = await axios_1.default.post('https://kauth.kakao.com/oauth/token', null, {\n                params: {\n                    grant_type: 'authorization_code',\n                    client_id: process.env.KAKAO_REST_API_KEY,\n                    redirect_uri: process.env.KAKAO_REDIRECT_URL,\n                    code: code,\n                },\n                headers: {\n                    'Content-Type': 'application/x-www-form-urlencoded',\n                },\n            });\n            const kakaoAccessToken = tokenResponse.data.access_token;\n            const userResponse = await axios_1.default.get('https://kapi.kakao.com/v2/user/me', {\n                headers: {\n                    Authorization: `Bearer ${kakaoAccessToken}`,\n                },\n            });\n            const kakaoUser = userResponse.data;\n            const randomId = (0, nanoid_1.customAlphabet)('0123456789abcdefghijklmnopqrstuvwxyz', 4);\n            const user = {\n                socialId: kakaoUser.id.toString(),\n                socialNickname: kakaoUser.properties?.nickname || '',\n                nickname: `익명_${randomId()}`,\n                profileImage: kakaoUser.properties?.profile_image || '',\n                socialProvider: social_provider_enum_1.SocialProvider.KAKAO,\n                introduction: null,\n            };\n            return await this.handleSocialLogin(user, res);\n        }\n        catch (error) {\n            console.log(error);\n            return res.status(401).json({ message: '카카오 로그인 실패', error });\n        }\n    }\n    async naverLogin(code, res) {\n        try {\n            const tokenRes = await axios_1.default.post('https://nid.naver.com/oauth2.0/token', null, {\n                params: {\n                    grant_type: 'authorization_code',\n                    client_id: process.env.NAVER_ID,\n                    client_secret: process.env.NAVER_SECRET,\n                    code,\n                },\n                headers: {\n                    'Content-Type': 'application/x-www-form-urlencoded',\n                },\n            });\n            const accessToken = tokenRes.data.access_token;\n            const userRes = await axios_1.default.get('https://openapi.naver.com/v1/nid/me', {\n                headers: {\n                    Authorization: `Bearer ${accessToken}`,\n                },\n            });\n            const profile = userRes.data.response;\n            const randomId = (0, nanoid_1.customAlphabet)('0123456789abcdefghijklmnopqrstuvwxyz', 4);\n            const user = {\n                socialId: profile.id,\n                socialNickname: profile.nickname || '',\n                nickname: `익명_${randomId()}`,\n                profileImage: profile.profile_image || '',\n                socialProvider: social_provider_enum_1.SocialProvider.NAVER,\n                introduction: null,\n            };\n            return this.handleSocialLogin(user, res);\n        }\n        catch (error) {\n            console.log(error);\n            return res.status(401).json({ message: '네이버 로그인 실패', error });\n        }\n    }\n    async RefreshToken(req, res) {\n        console.log('req.headers: ', req.headers);\n        const refreshToken = req.headers['authorization']?.replace('Bearer ', '');\n        console.log('refreshToken:', refreshToken);\n        if (!refreshToken) {\n            return res.status(401).json({ message: '리프레시 토큰 없음' });\n        }\n        try {\n            const payload = await this.jwtService.verifyAsync(refreshToken, {\n                secret: process.env.JWT_REFRESH_TOKEN_SECRET,\n            });\n            console.log('payload:', payload);\n            const auth = await this.authRepository.findOne({\n                where: { userUuid: payload.userUuid },\n            });\n            if (!auth) {\n                console.log('에러나옴');\n                return res.status(401).json({ message: '유효하지 않음' });\n            }\n            console.log('auth.refereshToken:', auth.refreshToken);\n            if (!auth || !(await bcrypt.compare(refreshToken, auth.refreshToken))) {\n                return res.status(401).json({ message: '리프레시 토큰 불일치' });\n            }\n            const newAccessToken = this.jwtService.sign({\n                userUuid: payload.userUuid,\n            }, {\n                secret: process.env.JWT_ACCESS_TOKEN_SECRET,\n                expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRES_IN}`,\n            });\n            const nowInSec = Math.floor(Date.now() / 1000);\n            let newRefreshToken = null;\n            let hashedRefreshToken = null;\n            if (payload.exp && payload.exp < nowInSec) {\n                newRefreshToken = this.jwtService.sign({ userUuid: payload.userUuid }, {\n                    secret: process.env.JWT_REFRESH_TOKEN_SECRET,\n                    expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRES_IN}`,\n                });\n                hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);\n                auth.refreshToken = hashedRefreshToken;\n                await this.authRepository.save(auth);\n            }\n            return res.json({\n                message: newRefreshToken\n                    ? 'accessToken 및 refreshToken 재발급 완료'\n                    : 'accessToken 재발급 완료',\n                access_token: newAccessToken,\n                refresh_token: newRefreshToken ? newRefreshToken : null,\n            });\n        }\n        catch (error) {\n            console.log(error);\n            return res\n                .status(401)\n                .json({ message: '리프레시 토큰 만료 혹은 잘못됨' });\n        }\n    }\n    async generateDevToken(userUuid, res) {\n        try {\n            await this.userService.checkUserExists(userUuid);\n            const payload = { userUuid };\n            const access_token = await this.jwtService.sign(payload, {\n                secret: process.env.JWT_ACCESS_TOKEN_SECRET,\n                expiresIn: '30d',\n            });\n            const refresh_token = await this.jwtService.sign(payload, {\n                secret: process.env.JWT_REFRESH_TOKEN_SECRET,\n                expiresIn: '30d',\n            });\n            const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);\n            const existingAuth = await this.authRepository.findOne({\n                where: { userUuid },\n            });\n            if (existingAuth) {\n                existingAuth.refreshToken = hashedRefreshToken;\n                await this.authRepository.save(existingAuth);\n            }\n            else {\n                const newAuth = this.authRepository.create({\n                    userUuid,\n                    refreshToken: hashedRefreshToken,\n                });\n                await this.authRepository.save(newAuth);\n            }\n            return res.json({\n                access_token,\n                refresh_token,\n            });\n        }\n        catch (error) {\n            console.error('개발용 토큰 생성 에러:', error);\n            return res.status(500).json({\n                message: '개발용 토큰 생성 실패',\n                error: error.message,\n            });\n        }\n    }\n};\nexports.AuthService = AuthService;\nexports.AuthService = AuthService = __decorate([\n    (0, common_1.Injectable)(),\n    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),\n    __metadata(\"design:paramtypes\", [typeorm_2.Repository,\n        users_service_1.UsersService,\n        jwt_1.JwtService])\n], AuthService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/auth/auth.service.ts?");

/***/ }),

/***/ "./src/auth/decorators/auth.swagger.ts":
/*!*********************************************!*\
  !*** ./src/auth/decorators/auth.swagger.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiKakaoLogin = ApiKakaoLogin;\nexports.ApiNaverLogin = ApiNaverLogin;\nexports.ApiAppleLogin = ApiAppleLogin;\nexports.ApiRefreshToken = ApiRefreshToken;\nexports.ApiLogout = ApiLogout;\nexports.ApiVerifyToken = ApiVerifyToken;\nexports.ApiDevToken = ApiDevToken;\nexports.ApiTestAuth = ApiTestAuth;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ../../decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nfunction ApiKakaoLogin() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '카카오 로그인',\n        description: '카카오 소셜 로그인을 진행합니다.',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '로그인 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                accessToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                refreshToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                user: {\n                    type: 'object',\n                    properties: {\n                        id: { type: 'number', example: 1 },\n                        nickname: { type: 'string', example: '사용자' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('AUTH_004', '소셜 로그인에 실패했습니다.', 401)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('AUTH_006', '지원하지 않는 소셜 제공자입니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiNaverLogin() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '네이버 로그인',\n        description: '네이버 소셜 로그인을 진행합니다.',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '로그인 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                accessToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                refreshToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                user: {\n                    type: 'object',\n                    properties: {\n                        id: { type: 'number', example: 1 },\n                        nickname: { type: 'string', example: '사용자' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('AUTH_004', '소셜 로그인에 실패했습니다.', 401)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('AUTH_006', '지원하지 않는 소셜 제공자입니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiAppleLogin() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '애플 로그인',\n        description: '애플 소셜 로그인을 진행합니다.',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '로그인 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                accessToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                refreshToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                user: {\n                    type: 'object',\n                    properties: {\n                        id: { type: 'number', example: 1 },\n                        nickname: { type: 'string', example: '사용자' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('AUTH_004', '소셜 로그인에 실패했습니다.', 401)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('AUTH_006', '지원하지 않는 소셜 제공자입니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiRefreshToken() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '토큰 갱신',\n        description: '리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            required: ['refreshToken'],\n            properties: {\n                refreshToken: {\n                    type: 'string',\n                    description: '리프레시 토큰',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '토큰 갱신 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                accessToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                refreshToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('AUTH_005', '유효하지 않은 리프레시 토큰입니다.', 401)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.TokenExpired), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiLogout() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '로그아웃',\n        description: '사용자 로그아웃을 처리합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '로그아웃 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '로그아웃되었습니다.',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiVerifyToken() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '토큰 검증',\n        description: '액세스 토큰의 유효성을 검증합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '토큰이 유효함',\n        schema: {\n            type: 'object',\n            properties: {\n                valid: {\n                    type: 'boolean',\n                    example: true,\n                },\n                user: {\n                    type: 'object',\n                    properties: {\n                        id: { type: 'number', example: 1 },\n                        nickname: { type: 'string', example: '사용자' },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.TokenExpired), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiDevToken() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '[개발용] 토큰 생성',\n        description: '개발 환경에서 테스트용 토큰을 생성합니다.',\n    }), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            required: ['userId'],\n            properties: {\n                userId: {\n                    type: 'number',\n                    description: '사용자 ID',\n                    example: 1,\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '토큰 생성 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                accessToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n                refreshToken: {\n                    type: 'string',\n                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('USER_001', '사용자를 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiTestAuth() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '[개발용] 인증 테스트',\n        description: '인증이 필요한 엔드포인트 테스트용입니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '인증 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '인증된 사용자입니다.',\n                },\n                user: {\n                    type: 'object',\n                    properties: {\n                        id: { type: 'number', example: 1 },\n                        nickname: { type: 'string', example: '사용자' },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.TokenExpired), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/auth/decorators/auth.swagger.ts?");

/***/ }),

/***/ "./src/auth/dto/auth.dto.ts":
/*!**********************************!*\
  !*** ./src/auth/dto/auth.dto.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DevLoginDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass DevLoginDto {\n}\nexports.DevLoginDto = DevLoginDto;\n__decorate([\n    (0, class_validator_1.IsString)(),\n    (0, class_validator_1.IsNotEmpty)(),\n    __metadata(\"design:type\", String)\n], DevLoginDto.prototype, \"userUuid\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/auth/dto/auth.dto.ts?");

/***/ }),

/***/ "./src/auth/guards/jwt-auth.guard.ts":
/*!*******************************************!*\
  !*** ./src/auth/guards/jwt-auth.guard.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.JwtAuthGuard = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nlet JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {\n    canActivate(context) {\n        return super.canActivate(context);\n    }\n    handleRequest(err, user, info) {\n        if (err || !user) {\n            console.log('JwtAuthGuard error:', err, info);\n            throw err || new common_1.UnauthorizedException();\n        }\n        return user;\n    }\n};\nexports.JwtAuthGuard = JwtAuthGuard;\nexports.JwtAuthGuard = JwtAuthGuard = __decorate([\n    (0, common_1.Injectable)()\n], JwtAuthGuard);\n\n\n//# sourceURL=webpack://soapft-backend/./src/auth/guards/jwt-auth.guard.ts?");

/***/ }),

/***/ "./src/auth/strategy/jwt.strategy.ts":
/*!*******************************************!*\
  !*** ./src/auth/strategy/jwt.strategy.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.JwtStrategy = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nconst passport_jwt_1 = __webpack_require__(/*! passport-jwt */ \"passport-jwt\");\nlet JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {\n    constructor() {\n        super({\n            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),\n            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,\n            passReqToCallback: true,\n        });\n    }\n    async validate(req, payload) {\n        const { userUuid } = payload;\n        if (!userUuid) {\n            console.log('Invalid token');\n            throw new common_1.UnauthorizedException('Invalid token');\n        }\n        req.user = { userUuid };\n        return { userUuid };\n    }\n};\nexports.JwtStrategy = JwtStrategy;\nexports.JwtStrategy = JwtStrategy = __decorate([\n    (0, common_1.Injectable)(),\n    __metadata(\"design:paramtypes\", [])\n], JwtStrategy);\n\n\n//# sourceURL=webpack://soapft-backend/./src/auth/strategy/jwt.strategy.ts?");

/***/ }),

/***/ "./src/decorators/file-interceptor.decorator.ts":
/*!******************************************************!*\
  !*** ./src/decorators/file-interceptor.decorator.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ImageFileInterceptor = ImageFileInterceptor;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ \"@nestjs/platform-express\");\nfunction ImageFileInterceptor(fieldName = 'image', maxSize = 10 * 1024 * 1024) {\n    return (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)(fieldName, {\n        limits: {\n            fileSize: maxSize,\n        },\n        fileFilter: (req, file, cb) => {\n            if (!file.mimetype.match(/^image\\/(jpg|jpeg|png|gif)$/)) {\n                return cb(new common_1.BadRequestException('이미지 파일만 업로드 가능합니다.'), false);\n            }\n            cb(null, true);\n        },\n    }));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/decorators/file-interceptor.decorator.ts?");

/***/ }),

/***/ "./src/decorators/swagger.decorator.ts":
/*!*********************************************!*\
  !*** ./src/decorators/swagger.decorator.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PaginationSchema = exports.ErrorResponses = exports.CommonErrorResponses = exports.CommonAuthResponses = exports.CommonErrorSchema = void 0;\nexports.createErrorResponse = createErrorResponse;\nexports.ApiHealthCheck = ApiHealthCheck;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nexports.CommonErrorSchema = {\n    type: 'object',\n    properties: {\n        success: {\n            type: 'boolean',\n            example: false,\n            description: '요청 성공 여부',\n        },\n        errorCode: {\n            type: 'string',\n            description: '에러 코드',\n            example: 'SYS_001',\n        },\n        message: {\n            type: 'string',\n            description: '에러 메시지',\n            example: '잘못된 요청입니다.',\n        },\n        timestamp: {\n            type: 'string',\n            format: 'date-time',\n            description: '에러 발생 시각',\n            example: '2025-06-22T12:00:00.000Z',\n        },\n        path: {\n            type: 'string',\n            description: '요청 경로',\n            example: '/api/users/profile',\n        },\n        method: {\n            type: 'string',\n            description: 'HTTP 메서드',\n            example: 'POST',\n        },\n        details: {\n            type: 'object',\n            description: '에러 상세 정보 (선택적)',\n            additionalProperties: true,\n            example: {},\n        },\n    },\n    required: ['success', 'errorCode', 'message', 'timestamp', 'path', 'method'],\n};\nfunction createErrorResponse(errorCode, message, statusCode, example, method) {\n    return {\n        status: statusCode,\n        description: message,\n        schema: {\n            ...exports.CommonErrorSchema,\n            properties: {\n                ...exports.CommonErrorSchema.properties,\n                errorCode: {\n                    ...exports.CommonErrorSchema.properties.errorCode,\n                    example: errorCode,\n                },\n                message: {\n                    ...exports.CommonErrorSchema.properties.message,\n                    example: message,\n                },\n                method: method\n                    ? {\n                        ...exports.CommonErrorSchema.properties.method,\n                        example: method,\n                    }\n                    : exports.CommonErrorSchema.properties.method,\n                details: example\n                    ? {\n                        ...exports.CommonErrorSchema.properties.details,\n                        example,\n                    }\n                    : exports.CommonErrorSchema.properties.details,\n            },\n        },\n    };\n}\nexports.CommonAuthResponses = {\n    Unauthorized: createErrorResponse('AUTH_001', '유효하지 않은 토큰입니다.', 401),\n    Forbidden: createErrorResponse('AUTH_002', '권한이 없습니다.', 403),\n    TokenExpired: createErrorResponse('AUTH_003', '토큰이 만료되었습니다.', 401),\n};\nexports.CommonErrorResponses = {\n    BadRequest: createErrorResponse('SYS_001', '잘못된 요청입니다.', 400),\n    ValidationFailed: createErrorResponse('SYS_002', '입력값 검증에 실패했습니다.', 400),\n    NotFound: createErrorResponse('SYS_003', '요청한 리소스를 찾을 수 없습니다.', 404),\n    InternalServerError: createErrorResponse('SYS_005', '서버 내부 오류가 발생했습니다.', 500),\n    DatabaseError: createErrorResponse('SYS_006', '데이터베이스 오류가 발생했습니다.', 500),\n    ExternalApiError: createErrorResponse('SYS_007', '외부 API 호출에 실패했습니다.', 502),\n};\nexports.ErrorResponses = {\n    GET: (errorCode, message, statusCode, example) => createErrorResponse(errorCode, message, statusCode, example, 'GET'),\n    POST: (errorCode, message, statusCode, example) => createErrorResponse(errorCode, message, statusCode, example, 'POST'),\n    PUT: (errorCode, message, statusCode, example) => createErrorResponse(errorCode, message, statusCode, example, 'PUT'),\n    PATCH: (errorCode, message, statusCode, example) => createErrorResponse(errorCode, message, statusCode, example, 'PATCH'),\n    DELETE: (errorCode, message, statusCode, example) => createErrorResponse(errorCode, message, statusCode, example, 'DELETE'),\n};\nexports.PaginationSchema = {\n    type: 'object',\n    properties: {\n        currentPage: {\n            type: 'number',\n            description: '현재 페이지',\n            example: 1,\n        },\n        totalPages: {\n            type: 'number',\n            description: '전체 페이지 수',\n            example: 10,\n        },\n        totalItems: {\n            type: 'number',\n            description: '전체 항목 수',\n            example: 100,\n        },\n        itemsPerPage: {\n            type: 'number',\n            description: '페이지당 항목 수',\n            example: 10,\n        },\n        hasNext: {\n            type: 'boolean',\n            description: '다음 페이지 존재 여부',\n            example: true,\n        },\n        hasPrev: {\n            type: 'boolean',\n            description: '이전 페이지 존재 여부',\n            example: false,\n        },\n    },\n};\nfunction ApiHealthCheck() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '헬스 체크',\n        description: '서버 상태를 확인합니다.',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '서버 정상 동작',\n        schema: {\n            type: 'object',\n            properties: {\n                status: {\n                    type: 'string',\n                    example: 'ok',\n                },\n                timestamp: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n                uptime: {\n                    type: 'number',\n                    description: '서버 가동 시간 (초)',\n                    example: 3600,\n                },\n            },\n        },\n    }));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/decorators/swagger.decorator.ts?");

/***/ }),

/***/ "./src/decorators/user-uuid.decorator.ts":
/*!***********************************************!*\
  !*** ./src/decorators/user-uuid.decorator.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UserUuid = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nexports.UserUuid = (0, common_1.createParamDecorator)((data, ctx) => {\n    const request = ctx.switchToHttp().getRequest();\n    return request.user?.userUuid;\n});\n\n\n//# sourceURL=webpack://soapft-backend/./src/decorators/user-uuid.decorator.ts?");

/***/ }),

/***/ "./src/entities/auth.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/auth.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Auth = void 0;\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nlet Auth = class Auth {\n};\nexports.Auth = Auth;\n__decorate([\n    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),\n    __metadata(\"design:type\", Number)\n], Auth.prototype, \"id\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'user_uuid', type: 'varchar', length: 26 }),\n    __metadata(\"design:type\", String)\n], Auth.prototype, \"userUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'refresh_token', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Auth.prototype, \"refreshToken\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Auth.prototype, \"deviceId\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'device_type', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Auth.prototype, \"deviceType\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'app_version', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Auth.prototype, \"appVersion\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamptz', nullable: true }),\n    __metadata(\"design:type\", Date)\n], Auth.prototype, \"lastLoginAt\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamptz', nullable: true }),\n    __metadata(\"design:type\", Date)\n], Auth.prototype, \"expiresAt\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),\n    __metadata(\"design:type\", Boolean)\n], Auth.prototype, \"isActive\", void 0);\n__decorate([\n    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Auth.prototype, \"createdAt\", void 0);\n__decorate([\n    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Auth.prototype, \"updatedAt\", void 0);\nexports.Auth = Auth = __decorate([\n    (0, typeorm_1.Entity)('auth')\n], Auth);\n\n\n//# sourceURL=webpack://soapft-backend/./src/entities/auth.entity.ts?");

/***/ }),

/***/ "./src/entities/challenge.entity.ts":
/*!******************************************!*\
  !*** ./src/entities/challenge.entity.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Challenge = void 0;\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst challenge_enum_1 = __webpack_require__(/*! @/types/challenge.enum */ \"./src/types/challenge.enum.ts\");\nlet Challenge = class Challenge {\n};\nexports.Challenge = Challenge;\n__decorate([\n    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),\n    __metadata(\"design:type\", Number)\n], Challenge.prototype, \"id\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'challenge_uuid', type: 'varchar', length: 26, unique: true }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"challengeUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'title', type: 'varchar' }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"title\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({\n        name: 'type',\n        type: 'enum',\n        enum: challenge_enum_1.ChallengeType,\n    }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"type\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'profile', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"profile\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'banner', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"banner\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'introduce', type: 'text' }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"introduce\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'start_date', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Challenge.prototype, \"startDate\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'end_date', type: 'timestamptz', nullable: true }),\n    __metadata(\"design:type\", Date)\n], Challenge.prototype, \"endDate\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'goal', type: 'int' }),\n    __metadata(\"design:type\", Number)\n], Challenge.prototype, \"goal\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'start_age', type: 'int' }),\n    __metadata(\"design:type\", Number)\n], Challenge.prototype, \"startAge\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'end_age', type: 'int', nullable: true }),\n    __metadata(\"design:type\", Number)\n], Challenge.prototype, \"endAge\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({\n        name: 'gender',\n        type: 'enum',\n        enum: challenge_enum_1.GenderType,\n    }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"gender\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'max_member', type: 'int' }),\n    __metadata(\"design:type\", Number)\n], Challenge.prototype, \"maxMember\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'creator_uuid', type: 'varchar', length: 26 }),\n    __metadata(\"design:type\", String)\n], Challenge.prototype, \"creatorUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'participant_uuid', type: 'varchar', array: true }),\n    __metadata(\"design:type\", Array)\n], Challenge.prototype, \"participantUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'coin_amount', type: 'int' }),\n    __metadata(\"design:type\", Number)\n], Challenge.prototype, \"coinAmount\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'is_started', type: 'boolean' }),\n    __metadata(\"design:type\", Boolean)\n], Challenge.prototype, \"isStarted\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'is_finished', type: 'boolean' }),\n    __metadata(\"design:type\", Boolean)\n], Challenge.prototype, \"isFinished\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'success_participants_uuid', type: 'varchar', array: true }),\n    __metadata(\"design:type\", Array)\n], Challenge.prototype, \"successParticipantsUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Challenge.prototype, \"createdAt\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Challenge.prototype, \"updatedAt\", void 0);\nexports.Challenge = Challenge = __decorate([\n    (0, typeorm_1.Entity)('challenge')\n], Challenge);\n\n\n//# sourceURL=webpack://soapft-backend/./src/entities/challenge.entity.ts?");

/***/ }),

/***/ "./src/entities/comment.entity.ts":
/*!****************************************!*\
  !*** ./src/entities/comment.entity.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Comment = void 0;\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nlet Comment = class Comment {\n};\nexports.Comment = Comment;\n__decorate([\n    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),\n    __metadata(\"design:type\", Number)\n], Comment.prototype, \"id\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'user_uuid', type: 'varchar', length: 26 }),\n    __metadata(\"design:type\", String)\n], Comment.prototype, \"userUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'post_uuid', type: 'varchar', length: 26 }),\n    __metadata(\"design:type\", String)\n], Comment.prototype, \"postUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'parent_comment_id', type: 'int', nullable: true }),\n    __metadata(\"design:type\", Number)\n], Comment.prototype, \"parentCommentId\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'content', type: 'varchar' }),\n    __metadata(\"design:type\", String)\n], Comment.prototype, \"content\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({\n        name: 'mentioned_users',\n        type: 'varchar',\n        array: true,\n        default: '{}',\n    }),\n    __metadata(\"design:type\", Array)\n], Comment.prototype, \"mentionedUsers\", void 0);\n__decorate([\n    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Comment.prototype, \"createdAt\", void 0);\n__decorate([\n    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Comment.prototype, \"updatedAt\", void 0);\nexports.Comment = Comment = __decorate([\n    (0, typeorm_1.Entity)('comment')\n], Comment);\n\n\n//# sourceURL=webpack://soapft-backend/./src/entities/comment.entity.ts?");

/***/ }),

/***/ "./src/entities/like.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/like.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Like = void 0;\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nlet Like = class Like {\n};\nexports.Like = Like;\n__decorate([\n    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),\n    __metadata(\"design:type\", Number)\n], Like.prototype, \"id\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'user_uuid', type: 'varchar', length: 26 }),\n    __metadata(\"design:type\", String)\n], Like.prototype, \"userUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'post_uuid', type: 'varchar', length: 26 }),\n    __metadata(\"design:type\", String)\n], Like.prototype, \"postUuid\", void 0);\n__decorate([\n    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Like.prototype, \"createdAt\", void 0);\nexports.Like = Like = __decorate([\n    (0, typeorm_1.Entity)('like')\n], Like);\n\n\n//# sourceURL=webpack://soapft-backend/./src/entities/like.entity.ts?");

/***/ }),

/***/ "./src/entities/post.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/post.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Post = void 0;\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nlet Post = class Post {\n};\nexports.Post = Post;\n__decorate([\n    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),\n    __metadata(\"design:type\", Number)\n], Post.prototype, \"id\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'post_uuid', type: 'varchar', length: 26, unique: true }),\n    __metadata(\"design:type\", String)\n], Post.prototype, \"postUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Post.prototype, \"title\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'user_uuid', type: 'varchar', length: 26 }),\n    __metadata(\"design:type\", String)\n], Post.prototype, \"userUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({\n        name: 'challenge_uuid',\n        type: 'varchar',\n        length: 26,\n        nullable: true,\n    }),\n    __metadata(\"design:type\", String)\n], Post.prototype, \"challengeUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'content', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], Post.prototype, \"content\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'image_url', type: 'simple-array' }),\n    __metadata(\"design:type\", Array)\n], Post.prototype, \"imageUrl\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'is_public', type: 'boolean', default: true }),\n    __metadata(\"design:type\", Boolean)\n], Post.prototype, \"isPublic\", void 0);\n__decorate([\n    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Post.prototype, \"createdAt\", void 0);\n__decorate([\n    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], Post.prototype, \"updatedAt\", void 0);\nexports.Post = Post = __decorate([\n    (0, typeorm_1.Entity)('post')\n], Post);\n\n\n//# sourceURL=webpack://soapft-backend/./src/entities/post.entity.ts?");

/***/ }),

/***/ "./src/entities/user.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/user.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.User = void 0;\nconst social_provider_enum_1 = __webpack_require__(/*! @/types/social-provider.enum */ \"./src/types/social-provider.enum.ts\");\nconst user_status_enum_1 = __webpack_require__(/*! @/types/user-status.enum */ \"./src/types/user-status.enum.ts\");\nconst challenge_enum_1 = __webpack_require__(/*! @/types/challenge.enum */ \"./src/types/challenge.enum.ts\");\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nlet User = class User {\n};\nexports.User = User;\n__decorate([\n    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),\n    __metadata(\"design:type\", Number)\n], User.prototype, \"id\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'user_uuid', type: 'varchar', length: 26, unique: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"userUuid\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'nickname', type: 'varchar', unique: true, nullable: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"nickname\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'socialNickname', type: 'varchar' }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"socialNickname\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'profile_image', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"profileImage\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'social_provider', type: 'enum', enum: social_provider_enum_1.SocialProvider }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"socialProvider\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'social_id', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"socialId\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'introduction', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"introduction\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'age', type: 'int', nullable: true }),\n    __metadata(\"design:type\", Number)\n], User.prototype, \"age\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({\n        name: 'gender',\n        type: 'enum',\n        enum: challenge_enum_1.GenderType,\n        default: challenge_enum_1.GenderType.NONE,\n    }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"gender\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'coins', type: 'int', default: 0 }),\n    __metadata(\"design:type\", Number)\n], User.prototype, \"coins\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'push_token', type: 'varchar', nullable: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"pushToken\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'is_push_enabled', type: 'boolean', default: true }),\n    __metadata(\"design:type\", Boolean)\n], User.prototype, \"isPushEnabled\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({\n        name: 'status',\n        type: 'enum',\n        enum: user_status_enum_1.UserStatusType,\n        default: user_status_enum_1.UserStatusType.ACTIVE,\n    }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"status\", void 0);\n__decorate([\n    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], User.prototype, \"createdAt\", void 0);\n__decorate([\n    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),\n    __metadata(\"design:type\", Date)\n], User.prototype, \"updatedAt\", void 0);\nexports.User = User = __decorate([\n    (0, typeorm_1.Entity)('user')\n], User);\n\n\n//# sourceURL=webpack://soapft-backend/./src/entities/user.entity.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst dotenv = __webpack_require__(/*! dotenv */ \"dotenv\");\ndotenv.config({ path: `env/.${\"development\" || 0}.env` });\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\");\ntry {\n    if (typeof global !== 'undefined' && !global.crypto) {\n        Object.defineProperty(global, 'crypto', {\n            value: crypto,\n            writable: false,\n            configurable: true,\n        });\n    }\n}\ncatch { }\nconst core_1 = __webpack_require__(/*! @nestjs/core */ \"@nestjs/core\");\nconst app_module_1 = __webpack_require__(/*! ./app.module */ \"./src/app.module.ts\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nconst nest_winston_1 = __webpack_require__(/*! nest-winston */ \"nest-winston\");\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst global_exception_filter_1 = __webpack_require__(/*! ./utils/global-exception.filter */ \"./src/utils/global-exception.filter.ts\");\nasync function bootstrap() {\n    const app = await core_1.NestFactory.create(app_module_1.AppModule, {\n        logger:  false\n            ? 0\n            : ['error', 'warn', 'log', 'debug', 'verbose'],\n    });\n    const configService = app.get(config_1.ConfigService);\n    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));\n    app.setGlobalPrefix('api');\n    app.useGlobalPipes(new common_1.ValidationPipe({\n        whitelist: true,\n        forbidNonWhitelisted: true,\n        transform: true,\n    }));\n    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());\n    app.enableCors({\n        origin:  false\n            ? 0\n            : 'http://localhost:5173',\n        credentials: true,\n    });\n    const config = new swagger_1.DocumentBuilder()\n        .setTitle('SOAPFT API')\n        .setDescription('SOAPFT API documentation')\n        .setVersion(process.env.npm_package_version || '0.0.1')\n        .addBearerAuth({\n        type: 'http',\n        scheme: 'bearer',\n        bearerFormat: 'JWT',\n        name: 'Authorization',\n        description: 'Enter JWT token',\n        in: 'header',\n    }, 'JWT-auth')\n        .build();\n    const document = swagger_1.SwaggerModule.createDocument(app, config);\n    swagger_1.SwaggerModule.setup('api/docs', app, document, {\n        swaggerOptions: {\n            filter: true,\n            persistAuthorization: true,\n            defaultModelsExpandDepth: -1,\n            displayRequestDuration: true,\n            deepLinking: true,\n        },\n    });\n    const port = configService.get('PORT') ?? 7777;\n    await app.listen(port);\n    console.log(`💧SOAPFT ${port}번 포트에서 실행중입니다.`);\n    if (true) {\n        module.hot.accept();\n        module.hot.dispose(() => app.close());\n    }\n}\nbootstrap();\n\n\n//# sourceURL=webpack://soapft-backend/./src/main.ts?");

/***/ }),

/***/ "./src/middlewares/http-logger.middleware.ts":
/*!***************************************************!*\
  !*** ./src/middlewares/http-logger.middleware.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HttpLoggerMiddleware = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst logger_service_1 = __webpack_require__(/*! ../utils/logger.service */ \"./src/utils/logger.service.ts\");\nlet HttpLoggerMiddleware = class HttpLoggerMiddleware {\n    constructor() {\n        this.logger = logger_service_1.LoggerService.getInstance().logger;\n    }\n    use(req, res, next) {\n        const { method, originalUrl, ip, body } = req;\n        const userAgent = req.get('user-agent') || '';\n        const startTime = Date.now();\n        this.logger.debug(`Request: ${method} ${originalUrl}`, {\n            ip,\n            userAgent,\n            body: this.sanitizeBody(body),\n            context: 'HttpLogger',\n        });\n        const originalEnd = res.end;\n        res.end = function (chunk, encoding) {\n            const responseTime = Date.now() - startTime;\n            originalEnd.call(this, chunk, encoding);\n            logger_service_1.LoggerService.getInstance().logger.debug(`Response: ${method} ${originalUrl} ${res.statusCode}`, {\n                responseTime: `${responseTime}ms`,\n                context: 'HttpLogger',\n            });\n        };\n        next();\n    }\n    sanitizeBody(body) {\n        if (!body)\n            return body;\n        const sanitized = { ...body };\n        const sensitiveFields = ['password', 'token', 'secret', 'authorization'];\n        for (const field of sensitiveFields) {\n            if (field in sanitized) {\n                sanitized[field] = '***';\n            }\n        }\n        return sanitized;\n    }\n};\nexports.HttpLoggerMiddleware = HttpLoggerMiddleware;\nexports.HttpLoggerMiddleware = HttpLoggerMiddleware = __decorate([\n    (0, common_1.Injectable)()\n], HttpLoggerMiddleware);\n\n\n//# sourceURL=webpack://soapft-backend/./src/middlewares/http-logger.middleware.ts?");

/***/ }),

/***/ "./src/modules/challenges/challenge.controller.ts":
/*!********************************************************!*\
  !*** ./src/modules/challenges/challenge.controller.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChallengeController = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst create_challenge_dto_1 = __webpack_require__(/*! ./dto/create-challenge.dto */ \"./src/modules/challenges/dto/create-challenge.dto.ts\");\nconst update_challenge_dto_1 = __webpack_require__(/*! ./dto/update-challenge.dto */ \"./src/modules/challenges/dto/update-challenge.dto.ts\");\nconst find_all_challenges_dto_1 = __webpack_require__(/*! ./dto/find-all-challenges.dto */ \"./src/modules/challenges/dto/find-all-challenges.dto.ts\");\nconst join_challenge_dto_1 = __webpack_require__(/*! ./dto/join-challenge.dto */ \"./src/modules/challenges/dto/join-challenge.dto.ts\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst challenges_swagger_1 = __webpack_require__(/*! ./decorators/challenges.swagger */ \"./src/modules/challenges/decorators/challenges.swagger.ts\");\nconst jwt_auth_guard_1 = __webpack_require__(/*! @/auth/guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nconst user_uuid_decorator_1 = __webpack_require__(/*! @/decorators/user-uuid.decorator */ \"./src/decorators/user-uuid.decorator.ts\");\nconst challenge_service_1 = __webpack_require__(/*! ./challenge.service */ \"./src/modules/challenges/challenge.service.ts\");\nlet ChallengeController = class ChallengeController {\n    constructor(challengeService) {\n        this.challengeService = challengeService;\n    }\n    getUserChallenges(userUuid) {\n        return this.challengeService.findUserChallenges(userUuid);\n    }\n    create(createChallengeDto, userUuid) {\n        return this.challengeService.createChallenge(createChallengeDto, userUuid);\n    }\n    findAll(findAllChallengesDto) {\n        return this.challengeService.findAllChallenges(findAllChallengesDto);\n    }\n    findOne(challengeId, userUuid) {\n        return this.challengeService.findOneChallenge(+challengeId, userUuid);\n    }\n    update(challengeId, updateChallengeDto, userUuid) {\n        return this.challengeService.updateChallenge(+challengeId, updateChallengeDto, userUuid);\n    }\n    remove(challengeId, userUuid) {\n        return this.challengeService.deleteChallenge(+challengeId, userUuid);\n    }\n    joinChallenge(challengeId, joinChallengeDto, userUuid) {\n        return this.challengeService.joinChallenge(+challengeId, userUuid, joinChallengeDto.password);\n    }\n    leaveChallenge(challengeId, userUuid) {\n        return this.challengeService.leaveChallenge(+challengeId, userUuid);\n    }\n};\nexports.ChallengeController = ChallengeController;\n__decorate([\n    (0, common_1.Get)('user'),\n    (0, challenges_swagger_1.ApiGetUserChallenges)(),\n    __param(0, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"getUserChallenges\", null);\n__decorate([\n    (0, common_1.Post)(),\n    (0, challenges_swagger_1.ApiCreateChallenge)(),\n    __param(0, (0, common_1.Body)()),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [create_challenge_dto_1.CreateChallengeDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"create\", null);\n__decorate([\n    (0, common_1.Get)(),\n    (0, challenges_swagger_1.ApiGetAllChallenges)(),\n    __param(0, (0, common_1.Query)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [find_all_challenges_dto_1.FindAllChallengesDto]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"findAll\", null);\n__decorate([\n    (0, common_1.Get)(':challengeId'),\n    (0, challenges_swagger_1.ApiGetChallenge)(),\n    __param(0, (0, common_1.Param)('challengeId')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"findOne\", null);\n__decorate([\n    (0, common_1.Patch)(':challengeId'),\n    (0, challenges_swagger_1.ApiUpdateChallenge)(),\n    __param(0, (0, common_1.Param)('challengeId')),\n    __param(1, (0, common_1.Body)()),\n    __param(2, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, update_challenge_dto_1.UpdateChallengeDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"update\", null);\n__decorate([\n    (0, common_1.Delete)(':challengeId'),\n    (0, challenges_swagger_1.ApiDeleteChallenge)(),\n    __param(0, (0, common_1.Param)('challengeId')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"remove\", null);\n__decorate([\n    (0, common_1.Post)(':challengeId/join'),\n    (0, challenges_swagger_1.ApiJoinChallenge)(),\n    __param(0, (0, common_1.Param)('challengeId')),\n    __param(1, (0, common_1.Body)()),\n    __param(2, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, join_challenge_dto_1.JoinChallengeDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"joinChallenge\", null);\n__decorate([\n    (0, common_1.Delete)(':challengeId/leave'),\n    (0, challenges_swagger_1.ApiLeaveChallenge)(),\n    __param(0, (0, common_1.Param)('challengeId')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], ChallengeController.prototype, \"leaveChallenge\", null);\nexports.ChallengeController = ChallengeController = __decorate([\n    (0, swagger_1.ApiTags)('challenge'),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    (0, common_1.Controller)('challenge'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __metadata(\"design:paramtypes\", [challenge_service_1.ChallengeService])\n], ChallengeController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/challenge.controller.ts?");

/***/ }),

/***/ "./src/modules/challenges/challenge.module.ts":
/*!****************************************************!*\
  !*** ./src/modules/challenges/challenge.module.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChallengeModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst challenge_controller_1 = __webpack_require__(/*! ./challenge.controller */ \"./src/modules/challenges/challenge.controller.ts\");\nconst challenge_entity_1 = __webpack_require__(/*! @/entities/challenge.entity */ \"./src/entities/challenge.entity.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst users_module_1 = __webpack_require__(/*! ../users/users.module */ \"./src/modules/users/users.module.ts\");\nconst common_2 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst challenge_service_1 = __webpack_require__(/*! ./challenge.service */ \"./src/modules/challenges/challenge.service.ts\");\nlet ChallengeModule = class ChallengeModule {\n};\nexports.ChallengeModule = ChallengeModule;\nexports.ChallengeModule = ChallengeModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            typeorm_1.TypeOrmModule.forFeature([challenge_entity_1.Challenge, user_entity_1.User]),\n            (0, common_2.forwardRef)(() => users_module_1.UsersModule),\n        ],\n        controllers: [challenge_controller_1.ChallengeController],\n        providers: [challenge_service_1.ChallengeService],\n        exports: [challenge_service_1.ChallengeService],\n    })\n], ChallengeModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/challenge.module.ts?");

/***/ }),

/***/ "./src/modules/challenges/challenge.service.ts":
/*!*****************************************************!*\
  !*** ./src/modules/challenges/challenge.service.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChallengeService = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst typeorm_2 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst challenge_entity_1 = __webpack_require__(/*! @/entities/challenge.entity */ \"./src/entities/challenge.entity.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nlet ChallengeService = class ChallengeService {\n    constructor(challengeRepository, userRepository) {\n        this.challengeRepository = challengeRepository;\n        this.userRepository = userRepository;\n    }\n    async createChallenge(createChallengeDto, userUuid) {\n        throw new Error('Method not implemented.');\n    }\n    async findAllChallenges(findAllChallengesDto) {\n        throw new Error('Method not implemented.');\n    }\n    async findOneChallenge(challengeId, userUuid) {\n        const challenge = await this.challengeRepository.findOne({\n            where: { id: challengeId },\n        });\n        if (!challenge) {\n            throw new common_1.NotFoundException('해당 ID의 챌린지를 찾을 수 없습니다.');\n        }\n        return challenge;\n    }\n    async findUserChallenges(userUuid) {\n        const challenges = await this.challengeRepository\n            .createQueryBuilder('challenge')\n            .where(':userUuid = ANY(challenge.participantUuid)', { userUuid })\n            .getMany();\n        return challenges;\n    }\n    async updateChallenge(challengeId, updateChallengeDto, userUuid) {\n        throw new Error('Method not implemented.');\n    }\n    async deleteChallenge(challengeId, userUuid) {\n        throw new Error('Method not implemented.');\n    }\n    async joinChallenge(challengeId, userUuid, password) {\n        throw new Error('Method not implemented.');\n    }\n    async leaveChallenge(challengeId, userUuid) {\n        throw new Error('Method not implemented.');\n    }\n};\nexports.ChallengeService = ChallengeService;\nexports.ChallengeService = ChallengeService = __decorate([\n    (0, common_1.Injectable)(),\n    __param(0, (0, typeorm_1.InjectRepository)(challenge_entity_1.Challenge)),\n    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),\n    __metadata(\"design:paramtypes\", [typeorm_2.Repository,\n        typeorm_2.Repository])\n], ChallengeService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/challenge.service.ts?");

/***/ }),

/***/ "./src/modules/challenges/decorators/challenges.swagger.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/challenges/decorators/challenges.swagger.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiCreateChallenge = ApiCreateChallenge;\nexports.ApiGetAllChallenges = ApiGetAllChallenges;\nexports.ApiGetChallenge = ApiGetChallenge;\nexports.ApiJoinChallenge = ApiJoinChallenge;\nexports.ApiUpdateChallenge = ApiUpdateChallenge;\nexports.ApiDeleteChallenge = ApiDeleteChallenge;\nexports.ApiGetUserChallenges = ApiGetUserChallenges;\nexports.ApiLeaveChallenge = ApiLeaveChallenge;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ../../../decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nfunction ApiCreateChallenge() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '챌린지 생성',\n        description: '새로운 챌린지를 생성합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            required: [\n                'title',\n                'introduce',\n                'startDate',\n                'endDate',\n                'goal',\n                'coinAmount',\n            ],\n            properties: {\n                title: {\n                    type: 'string',\n                    description: '챌린지 제목',\n                    example: '30일 헬스 챌린지',\n                },\n                type: {\n                    type: 'string',\n                    enum: ['NORMAL', 'EVENT'],\n                    description: '챌린지 타입',\n                    example: 'NORMAL',\n                },\n                profile: {\n                    type: 'string',\n                    description: '챌린지 프로필 이미지 URL',\n                    example: 'https://soapft-bucket.s3.amazonaws.com/images/challenge-profile.jpg',\n                },\n                banner: {\n                    type: 'string',\n                    description: '챌린지 배너 이미지 URL',\n                    example: 'https://soapft-bucket.s3.amazonaws.com/images/challenge-banner.jpg',\n                },\n                introduce: {\n                    type: 'string',\n                    description: '챌린지 소개',\n                    example: '매일 헬스장에서 운동하고 인증하는 챌린지입니다!',\n                },\n                startDate: {\n                    type: 'string',\n                    format: 'date',\n                    description: '챌린지 시작일',\n                    example: '2025-07-01',\n                },\n                endDate: {\n                    type: 'string',\n                    format: 'date',\n                    description: '챌린지 종료일',\n                    example: '2025-07-31',\n                },\n                goal: {\n                    type: 'number',\n                    description: '주당 목표 인증 횟수',\n                    example: 5,\n                },\n                startAge: {\n                    type: 'number',\n                    description: '참여 가능 최소 연령',\n                    example: 18,\n                },\n                endAge: {\n                    type: 'number',\n                    description: '참여 가능 최대 연령',\n                    example: 65,\n                },\n                gender: {\n                    type: 'string',\n                    enum: ['ALL', 'MALE', 'FEMALE'],\n                    description: '참여 가능 성별',\n                    example: 'ALL',\n                },\n                maxMember: {\n                    type: 'number',\n                    description: '최대 참여 인원',\n                    example: 50,\n                },\n                coinAmount: {\n                    type: 'number',\n                    description: '참여비 (코인)',\n                    example: 1000,\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 201,\n        description: '챌린지가 성공적으로 생성됨',\n        schema: {\n            type: 'object',\n            properties: {\n                challengeUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                title: {\n                    type: 'string',\n                    example: '30일 헬스 챌린지',\n                },\n                type: {\n                    type: 'string',\n                    example: 'NORMAL',\n                },\n                introduce: {\n                    type: 'string',\n                    example: '매일 헬스장에서 운동하고 인증하는 챌린지입니다!',\n                },\n                startDate: {\n                    type: 'string',\n                    format: 'date',\n                    example: '2025-07-01',\n                },\n                endDate: {\n                    type: 'string',\n                    format: 'date',\n                    example: '2025-07-31',\n                },\n                goal: {\n                    type: 'number',\n                    example: 5,\n                },\n                maxMember: {\n                    type: 'number',\n                    example: 50,\n                },\n                currentMember: {\n                    type: 'number',\n                    example: 1,\n                },\n                coinAmount: {\n                    type: 'number',\n                    example: 1000,\n                },\n                isStarted: {\n                    type: 'boolean',\n                    example: false,\n                },\n                isFinished: {\n                    type: 'boolean',\n                    example: false,\n                },\n                creatorUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('COIN_001', '코인이 부족합니다.', 400, {\n        requiredCoins: 1000,\n        currentCoins: 500,\n    })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_001', '잘못된 챌린지 정보입니다.', 400)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_002', '시작일이 종료일보다 늦을 수 없습니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetAllChallenges() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '챌린지 목록 조회',\n        description: '모든 챌린지 목록을 조회합니다.',\n    }), (0, swagger_1.ApiQuery)({\n        name: 'page',\n        required: false,\n        description: '페이지 번호 (기본값: 1)',\n        example: 1,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'limit',\n        required: false,\n        description: '페이지당 항목 수 (기본값: 10)',\n        example: 10,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'type',\n        required: false,\n        description: '챌린지 타입 필터',\n        enum: ['NORMAL', 'EVENT'],\n        example: 'NORMAL',\n    }), (0, swagger_1.ApiQuery)({\n        name: 'status',\n        required: false,\n        description: '챌린지 상태 필터',\n        enum: ['recruiting', 'ongoing', 'finished'],\n        example: 'recruiting',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '챌린지 목록 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                challenges: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            challengeUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            title: { type: 'string', example: '30일 헬스 챌린지' },\n                            type: { type: 'string', example: 'NORMAL' },\n                            profile: {\n                                type: 'string',\n                                example: 'https://example.com/profile.jpg',\n                            },\n                            banner: {\n                                type: 'string',\n                                example: 'https://example.com/banner.jpg',\n                            },\n                            introduce: {\n                                type: 'string',\n                                example: '매일 헬스장에서 운동하고 인증하는 챌린지입니다!',\n                            },\n                            startDate: {\n                                type: 'string',\n                                format: 'date',\n                                example: '2025-07-01',\n                            },\n                            endDate: {\n                                type: 'string',\n                                format: 'date',\n                                example: '2025-07-31',\n                            },\n                            goal: { type: 'number', example: 5 },\n                            maxMember: { type: 'number', example: 50 },\n                            currentMember: { type: 'number', example: 25 },\n                            coinAmount: { type: 'number', example: 1000 },\n                            isStarted: { type: 'boolean', example: false },\n                            isFinished: { type: 'boolean', example: false },\n                            creator: {\n                                type: 'object',\n                                properties: {\n                                    userUuid: {\n                                        type: 'string',\n                                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                    },\n                                    nickname: { type: 'string', example: '챌린지마스터' },\n                                    profileImage: {\n                                        type: 'string',\n                                        example: 'https://example.com/profile.jpg',\n                                    },\n                                },\n                            },\n                            createdAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                        },\n                    },\n                },\n                pagination: {\n                    type: 'object',\n                    properties: {\n                        currentPage: { type: 'number', example: 1 },\n                        totalPages: { type: 'number', example: 5 },\n                        totalItems: { type: 'number', example: 50 },\n                        itemsPerPage: { type: 'number', example: 10 },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetChallenge() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '챌린지 상세 조회',\n        description: '특정 챌린지의 상세 정보를 조회합니다.',\n    }), (0, swagger_1.ApiParam)({\n        name: 'challengeUuid',\n        description: '챌린지 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '챌린지 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                challengeUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                title: { type: 'string', example: '30일 헬스 챌린지' },\n                type: { type: 'string', example: 'NORMAL' },\n                profile: {\n                    type: 'string',\n                    example: 'https://example.com/profile.jpg',\n                },\n                banner: { type: 'string', example: 'https://example.com/banner.jpg' },\n                introduce: {\n                    type: 'string',\n                    example: '매일 헬스장에서 운동하고 인증하는 챌린지입니다!',\n                },\n                startDate: { type: 'string', format: 'date', example: '2025-07-01' },\n                endDate: { type: 'string', format: 'date', example: '2025-07-31' },\n                goal: { type: 'number', example: 5 },\n                startAge: { type: 'number', example: 18 },\n                endAge: { type: 'number', example: 65 },\n                gender: { type: 'string', example: 'ALL' },\n                maxMember: { type: 'number', example: 50 },\n                currentMember: { type: 'number', example: 25 },\n                coinAmount: { type: 'number', example: 1000 },\n                isStarted: { type: 'boolean', example: false },\n                isFinished: { type: 'boolean', example: false },\n                creator: {\n                    type: 'object',\n                    properties: {\n                        userUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        nickname: { type: 'string', example: '챌린지마스터' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                    },\n                },\n                participants: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            userUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            nickname: { type: 'string', example: '참여자1' },\n                            profileImage: {\n                                type: 'string',\n                                example: 'https://example.com/profile.jpg',\n                            },\n                            joinedAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                        },\n                    },\n                },\n                isParticipating: { type: 'boolean', example: false },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n                updatedAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_003', '챌린지를 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiJoinChallenge() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '챌린지 참여',\n        description: '챌린지에 참여합니다. 코인이 차감됩니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'challengeUuid',\n        description: '챌린지 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '챌린지 참여 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '챌린지에 참여했습니다.',\n                },\n                challengeUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                userUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                coinUsed: {\n                    type: 'number',\n                    example: 1000,\n                },\n                remainingCoins: {\n                    type: 'number',\n                    example: 4000,\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_006', '참여 조건을 만족하지 않습니다.', 400)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_004', '챌린지 정원이 가득 찼습니다.', 400)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_005', '이미 참여 중인 챌린지입니다.', 400)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_007', '챌린지가 이미 시작되었습니다.', 400)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('COIN_001', '코인이 부족합니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_003', '챌린지를 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiUpdateChallenge() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '챌린지 수정',\n        description: '챌린지 생성자만 수정할 수 있습니다. 시작된 챌린지는 일부만 수정 가능합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'challengeUuid',\n        description: '챌린지 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            properties: {\n                title: { type: 'string', example: '수정된 챌린지 제목' },\n                profile: {\n                    type: 'string',\n                    example: 'https://example.com/new-profile.jpg',\n                },\n                banner: {\n                    type: 'string',\n                    example: 'https://example.com/new-banner.jpg',\n                },\n                introduce: { type: 'string', example: '수정된 챌린지 소개' },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '챌린지 수정 성공',\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }), (0, swagger_1.ApiResponse)({\n        status: 403,\n        description: '수정 권한 없음',\n    }), (0, swagger_1.ApiResponse)({\n        status: 404,\n        description: '챌린지를 찾을 수 없음',\n    }));\n}\nfunction ApiDeleteChallenge() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '챌린지 삭제',\n        description: '챌린지 생성자만 삭제할 수 있습니다. 시작된 챌린지는 삭제할 수 없습니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'challengeUuid',\n        description: '챌린지 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '챌린지 삭제 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '챌린지가 삭제되었습니다.',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }), (0, swagger_1.ApiResponse)({\n        status: 403,\n        description: '삭제 권한 없음 또는 시작된 챌린지',\n    }), (0, swagger_1.ApiResponse)({\n        status: 404,\n        description: '챌린지를 찾을 수 없음',\n    }));\n}\nfunction ApiGetUserChallenges() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '사용자 참여 챌린지 조회',\n        description: '현재 로그인한 사용자가 참여 중인 모든 챌린지를 조회합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '사용자 참여 챌린지 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                success: {\n                    type: 'boolean',\n                    example: true,\n                    description: '성공 여부',\n                },\n                data: {\n                    type: 'array',\n                    description: '참여 중인 챌린지 목록',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            challengeId: {\n                                type: 'number',\n                                example: 1,\n                                description: '챌린지 ID',\n                            },\n                            challengeUuid: {\n                                type: 'string',\n                                example: '01HXX1X1X1X1X1X1X1X1X1X1X1',\n                                description: '챌린지 UUID',\n                            },\n                            title: {\n                                type: 'string',\n                                example: '30일 운동 챌린지',\n                                description: '챌린지 제목',\n                            },\n                            status: {\n                                type: 'string',\n                                enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'],\n                                example: 'IN_PROGRESS',\n                                description: '챌린지 상태',\n                            },\n                            currentMembers: {\n                                type: 'number',\n                                example: 5,\n                                description: '현재 참여자 수',\n                            },\n                            maxMembers: {\n                                type: 'number',\n                                example: 10,\n                                description: '최대 참여자 수',\n                            },\n                            startDate: {\n                                type: 'string',\n                                format: 'date',\n                                example: '2025-01-01',\n                                description: '챌린지 시작일',\n                            },\n                            endDate: {\n                                type: 'string',\n                                format: 'date',\n                                example: '2025-01-31',\n                                description: '챌린지 종료일',\n                            },\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiLeaveChallenge() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '챌린지 탈퇴',\n        description: '사용자가 참여 중인 챌린지에서 탈퇴합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'challengeId',\n        description: '탈퇴할 챌린지 ID',\n        type: 'number',\n        example: 1,\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '챌린지 탈퇴 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                success: {\n                    type: 'boolean',\n                    example: true,\n                    description: '성공 여부',\n                },\n                message: {\n                    type: 'string',\n                    example: '챌린지에서 성공적으로 탈퇴했습니다.',\n                    description: '응답 메시지',\n                },\n                data: {\n                    type: 'object',\n                    properties: {\n                        challengeId: {\n                            type: 'number',\n                            example: 1,\n                            description: '챌린지 ID',\n                        },\n                        refundedCoins: {\n                            type: 'number',\n                            example: 100,\n                            description: '환불된 코인 수',\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_007', '참여하지 않은 챌린지입니다.', 404)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_008', '이미 시작된 챌린지는 탈퇴할 수 없습니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/decorators/challenges.swagger.ts?");

/***/ }),

/***/ "./src/modules/challenges/dto/create-challenge.dto.ts":
/*!************************************************************!*\
  !*** ./src/modules/challenges/dto/create-challenge.dto.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CreateChallengeDto = void 0;\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nconst challenge_enum_1 = __webpack_require__(/*! @/types/challenge.enum */ \"./src/types/challenge.enum.ts\");\nclass CreateChallengeDto {\n}\nexports.CreateChallengeDto = CreateChallengeDto;\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '챌린지명' }),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"title\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '챌린지 유형', enum: challenge_enum_1.ChallengeType }),\n    (0, class_validator_1.IsEnum)(challenge_enum_1.ChallengeType),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"type\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '챌린지 소개글' }),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"introduce\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '시작 일자' }),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"start_date\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '종료 일자', required: false }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"end_date\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '주당 인증 목표 횟수' }),\n    (0, class_validator_1.IsNumber)(),\n    __metadata(\"design:type\", Number)\n], CreateChallengeDto.prototype, \"goal\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '참여 가능 최소 연령' }),\n    (0, class_validator_1.IsNumber)(),\n    __metadata(\"design:type\", Number)\n], CreateChallengeDto.prototype, \"start_age\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '참여 가능 최대 연령', required: false }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsNumber)(),\n    __metadata(\"design:type\", Number)\n], CreateChallengeDto.prototype, \"end_age\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '성별 제한', enum: challenge_enum_1.GenderType }),\n    (0, class_validator_1.IsEnum)(challenge_enum_1.GenderType),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"gender\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '최대 참여자 수' }),\n    (0, class_validator_1.IsNumber)(),\n    __metadata(\"design:type\", Number)\n], CreateChallengeDto.prototype, \"max_member\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '참여 시 필요한 코인 양' }),\n    (0, class_validator_1.IsNumber)(),\n    __metadata(\"design:type\", Number)\n], CreateChallengeDto.prototype, \"coin_amount\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '챌린지 프로필 이미지', required: false }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"profile\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '챌린지 배너 이미지', required: false }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], CreateChallengeDto.prototype, \"banner\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/dto/create-challenge.dto.ts?");

/***/ }),

/***/ "./src/modules/challenges/dto/find-all-challenges.dto.ts":
/*!***************************************************************!*\
  !*** ./src/modules/challenges/dto/find-all-challenges.dto.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FindAllChallengesDto = void 0;\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nconst class_transformer_1 = __webpack_require__(/*! class-transformer */ \"class-transformer\");\nconst challenge_enum_1 = __webpack_require__(/*! @/types/challenge.enum */ \"./src/types/challenge.enum.ts\");\nclass FindAllChallengesDto {\n    constructor() {\n        this.page = 1;\n        this.limit = 10;\n    }\n}\nexports.FindAllChallengesDto = FindAllChallengesDto;\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '페이지 번호', default: 1, required: false }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.IsNumber)(),\n    __metadata(\"design:type\", Number)\n], FindAllChallengesDto.prototype, \"page\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({\n        description: '페이지당 챌린지 수',\n        default: 10,\n        required: false,\n    }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.IsNumber)(),\n    __metadata(\"design:type\", Number)\n], FindAllChallengesDto.prototype, \"limit\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({\n        description: '챌린지 타입 필터',\n        enum: challenge_enum_1.ChallengeType,\n        required: false,\n    }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsEnum)(challenge_enum_1.ChallengeType),\n    __metadata(\"design:type\", String)\n], FindAllChallengesDto.prototype, \"type\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '성별 필터', enum: challenge_enum_1.GenderType, required: false }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsEnum)(challenge_enum_1.GenderType),\n    __metadata(\"design:type\", String)\n], FindAllChallengesDto.prototype, \"gender\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/dto/find-all-challenges.dto.ts?");

/***/ }),

/***/ "./src/modules/challenges/dto/join-challenge.dto.ts":
/*!**********************************************************!*\
  !*** ./src/modules/challenges/dto/join-challenge.dto.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.JoinChallengeDto = void 0;\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass JoinChallengeDto {\n}\nexports.JoinChallengeDto = JoinChallengeDto;\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: '챌린지 참여 비밀번호', required: false }),\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], JoinChallengeDto.prototype, \"password\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/dto/join-challenge.dto.ts?");

/***/ }),

/***/ "./src/modules/challenges/dto/update-challenge.dto.ts":
/*!************************************************************!*\
  !*** ./src/modules/challenges/dto/update-challenge.dto.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UpdateChallengeDto = void 0;\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst create_challenge_dto_1 = __webpack_require__(/*! ./create-challenge.dto */ \"./src/modules/challenges/dto/create-challenge.dto.ts\");\nclass UpdateChallengeDto extends (0, swagger_1.PartialType)(create_challenge_dto_1.CreateChallengeDto) {\n}\nexports.UpdateChallengeDto = UpdateChallengeDto;\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/challenges/dto/update-challenge.dto.ts?");

/***/ }),

/***/ "./src/modules/comments/comments.controller.ts":
/*!*****************************************************!*\
  !*** ./src/modules/comments/comments.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CommentsController = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst comments_swagger_1 = __webpack_require__(/*! ./decorators/comments.swagger */ \"./src/modules/comments/decorators/comments.swagger.ts\");\nconst comments_service_1 = __webpack_require__(/*! ./comments.service */ \"./src/modules/comments/comments.service.ts\");\nconst create_comment_dto_1 = __webpack_require__(/*! ./dto/create-comment.dto */ \"./src/modules/comments/dto/create-comment.dto.ts\");\nconst update_comment_dto_1 = __webpack_require__(/*! ./dto/update-comment.dto */ \"./src/modules/comments/dto/update-comment.dto.ts\");\nconst find_all_comments_dto_1 = __webpack_require__(/*! ./dto/find-all-comments.dto */ \"./src/modules/comments/dto/find-all-comments.dto.ts\");\nconst jwt_auth_guard_1 = __webpack_require__(/*! @/auth/guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nconst user_uuid_decorator_1 = __webpack_require__(/*! @/decorators/user-uuid.decorator */ \"./src/decorators/user-uuid.decorator.ts\");\nlet CommentsController = class CommentsController {\n    constructor(commentsService) {\n        this.commentsService = commentsService;\n    }\n    createComment(createCommentDto, userUuid) {\n        return null;\n    }\n    findAllComments(postUuid, findAllCommentsDto, userUuid) {\n        return null;\n    }\n    findOneComment(commentId, userUuid) {\n        return null;\n    }\n    updateComment(commentId, updateCommentDto, userUuid) {\n        return null;\n    }\n    removeComment(commentId, userUuid) {\n        return null;\n    }\n};\nexports.CommentsController = CommentsController;\n__decorate([\n    (0, common_1.Post)(),\n    (0, comments_swagger_1.ApiCreateComment)(),\n    __param(0, (0, common_1.Body)()),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [create_comment_dto_1.CreateCommentDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], CommentsController.prototype, \"createComment\", null);\n__decorate([\n    (0, common_1.Get)('post/:postUuid'),\n    (0, comments_swagger_1.ApiGetAllComments)(),\n    __param(0, (0, common_1.Param)('postUuid')),\n    __param(1, (0, common_1.Query)()),\n    __param(2, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, find_all_comments_dto_1.FindAllCommentsDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], CommentsController.prototype, \"findAllComments\", null);\n__decorate([\n    (0, common_1.Get)(':commentId'),\n    (0, comments_swagger_1.ApiGetComment)(),\n    __param(0, (0, common_1.Param)('commentId')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], CommentsController.prototype, \"findOneComment\", null);\n__decorate([\n    (0, common_1.Patch)(':commentId'),\n    (0, comments_swagger_1.ApiUpdateComment)(),\n    __param(0, (0, common_1.Param)('commentId')),\n    __param(1, (0, common_1.Body)()),\n    __param(2, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, update_comment_dto_1.UpdateCommentDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], CommentsController.prototype, \"updateComment\", null);\n__decorate([\n    (0, common_1.Delete)(':commentId'),\n    (0, comments_swagger_1.ApiDeleteComment)(),\n    __param(0, (0, common_1.Param)('commentId')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], CommentsController.prototype, \"removeComment\", null);\nexports.CommentsController = CommentsController = __decorate([\n    (0, swagger_1.ApiTags)('comment'),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    (0, common_1.Controller)('comment'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __metadata(\"design:paramtypes\", [comments_service_1.CommentsService])\n], CommentsController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/comments/comments.controller.ts?");

/***/ }),

/***/ "./src/modules/comments/comments.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/comments/comments.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CommentsModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst comments_service_1 = __webpack_require__(/*! ./comments.service */ \"./src/modules/comments/comments.service.ts\");\nconst comments_controller_1 = __webpack_require__(/*! ./comments.controller */ \"./src/modules/comments/comments.controller.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst posts_module_1 = __webpack_require__(/*! @/modules/posts/posts.module */ \"./src/modules/posts/posts.module.ts\");\nconst comment_entity_1 = __webpack_require__(/*! @/entities/comment.entity */ \"./src/entities/comment.entity.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst users_module_1 = __webpack_require__(/*! ../users/users.module */ \"./src/modules/users/users.module.ts\");\nlet CommentsModule = class CommentsModule {\n};\nexports.CommentsModule = CommentsModule;\nexports.CommentsModule = CommentsModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment, user_entity_1.User]),\n            (0, common_1.forwardRef)(() => posts_module_1.PostsModule),\n            (0, common_1.forwardRef)(() => users_module_1.UsersModule),\n        ],\n        controllers: [comments_controller_1.CommentsController],\n        providers: [comments_service_1.CommentsService],\n        exports: [comments_service_1.CommentsService],\n    })\n], CommentsModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/comments/comments.module.ts?");

/***/ }),

/***/ "./src/modules/comments/comments.service.ts":
/*!**************************************************!*\
  !*** ./src/modules/comments/comments.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CommentsService = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst typeorm_2 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst posts_service_1 = __webpack_require__(/*! @/modules/posts/posts.service */ \"./src/modules/posts/posts.service.ts\");\nconst comment_entity_1 = __webpack_require__(/*! @/entities/comment.entity */ \"./src/entities/comment.entity.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst users_service_1 = __webpack_require__(/*! ../users/users.service */ \"./src/modules/users/users.service.ts\");\nlet CommentsService = class CommentsService {\n    constructor(commentRepository, postsService, userRepository, userService) {\n        this.commentRepository = commentRepository;\n        this.postsService = postsService;\n        this.userRepository = userRepository;\n        this.userService = userService;\n    }\n};\nexports.CommentsService = CommentsService;\nexports.CommentsService = CommentsService = __decorate([\n    (0, common_1.Injectable)(),\n    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),\n    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => posts_service_1.PostsService))),\n    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),\n    __metadata(\"design:paramtypes\", [typeorm_2.Repository,\n        posts_service_1.PostsService,\n        typeorm_2.Repository,\n        users_service_1.UsersService])\n], CommentsService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/comments/comments.service.ts?");

/***/ }),

/***/ "./src/modules/comments/decorators/comments.swagger.ts":
/*!*************************************************************!*\
  !*** ./src/modules/comments/decorators/comments.swagger.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiCreateComment = ApiCreateComment;\nexports.ApiGetAllComments = ApiGetAllComments;\nexports.ApiGetComment = ApiGetComment;\nexports.ApiUpdateComment = ApiUpdateComment;\nexports.ApiDeleteComment = ApiDeleteComment;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ../../../decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nfunction ApiCreateComment() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '댓글 생성',\n        description: '인증글에 댓글을 작성합니다. 대댓글과 사용자 멘션을 지원합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            required: ['postUuid', 'content'],\n            properties: {\n                postUuid: {\n                    type: 'string',\n                    description: '인증글 UUID',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                content: {\n                    type: 'string',\n                    description: '댓글 내용',\n                    example: '정말 대단해요! 저도 열심히 해야겠어요 💪',\n                },\n                parentCommentId: {\n                    type: 'number',\n                    description: '부모 댓글 ID (대댓글인 경우)',\n                    example: 123,\n                },\n                mentionedUserUuids: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: '멘션된 사용자 UUID 배열',\n                    example: ['01HZQK5J8X2M3N4P5Q6R7S8T9V'],\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 201,\n        description: '댓글이 성공적으로 생성됨',\n        schema: {\n            type: 'object',\n            properties: {\n                id: {\n                    type: 'number',\n                    example: 456,\n                },\n                content: {\n                    type: 'string',\n                    example: '정말 대단해요! 저도 열심히 해야겠어요 💪',\n                },\n                author: {\n                    type: 'object',\n                    properties: {\n                        userUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        nickname: { type: 'string', example: '댓글러' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                    },\n                },\n                parentCommentId: {\n                    type: 'number',\n                    example: 123,\n                },\n                mentionedUsers: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            userUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            nickname: { type: 'string', example: '운동러버' },\n                        },\n                    },\n                },\n                replyCount: {\n                    type: 'number',\n                    example: 0,\n                },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_001', '인증글을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('COMMENT_001', '댓글 내용은 필수입니다.', 400)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('COMMENT_002', '댓글 내용이 너무 깁니다.', 400, {\n        maxLength: 500,\n    })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('COMMENT_003', '존재하지 않는 부모 댓글입니다.', 404)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('USER_001', '언급된 사용자를 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetAllComments() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '댓글 목록 조회',\n        description: '특정 인증글의 댓글 목록을 조회합니다. 대댓글도 포함됩니다.',\n    }), (0, swagger_1.ApiParam)({\n        name: 'postUuid',\n        description: '인증글 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiQuery)({\n        name: 'page',\n        required: false,\n        description: '페이지 번호 (기본값: 1)',\n        example: 1,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'limit',\n        required: false,\n        description: '페이지당 항목 수 (기본값: 20)',\n        example: 20,\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '댓글 목록 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                comments: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            id: { type: 'number', example: 456 },\n                            content: {\n                                type: 'string',\n                                example: '정말 대단해요! 저도 열심히 해야겠어요 💪',\n                            },\n                            author: {\n                                type: 'object',\n                                properties: {\n                                    userUuid: {\n                                        type: 'string',\n                                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                    },\n                                    nickname: { type: 'string', example: '댓글러' },\n                                    profileImage: {\n                                        type: 'string',\n                                        example: 'https://example.com/profile.jpg',\n                                    },\n                                },\n                            },\n                            parentCommentId: { type: 'number', example: null },\n                            mentionedUsers: {\n                                type: 'array',\n                                items: {\n                                    type: 'object',\n                                    properties: {\n                                        userUuid: {\n                                            type: 'string',\n                                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                        },\n                                        nickname: { type: 'string', example: '운동러버' },\n                                    },\n                                },\n                            },\n                            replies: {\n                                type: 'array',\n                                items: {\n                                    type: 'object',\n                                    properties: {\n                                        id: { type: 'number', example: 789 },\n                                        content: {\n                                            type: 'string',\n                                            example: '감사합니다! 함께 화이팅해요 🔥',\n                                        },\n                                        author: {\n                                            type: 'object',\n                                            properties: {\n                                                userUuid: {\n                                                    type: 'string',\n                                                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                                },\n                                                nickname: { type: 'string', example: '운동러버' },\n                                                profileImage: {\n                                                    type: 'string',\n                                                    example: 'https://example.com/profile.jpg',\n                                                },\n                                            },\n                                        },\n                                        parentCommentId: { type: 'number', example: 456 },\n                                        createdAt: {\n                                            type: 'string',\n                                            format: 'date-time',\n                                            example: '2025-06-22T12:30:00Z',\n                                        },\n                                    },\n                                },\n                            },\n                            replyCount: { type: 'number', example: 1 },\n                            createdAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                            updatedAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                        },\n                    },\n                },\n                pagination: {\n                    type: 'object',\n                    properties: {\n                        currentPage: { type: 'number', example: 1 },\n                        totalPages: { type: 'number', example: 3 },\n                        totalItems: { type: 'number', example: 45 },\n                        itemsPerPage: { type: 'number', example: 20 },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_001', '인증글을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetComment() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '댓글 상세 조회',\n        description: '특정 댓글의 상세 정보를 조회합니다.',\n    }), (0, swagger_1.ApiParam)({\n        name: 'commentId',\n        description: '댓글 ID',\n        example: 456,\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '댓글 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                id: { type: 'number', example: 456 },\n                content: {\n                    type: 'string',\n                    example: '정말 대단해요! 저도 열심히 해야겠어요 💪',\n                },\n                author: {\n                    type: 'object',\n                    properties: {\n                        userUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        nickname: { type: 'string', example: '댓글러' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                    },\n                },\n                post: {\n                    type: 'object',\n                    properties: {\n                        postUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        content: {\n                            type: 'string',\n                            example: '오늘 헬스장에서 2시간 운동했어요! 💪',\n                        },\n                    },\n                },\n                parentCommentId: { type: 'number', example: null },\n                mentionedUsers: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            userUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            nickname: { type: 'string', example: '운동러버' },\n                        },\n                    },\n                },\n                replyCount: { type: 'number', example: 3 },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n                updatedAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 404,\n        description: '댓글을 찾을 수 없음',\n    }));\n}\nfunction ApiUpdateComment() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '댓글 수정',\n        description: '작성한 댓글을 수정합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'commentId',\n        description: '댓글 ID',\n        example: 456,\n    }), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            required: ['content'],\n            properties: {\n                content: {\n                    type: 'string',\n                    description: '수정할 댓글 내용',\n                    example: '정말 대단해요! 저도 더 열심히 해야겠어요 💪🔥',\n                },\n                mentionedUserUuids: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: '멘션된 사용자 UUID 배열',\n                    example: ['01HZQK5J8X2M3N4P5Q6R7S8T9V'],\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '댓글 수정 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '댓글이 수정되었습니다.',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }), (0, swagger_1.ApiResponse)({\n        status: 403,\n        description: '수정 권한 없음',\n    }), (0, swagger_1.ApiResponse)({\n        status: 404,\n        description: '댓글을 찾을 수 없음',\n    }));\n}\nfunction ApiDeleteComment() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '댓글 삭제',\n        description: '작성한 댓글을 삭제합니다. 대댓글이 있는 경우 내용만 삭제됩니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'commentId',\n        description: '댓글 ID',\n        example: 456,\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '댓글 삭제 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '댓글이 삭제되었습니다.',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }), (0, swagger_1.ApiResponse)({\n        status: 403,\n        description: '삭제 권한 없음',\n    }), (0, swagger_1.ApiResponse)({\n        status: 404,\n        description: '댓글을 찾을 수 없음',\n    }));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/comments/decorators/comments.swagger.ts?");

/***/ }),

/***/ "./src/modules/comments/dto/create-comment.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/comments/dto/create-comment.dto.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CreateCommentDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass CreateCommentDto {\n    constructor() {\n        this.createdAt = new Date();\n        this.updatedAt = new Date();\n    }\n}\nexports.CreateCommentDto = CreateCommentDto;\n__decorate([\n    (0, class_validator_1.IsString)(),\n    (0, class_validator_1.IsNotEmpty)(),\n    __metadata(\"design:type\", String)\n], CreateCommentDto.prototype, \"postUuid\", void 0);\n__decorate([\n    (0, class_validator_1.IsString)(),\n    (0, class_validator_1.IsNotEmpty)(),\n    __metadata(\"design:type\", String)\n], CreateCommentDto.prototype, \"content\", void 0);\n__decorate([\n    (0, class_validator_1.IsDate)(),\n    __metadata(\"design:type\", Date)\n], CreateCommentDto.prototype, \"createdAt\", void 0);\n__decorate([\n    (0, class_validator_1.IsDate)(),\n    __metadata(\"design:type\", Date)\n], CreateCommentDto.prototype, \"updatedAt\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/comments/dto/create-comment.dto.ts?");

/***/ }),

/***/ "./src/modules/comments/dto/find-all-comments.dto.ts":
/*!***********************************************************!*\
  !*** ./src/modules/comments/dto/find-all-comments.dto.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FindAllCommentsDto = void 0;\nconst class_transformer_1 = __webpack_require__(/*! class-transformer */ \"class-transformer\");\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass FindAllCommentsDto {\n    constructor() {\n        this.page = 1;\n        this.limit = 10;\n    }\n}\nexports.FindAllCommentsDto = FindAllCommentsDto;\n__decorate([\n    (0, class_validator_1.IsNumber)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.Min)(1),\n    __metadata(\"design:type\", Number)\n], FindAllCommentsDto.prototype, \"page\", void 0);\n__decorate([\n    (0, class_validator_1.IsNumber)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.Min)(1),\n    __metadata(\"design:type\", Number)\n], FindAllCommentsDto.prototype, \"limit\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/comments/dto/find-all-comments.dto.ts?");

/***/ }),

/***/ "./src/modules/comments/dto/update-comment.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/comments/dto/update-comment.dto.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UpdateCommentDto = void 0;\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst create_comment_dto_1 = __webpack_require__(/*! ./create-comment.dto */ \"./src/modules/comments/dto/create-comment.dto.ts\");\nclass UpdateCommentDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_comment_dto_1.CreateCommentDto, ['createdAt', 'postUuid'])) {\n}\nexports.UpdateCommentDto = UpdateCommentDto;\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/comments/dto/update-comment.dto.ts?");

/***/ }),

/***/ "./src/modules/likes/decorators/likes.swagger.ts":
/*!*******************************************************!*\
  !*** ./src/modules/likes/decorators/likes.swagger.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiCreateLike = ApiCreateLike;\nexports.ApiDeleteLike = ApiDeleteLike;\nexports.ApiCheckLikeStatus = ApiCheckLikeStatus;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ../../../decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nfunction ApiCreateLike() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '좋아요',\n        description: '인증글에 좋아요를 추가합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            required: ['postUuid'],\n            properties: {\n                postUuid: {\n                    type: 'string',\n                    description: '인증글 UUID',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 201,\n        description: '좋아요가 성공적으로 추가됨',\n        schema: {\n            type: 'object',\n            properties: {\n                id: {\n                    type: 'number',\n                    example: 123,\n                },\n                postUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                userUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('LIKE_001', '이미 좋아요한 인증글입니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_001', '인증글을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiDeleteLike() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '좋아요 취소',\n        description: '인증글의 좋아요를 취소합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'postUuid',\n        description: '인증글 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '좋아요가 성공적으로 취소됨',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '좋아요가 취소되었습니다.',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('LIKE_002', '좋아요하지 않은 인증글입니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_001', '인증글을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiCheckLikeStatus() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '좋아요 상태 확인',\n        description: '사용자가 특정 인증글에 좋아요를 했는지 확인합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'postUuid',\n        description: '인증글 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '좋아요 상태 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                isLiked: {\n                    type: 'boolean',\n                    example: true,\n                },\n                likeCount: {\n                    type: 'number',\n                    example: 42,\n                },\n                postUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_001', '인증글을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/likes/decorators/likes.swagger.ts?");

/***/ }),

/***/ "./src/modules/likes/dto/create-like.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/likes/dto/create-like.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CreateLikeDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass CreateLikeDto {\n}\nexports.CreateLikeDto = CreateLikeDto;\n__decorate([\n    (0, class_validator_1.IsString)(),\n    (0, class_validator_1.IsNotEmpty)(),\n    __metadata(\"design:type\", String)\n], CreateLikeDto.prototype, \"postUuid\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/likes/dto/create-like.dto.ts?");

/***/ }),

/***/ "./src/modules/likes/likes.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/likes/likes.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LikesController = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst likes_service_1 = __webpack_require__(/*! ./likes.service */ \"./src/modules/likes/likes.service.ts\");\nconst create_like_dto_1 = __webpack_require__(/*! ./dto/create-like.dto */ \"./src/modules/likes/dto/create-like.dto.ts\");\nconst likes_swagger_1 = __webpack_require__(/*! ./decorators/likes.swagger */ \"./src/modules/likes/decorators/likes.swagger.ts\");\nconst jwt_auth_guard_1 = __webpack_require__(/*! @/auth/guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nconst user_uuid_decorator_1 = __webpack_require__(/*! @/decorators/user-uuid.decorator */ \"./src/decorators/user-uuid.decorator.ts\");\nlet LikesController = class LikesController {\n    constructor(likesService) {\n        this.likesService = likesService;\n    }\n    createLike(createLikeDto, userUuid) {\n        return this.likesService.createLike(createLikeDto, userUuid);\n    }\n    checkLikeStatus(postUuid, userUuid) {\n        return this.likesService.checkLikeStatus(userUuid, postUuid);\n    }\n    removeLike(postUuid, userUuid) {\n        return this.likesService.removeLike(postUuid, userUuid);\n    }\n};\nexports.LikesController = LikesController;\n__decorate([\n    (0, common_1.Post)(),\n    (0, likes_swagger_1.ApiCreateLike)(),\n    __param(0, (0, common_1.Body)()),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [create_like_dto_1.CreateLikeDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], LikesController.prototype, \"createLike\", null);\n__decorate([\n    (0, common_1.Get)('check/:postUuid'),\n    (0, likes_swagger_1.ApiCheckLikeStatus)(),\n    __param(0, (0, common_1.Param)('postUuid')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], LikesController.prototype, \"checkLikeStatus\", null);\n__decorate([\n    (0, common_1.Delete)('post/:postUuid/user'),\n    (0, likes_swagger_1.ApiDeleteLike)(),\n    __param(0, (0, common_1.Param)('postUuid')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], LikesController.prototype, \"removeLike\", null);\nexports.LikesController = LikesController = __decorate([\n    (0, swagger_1.ApiTags)('like'),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    (0, common_1.Controller)('like'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __metadata(\"design:paramtypes\", [likes_service_1.LikesService])\n], LikesController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/likes/likes.controller.ts?");

/***/ }),

/***/ "./src/modules/likes/likes.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/likes/likes.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LikesModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst likes_service_1 = __webpack_require__(/*! ./likes.service */ \"./src/modules/likes/likes.service.ts\");\nconst likes_controller_1 = __webpack_require__(/*! ./likes.controller */ \"./src/modules/likes/likes.controller.ts\");\nconst like_entity_1 = __webpack_require__(/*! @/entities/like.entity */ \"./src/entities/like.entity.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst posts_module_1 = __webpack_require__(/*! ../posts/posts.module */ \"./src/modules/posts/posts.module.ts\");\nconst users_module_1 = __webpack_require__(/*! ../users/users.module */ \"./src/modules/users/users.module.ts\");\nlet LikesModule = class LikesModule {\n};\nexports.LikesModule = LikesModule;\nexports.LikesModule = LikesModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            typeorm_1.TypeOrmModule.forFeature([like_entity_1.Like, user_entity_1.User]),\n            (0, common_1.forwardRef)(() => posts_module_1.PostsModule),\n            (0, common_1.forwardRef)(() => users_module_1.UsersModule),\n        ],\n        controllers: [likes_controller_1.LikesController],\n        providers: [likes_service_1.LikesService],\n        exports: [likes_service_1.LikesService],\n    })\n], LikesModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/likes/likes.module.ts?");

/***/ }),

/***/ "./src/modules/likes/likes.service.ts":
/*!********************************************!*\
  !*** ./src/modules/likes/likes.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LikesService = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst typeorm_2 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst like_entity_1 = __webpack_require__(/*! @/entities/like.entity */ \"./src/entities/like.entity.ts\");\nconst users_service_1 = __webpack_require__(/*! ../users/users.service */ \"./src/modules/users/users.service.ts\");\nlet LikesService = class LikesService {\n    constructor(likeRepository, userService) {\n        this.likeRepository = likeRepository;\n        this.userService = userService;\n    }\n    async createLike(createLikeDto, userUuid) {\n        const existingLike = await this.likeRepository.findOne({\n            where: {\n                postUuid: createLikeDto.postUuid,\n                userUuid,\n            },\n        });\n        if (existingLike) {\n            throw new common_1.ConflictException('이미 좋아요한 게시글입니다.');\n        }\n        const like = this.likeRepository.create({\n            ...createLikeDto,\n            userUuid,\n        });\n        await this.likeRepository.save(like);\n        const likeCount = await this.getLikeCountByPostId(createLikeDto.postUuid);\n        return {\n            id: like.id,\n            likeCount,\n        };\n    }\n    async getLikeCountByPostId(postUuid) {\n        return this.likeRepository.count({\n            where: { postUuid },\n        });\n    }\n    async checkLikeStatus(userUuid, postUuid) {\n        const like = await this.likeRepository.findOne({\n            where: {\n                userUuid,\n                postUuid,\n            },\n        });\n        return {\n            liked: !!like,\n        };\n    }\n    async removeLike(postUuid, userUuid) {\n        const like = await this.likeRepository.findOne({\n            where: {\n                postUuid,\n                userUuid,\n            },\n        });\n        if (!like) {\n            throw new common_1.NotFoundException('해당 게시글에 좋아요를 하지 않았습니다.');\n        }\n        await this.likeRepository.delete(like.id);\n        const likeCount = await this.getLikeCountByPostId(postUuid);\n        return {\n            success: true,\n            likeCount,\n        };\n    }\n    async getLikeCountsByPostIds(postUuids) {\n        const likes = await this.likeRepository\n            .createQueryBuilder('like')\n            .select('like.postUuid', 'postUuid')\n            .addSelect('COUNT(like.id)', 'count')\n            .where('like.postUuid IN (:...postUuids)', { postUuids })\n            .groupBy('like.postUuid')\n            .getRawMany();\n        const likeCountMap = new Map();\n        postUuids.forEach((id) => likeCountMap.set(id, 0));\n        likes.forEach((like) => {\n            likeCountMap.set(like.postUuid, parseInt(like.count));\n        });\n        return likeCountMap;\n    }\n};\nexports.LikesService = LikesService;\nexports.LikesService = LikesService = __decorate([\n    (0, common_1.Injectable)(),\n    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),\n    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),\n    __metadata(\"design:paramtypes\", [typeorm_2.Repository,\n        users_service_1.UsersService])\n], LikesService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/likes/likes.service.ts?");

/***/ }),

/***/ "./src/modules/posts/decorators/posts.swagger.ts":
/*!*******************************************************!*\
  !*** ./src/modules/posts/decorators/posts.swagger.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiCreatePost = ApiCreatePost;\nexports.ApiGetAllPosts = ApiGetAllPosts;\nexports.ApiGetPostById = ApiGetPostById;\nexports.ApiUpdatePost = ApiUpdatePost;\nexports.ApiDeletePost = ApiDeletePost;\nexports.ApiGetPopularPosts = ApiGetPopularPosts;\nexports.ApiGetPostsByNickname = ApiGetPostsByNickname;\nexports.ApiGetGroupPosts = ApiGetGroupPosts;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ../../../decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nfunction ApiCreatePost() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '인증글 생성',\n        description: '새로운 인증글을 생성합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            required: ['content'],\n            properties: {\n                content: {\n                    type: 'string',\n                    description: '인증글 내용',\n                    example: '오늘 헬스장에서 2시간 운동했어요! 💪',\n                },\n                imageUrl: {\n                    type: 'array',\n                    items: {\n                        type: 'string',\n                    },\n                    description: '인증 이미지 URL 배열',\n                    example: [\n                        'https://soapft-bucket.s3.amazonaws.com/images/workout1.jpg',\n                    ],\n                },\n                challengeUuid: {\n                    type: 'string',\n                    description: '챌린지 UUID (챌린지 인증글인 경우)',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 201,\n        description: '인증글이 성공적으로 생성됨',\n        schema: {\n            type: 'object',\n            properties: {\n                postUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                content: {\n                    type: 'string',\n                    example: '오늘 헬스장에서 2시간 운동했어요! 💪',\n                },\n                imageUrl: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    example: [\n                        'https://soapft-bucket.s3.amazonaws.com/images/workout1.jpg',\n                    ],\n                },\n                authorUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                challengeUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                likeCount: {\n                    type: 'number',\n                    example: 0,\n                },\n                commentCount: {\n                    type: 'number',\n                    example: 0,\n                },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }));\n}\nfunction ApiGetAllPosts() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '인증글 목록 조회',\n        description: '모든 공개 인증글을 조회합니다.',\n    }), (0, swagger_1.ApiQuery)({\n        name: 'page',\n        required: false,\n        description: '페이지 번호 (기본값: 1)',\n        example: 1,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'limit',\n        required: false,\n        description: '페이지당 항목 수 (기본값: 10)',\n        example: 10,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'sort',\n        required: false,\n        description: '정렬 기준 (latest, popular)',\n        example: 'latest',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '인증글 목록 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                posts: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            postUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            content: {\n                                type: 'string',\n                                example: '오늘 헬스장에서 2시간 운동했어요! 💪',\n                            },\n                            imageUrl: {\n                                type: 'array',\n                                items: { type: 'string' },\n                                example: [\n                                    'https://soapft-bucket.s3.amazonaws.com/images/workout1.jpg',\n                                ],\n                            },\n                            author: {\n                                type: 'object',\n                                properties: {\n                                    userUuid: {\n                                        type: 'string',\n                                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                    },\n                                    nickname: { type: 'string', example: '운동러버' },\n                                    profileImage: {\n                                        type: 'string',\n                                        example: 'https://example.com/profile.jpg',\n                                    },\n                                },\n                            },\n                            challenge: {\n                                type: 'object',\n                                properties: {\n                                    challengeUuid: {\n                                        type: 'string',\n                                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                    },\n                                    title: { type: 'string', example: '30일 헬스 챌린지' },\n                                },\n                            },\n                            likeCount: { type: 'number', example: 15 },\n                            commentCount: { type: 'number', example: 3 },\n                            isLiked: { type: 'boolean', example: false },\n                            createdAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                        },\n                    },\n                },\n                pagination: {\n                    type: 'object',\n                    properties: {\n                        currentPage: { type: 'number', example: 1 },\n                        totalPages: { type: 'number', example: 5 },\n                        totalItems: { type: 'number', example: 50 },\n                        itemsPerPage: { type: 'number', example: 10 },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetPostById() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '인증글 상세 조회',\n        description: '특정 인증글의 상세 정보를 조회합니다.',\n    }), (0, swagger_1.ApiParam)({\n        name: 'postUuid',\n        description: '인증글 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '인증글 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                postUuid: { type: 'string', example: '01HZQK5J8X2M3N4P5Q6R7S8T9V' },\n                content: {\n                    type: 'string',\n                    example: '오늘 헬스장에서 2시간 운동했어요! 💪',\n                },\n                imageUrl: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    example: [\n                        'https://soapft-bucket.s3.amazonaws.com/images/workout1.jpg',\n                    ],\n                },\n                author: {\n                    type: 'object',\n                    properties: {\n                        userUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        nickname: { type: 'string', example: '운동러버' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                    },\n                },\n                challenge: {\n                    type: 'object',\n                    properties: {\n                        challengeUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        title: { type: 'string', example: '30일 헬스 챌린지' },\n                    },\n                },\n                likeCount: { type: 'number', example: 15 },\n                commentCount: { type: 'number', example: 3 },\n                isLiked: { type: 'boolean', example: false },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n                updatedAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_001', '인증글을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiUpdatePost() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '인증글 수정',\n        description: '작성한 인증글을 수정합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'postUuid',\n        description: '인증글 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            properties: {\n                content: {\n                    type: 'string',\n                    description: '수정할 인증글 내용',\n                    example: '오늘 헬스장에서 3시간 운동했어요! 💪',\n                },\n                imageUrl: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: '수정할 이미지 URL 배열',\n                    example: [\n                        'https://soapft-bucket.s3.amazonaws.com/images/workout2.jpg',\n                    ],\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '인증글 수정 성공',\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_004', '본인의 인증글만 수정할 수 있습니다.', 403)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_001', '인증글을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('POST_003', '인증글 내용은 필수입니다.', 400)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiDeletePost() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '인증글 삭제',\n        description: '작성한 인증글을 삭제합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'postUuid',\n        description: '인증글 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '인증글 삭제 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '인증글이 삭제되었습니다.',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }), (0, swagger_1.ApiResponse)({\n        status: 403,\n        description: '삭제 권한 없음',\n    }), (0, swagger_1.ApiResponse)({\n        status: 404,\n        description: '인증글을 찾을 수 없음',\n    }));\n}\nfunction ApiGetPopularPosts() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '인기 인증글 조회',\n        description: '좋아요가 많은 인기 인증글을 조회합니다.',\n    }), (0, swagger_1.ApiQuery)({\n        name: 'limit',\n        required: false,\n        description: '조회할 인증글 수 (기본값: 10)',\n        example: 10,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'period',\n        required: false,\n        description: '기간 (daily, weekly, monthly)',\n        example: 'weekly',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '인기 인증글 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                posts: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            postUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            content: {\n                                type: 'string',\n                                example: '오늘 헬스장에서 2시간 운동했어요! 💪',\n                            },\n                            imageUrl: {\n                                type: 'array',\n                                items: { type: 'string' },\n                                example: [\n                                    'https://soapft-bucket.s3.amazonaws.com/images/workout1.jpg',\n                                ],\n                            },\n                            author: {\n                                type: 'object',\n                                properties: {\n                                    userUuid: {\n                                        type: 'string',\n                                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                    },\n                                    nickname: { type: 'string', example: '운동러버' },\n                                    profileImage: {\n                                        type: 'string',\n                                        example: 'https://example.com/profile.jpg',\n                                    },\n                                },\n                            },\n                            likeCount: { type: 'number', example: 150 },\n                            commentCount: { type: 'number', example: 23 },\n                            createdAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                        },\n                    },\n                },\n            },\n        },\n    }));\n}\nfunction ApiGetPostsByNickname() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '닉네임으로 사용자 게시글 조회',\n        description: '특정 사용자의 닉네임으로 해당 사용자의 게시글을 조회합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'nickname',\n        description: '조회할 사용자의 닉네임',\n        type: 'string',\n        example: 'user123',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '사용자 게시글 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                success: {\n                    type: 'boolean',\n                    example: true,\n                    description: '성공 여부',\n                },\n                data: {\n                    type: 'array',\n                    description: '게시글 목록',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            postUuid: {\n                                type: 'string',\n                                example: '01HXX1X1X1X1X1X1X1X1X1X1X1',\n                                description: '게시글 ULID',\n                            },\n                            content: {\n                                type: 'string',\n                                example: '오늘 운동 완료했습니다!',\n                                description: '게시글 내용',\n                            },\n                            imageUrl: {\n                                type: 'array',\n                                items: { type: 'string' },\n                                example: ['https://example.com/image.jpg'],\n                                description: '이미지 URL 배열',\n                            },\n                            likeCount: {\n                                type: 'number',\n                                example: 5,\n                                description: '좋아요 수',\n                            },\n                            commentCount: {\n                                type: 'number',\n                                example: 3,\n                                description: '댓글 수',\n                            },\n                            createdAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00.000Z',\n                                description: '생성 시각',\n                            },\n                            author: {\n                                type: 'object',\n                                properties: {\n                                    userUuid: {\n                                        type: 'string',\n                                        example: '01HXX3X3X3X3X3X3X3X3X3X3X3',\n                                        description: '작성자 UUID',\n                                    },\n                                    nickname: {\n                                        type: 'string',\n                                        example: 'user123',\n                                        description: '작성자 닉네임',\n                                    },\n                                    profileImage: {\n                                        type: 'string',\n                                        example: 'https://example.com/profile.jpg',\n                                        description: '작성자 프로필 이미지',\n                                    },\n                                },\n                            },\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('USER_003', '존재하지 않는 사용자입니다.', 404)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetGroupPosts() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '그룹 게시글 조회',\n        description: '특정 그룹(챌린지)에 속한 모든 참여자들의 게시글을 조회합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'groupId',\n        description: '조회할 그룹(챌린지) ID',\n        type: 'string',\n        example: '01HXX2X2X2X2X2X2X2X2X2X2X2',\n    }), (0, swagger_1.ApiQuery)({\n        name: 'page',\n        description: '페이지 번호 (1부터 시작)',\n        type: 'number',\n        example: 1,\n        required: false,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'limit',\n        description: '페이지당 게시글 수',\n        type: 'number',\n        example: 10,\n        required: false,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'sortBy',\n        description: '정렬 기준',\n        enum: ['latest', 'oldest', 'likes'],\n        example: 'latest',\n        required: false,\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '그룹 게시글 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                success: {\n                    type: 'boolean',\n                    example: true,\n                    description: '성공 여부',\n                },\n                data: {\n                    type: 'object',\n                    properties: {\n                        posts: {\n                            type: 'array',\n                            description: '게시글 목록',\n                            items: {\n                                type: 'object',\n                                properties: {\n                                    postUuid: {\n                                        type: 'string',\n                                        example: '01HXX1X1X1X1X1X1X1X1X1X1X1',\n                                        description: '게시글 ULID',\n                                    },\n                                    content: {\n                                        type: 'string',\n                                        example: '오늘 운동 완료했습니다!',\n                                        description: '게시글 내용',\n                                    },\n                                    imageUrl: {\n                                        type: 'array',\n                                        items: { type: 'string' },\n                                        example: ['https://example.com/image.jpg'],\n                                        description: '이미지 URL 배열',\n                                    },\n                                    likeCount: {\n                                        type: 'number',\n                                        example: 5,\n                                        description: '좋아요 수',\n                                    },\n                                    commentCount: {\n                                        type: 'number',\n                                        example: 3,\n                                        description: '댓글 수',\n                                    },\n                                    createdAt: {\n                                        type: 'string',\n                                        format: 'date-time',\n                                        example: '2025-06-22T12:00:00.000Z',\n                                        description: '생성 시각',\n                                    },\n                                    author: {\n                                        type: 'object',\n                                        properties: {\n                                            userUuid: {\n                                                type: 'string',\n                                                example: '01HXX3X3X3X3X3X3X3X3X3X3X3',\n                                                description: '작성자 UUID',\n                                            },\n                                            nickname: {\n                                                type: 'string',\n                                                example: 'user123',\n                                                description: '작성자 닉네임',\n                                            },\n                                            profileImage: {\n                                                type: 'string',\n                                                example: 'https://example.com/profile.jpg',\n                                                description: '작성자 프로필 이미지',\n                                            },\n                                        },\n                                    },\n                                },\n                            },\n                        },\n                        pagination: {\n                            type: 'object',\n                            properties: {\n                                currentPage: {\n                                    type: 'number',\n                                    example: 1,\n                                    description: '현재 페이지',\n                                },\n                                totalPages: {\n                                    type: 'number',\n                                    example: 5,\n                                    description: '전체 페이지 수',\n                                },\n                                totalItems: {\n                                    type: 'number',\n                                    example: 50,\n                                    description: '전체 게시글 수',\n                                },\n                                itemsPerPage: {\n                                    type: 'number',\n                                    example: 10,\n                                    description: '페이지당 게시글 수',\n                                },\n                            },\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_003', '존재하지 않는 챌린지입니다.', 404)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('CHALLENGE_009', '챌린지에 참여하지 않은 사용자입니다.', 403)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/decorators/posts.swagger.ts?");

/***/ }),

/***/ "./src/modules/posts/dto/create-post.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/posts/dto/create-post.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CreatePostDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass CreatePostDto {\n}\nexports.CreatePostDto = CreatePostDto;\n__decorate([\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], CreatePostDto.prototype, \"content\", void 0);\n__decorate([\n    (0, class_validator_1.IsArray)(),\n    (0, class_validator_1.IsOptional)(),\n    __metadata(\"design:type\", Array)\n], CreatePostDto.prototype, \"imageUrl\", void 0);\n__decorate([\n    (0, class_validator_1.IsUUID)(),\n    __metadata(\"design:type\", String)\n], CreatePostDto.prototype, \"challengeUuid\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/dto/create-post.dto.ts?");

/***/ }),

/***/ "./src/modules/posts/dto/find-all-posts.dto.ts":
/*!*****************************************************!*\
  !*** ./src/modules/posts/dto/find-all-posts.dto.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FindAllPostsDto = void 0;\nconst class_transformer_1 = __webpack_require__(/*! class-transformer */ \"class-transformer\");\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass FindAllPostsDto {\n    constructor() {\n        this.page = 1;\n        this.limit = 24;\n    }\n}\nexports.FindAllPostsDto = FindAllPostsDto;\n__decorate([\n    (0, class_validator_1.IsNumber)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.Min)(1),\n    __metadata(\"design:type\", Number)\n], FindAllPostsDto.prototype, \"page\", void 0);\n__decorate([\n    (0, class_validator_1.IsNumber)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.Min)(1),\n    __metadata(\"design:type\", Number)\n], FindAllPostsDto.prototype, \"limit\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/dto/find-all-posts.dto.ts?");

/***/ }),

/***/ "./src/modules/posts/dto/find-group-posts.dto.ts":
/*!*******************************************************!*\
  !*** ./src/modules/posts/dto/find-group-posts.dto.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FindGroupPostsDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nconst class_transformer_1 = __webpack_require__(/*! class-transformer */ \"class-transformer\");\nclass FindGroupPostsDto {\n    constructor() {\n        this.page = 1;\n        this.limit = 24;\n    }\n}\nexports.FindGroupPostsDto = FindGroupPostsDto;\n__decorate([\n    (0, class_validator_1.IsOptional)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.IsNumber)(),\n    (0, class_validator_1.Min)(1),\n    __metadata(\"design:type\", Number)\n], FindGroupPostsDto.prototype, \"page\", void 0);\n__decorate([\n    (0, class_validator_1.IsOptional)(),\n    (0, class_transformer_1.Type)(() => Number),\n    (0, class_validator_1.IsNumber)(),\n    (0, class_validator_1.Min)(1),\n    __metadata(\"design:type\", Number)\n], FindGroupPostsDto.prototype, \"limit\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/dto/find-group-posts.dto.ts?");

/***/ }),

/***/ "./src/modules/posts/dto/update-post.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/posts/dto/update-post.dto.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UpdatePostDto = void 0;\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst create_post_dto_1 = __webpack_require__(/*! ./create-post.dto */ \"./src/modules/posts/dto/create-post.dto.ts\");\nclass UpdatePostDto extends (0, swagger_1.PartialType)(create_post_dto_1.CreatePostDto) {\n}\nexports.UpdatePostDto = UpdatePostDto;\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/dto/update-post.dto.ts?");

/***/ }),

/***/ "./src/modules/posts/posts.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/posts/posts.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PostsController = void 0;\nconst posts_service_1 = __webpack_require__(/*! ./posts.service */ \"./src/modules/posts/posts.service.ts\");\nconst create_post_dto_1 = __webpack_require__(/*! ./dto/create-post.dto */ \"./src/modules/posts/dto/create-post.dto.ts\");\nconst update_post_dto_1 = __webpack_require__(/*! ./dto/update-post.dto */ \"./src/modules/posts/dto/update-post.dto.ts\");\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst posts_swagger_1 = __webpack_require__(/*! ./decorators/posts.swagger */ \"./src/modules/posts/decorators/posts.swagger.ts\");\nconst find_all_posts_dto_1 = __webpack_require__(/*! ./dto/find-all-posts.dto */ \"./src/modules/posts/dto/find-all-posts.dto.ts\");\nconst find_group_posts_dto_1 = __webpack_require__(/*! ./dto/find-group-posts.dto */ \"./src/modules/posts/dto/find-group-posts.dto.ts\");\nconst user_uuid_decorator_1 = __webpack_require__(/*! @/decorators/user-uuid.decorator */ \"./src/decorators/user-uuid.decorator.ts\");\nconst jwt_auth_guard_1 = __webpack_require__(/*! @/auth/guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nlet PostsController = class PostsController {\n    constructor(postsService) {\n        this.postsService = postsService;\n    }\n    createPost(createPostDto, userUuid) {\n        return null;\n    }\n    findAllPosts(findAllPostsDto, userUuid) {\n        return null;\n    }\n    findAllPostsByNickname(nickname) {\n        return null;\n    }\n    findOnePost(postUuid, userUuid) {\n        return null;\n    }\n    updatePost(postUuid, updatePostDto, userUuid) {\n        return null;\n    }\n    removePost(postUuid, userUuid) {\n        return null;\n    }\n    findGroupPosts(groupId, findGroupPostsDto, userUuid) {\n        return null;\n    }\n};\nexports.PostsController = PostsController;\n__decorate([\n    (0, common_1.Post)(),\n    (0, posts_swagger_1.ApiCreatePost)(),\n    __param(0, (0, common_1.Body)()),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [create_post_dto_1.CreatePostDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], PostsController.prototype, \"createPost\", null);\n__decorate([\n    (0, common_1.Get)(),\n    (0, posts_swagger_1.ApiGetAllPosts)(),\n    __param(0, (0, common_1.Query)()),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [find_all_posts_dto_1.FindAllPostsDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], PostsController.prototype, \"findAllPosts\", null);\n__decorate([\n    (0, common_1.Get)('user/:nickname'),\n    (0, posts_swagger_1.ApiGetPostsByNickname)(),\n    __param(0, (0, common_1.Param)('nickname')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", void 0)\n], PostsController.prototype, \"findAllPostsByNickname\", null);\n__decorate([\n    (0, common_1.Get)(':postUuid'),\n    (0, posts_swagger_1.ApiGetPostById)(),\n    __param(0, (0, common_1.Param)('postUuid')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], PostsController.prototype, \"findOnePost\", null);\n__decorate([\n    (0, common_1.Patch)(':postUuid'),\n    (0, posts_swagger_1.ApiUpdatePost)(),\n    __param(0, (0, common_1.Param)('postUuid')),\n    __param(1, (0, common_1.Body)()),\n    __param(2, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, update_post_dto_1.UpdatePostDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], PostsController.prototype, \"updatePost\", null);\n__decorate([\n    (0, common_1.Delete)(':postUuid'),\n    (0, posts_swagger_1.ApiDeletePost)(),\n    __param(0, (0, common_1.Param)('postUuid')),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", void 0)\n], PostsController.prototype, \"removePost\", null);\n__decorate([\n    (0, common_1.Get)('group/:groupId'),\n    (0, posts_swagger_1.ApiGetGroupPosts)(),\n    __param(0, (0, common_1.Param)('groupId')),\n    __param(1, (0, common_1.Query)()),\n    __param(2, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, find_group_posts_dto_1.FindGroupPostsDto, String]),\n    __metadata(\"design:returntype\", void 0)\n], PostsController.prototype, \"findGroupPosts\", null);\nexports.PostsController = PostsController = __decorate([\n    (0, swagger_1.ApiTags)('post'),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    (0, common_1.Controller)('post'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __metadata(\"design:paramtypes\", [posts_service_1.PostsService])\n], PostsController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/posts.controller.ts?");

/***/ }),

/***/ "./src/modules/posts/posts.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/posts/posts.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PostsModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst posts_service_1 = __webpack_require__(/*! ./posts.service */ \"./src/modules/posts/posts.service.ts\");\nconst posts_controller_1 = __webpack_require__(/*! ./posts.controller */ \"./src/modules/posts/posts.controller.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst post_entity_1 = __webpack_require__(/*! @/entities/post.entity */ \"./src/entities/post.entity.ts\");\nconst likes_module_1 = __webpack_require__(/*! @/modules/likes/likes.module */ \"./src/modules/likes/likes.module.ts\");\nconst comments_module_1 = __webpack_require__(/*! ../comments/comments.module */ \"./src/modules/comments/comments.module.ts\");\nconst challenge_module_1 = __webpack_require__(/*! ../challenges/challenge.module */ \"./src/modules/challenges/challenge.module.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst users_module_1 = __webpack_require__(/*! ../users/users.module */ \"./src/modules/users/users.module.ts\");\nlet PostsModule = class PostsModule {\n};\nexports.PostsModule = PostsModule;\nexports.PostsModule = PostsModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            typeorm_1.TypeOrmModule.forFeature([post_entity_1.Post, user_entity_1.User]),\n            (0, common_1.forwardRef)(() => likes_module_1.LikesModule),\n            (0, common_1.forwardRef)(() => comments_module_1.CommentsModule),\n            (0, common_1.forwardRef)(() => challenge_module_1.ChallengeModule),\n            (0, common_1.forwardRef)(() => users_module_1.UsersModule),\n        ],\n        controllers: [posts_controller_1.PostsController],\n        providers: [posts_service_1.PostsService],\n        exports: [posts_service_1.PostsService],\n    })\n], PostsModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/posts.module.ts?");

/***/ }),

/***/ "./src/modules/posts/posts.service.ts":
/*!********************************************!*\
  !*** ./src/modules/posts/posts.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PostsService = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst typeorm_2 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst post_entity_1 = __webpack_require__(/*! @/entities/post.entity */ \"./src/entities/post.entity.ts\");\nconst likes_service_1 = __webpack_require__(/*! @/modules/likes/likes.service */ \"./src/modules/likes/likes.service.ts\");\nconst comments_service_1 = __webpack_require__(/*! ../comments/comments.service */ \"./src/modules/comments/comments.service.ts\");\nconst challenge_service_1 = __webpack_require__(/*! ../challenges/challenge.service */ \"./src/modules/challenges/challenge.service.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst users_service_1 = __webpack_require__(/*! ../users/users.service */ \"./src/modules/users/users.service.ts\");\nlet PostsService = class PostsService {\n    constructor(postRepository, likesService, commentsService, challengeService, userRepository, userService) {\n        this.postRepository = postRepository;\n        this.likesService = likesService;\n        this.commentsService = commentsService;\n        this.challengeService = challengeService;\n        this.userRepository = userRepository;\n        this.userService = userService;\n    }\n};\nexports.PostsService = PostsService;\nexports.PostsService = PostsService = __decorate([\n    (0, common_1.Injectable)(),\n    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),\n    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => comments_service_1.CommentsService))),\n    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => challenge_service_1.ChallengeService))),\n    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),\n    __metadata(\"design:paramtypes\", [typeorm_2.Repository,\n        likes_service_1.LikesService,\n        comments_service_1.CommentsService,\n        challenge_service_1.ChallengeService,\n        typeorm_2.Repository,\n        users_service_1.UsersService])\n], PostsService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/posts/posts.service.ts?");

/***/ }),

/***/ "./src/modules/s3/s3.controller.ts":
/*!*****************************************!*\
  !*** ./src/modules/s3/s3.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.S3Controller = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst s3_service_1 = __webpack_require__(/*! ./s3.service */ \"./src/modules/s3/s3.service.ts\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst jwt_auth_guard_1 = __webpack_require__(/*! @/auth/guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nlet S3Controller = class S3Controller {\n    constructor(s3Service) {\n        this.s3Service = s3Service;\n    }\n};\nexports.S3Controller = S3Controller;\nexports.S3Controller = S3Controller = __decorate([\n    (0, swagger_1.ApiTags)('s3'),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    (0, common_1.Controller)('s3'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __metadata(\"design:paramtypes\", [s3_service_1.S3Service])\n], S3Controller);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/s3/s3.controller.ts?");

/***/ }),

/***/ "./src/modules/s3/s3.module.ts":
/*!*************************************!*\
  !*** ./src/modules/s3/s3.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.S3Module = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst s3_service_1 = __webpack_require__(/*! ./s3.service */ \"./src/modules/s3/s3.service.ts\");\nconst s3_controller_1 = __webpack_require__(/*! ./s3.controller */ \"./src/modules/s3/s3.controller.ts\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nlet S3Module = class S3Module {\n};\nexports.S3Module = S3Module;\nexports.S3Module = S3Module = __decorate([\n    (0, common_1.Module)({\n        imports: [config_1.ConfigModule],\n        controllers: [s3_controller_1.S3Controller],\n        providers: [s3_service_1.S3Service],\n    })\n], S3Module);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/s3/s3.module.ts?");

/***/ }),

/***/ "./src/modules/s3/s3.service.ts":
/*!**************************************!*\
  !*** ./src/modules/s3/s3.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.S3Service = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nconst AWS = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\nconst winston_1 = __webpack_require__(/*! winston */ \"winston\");\nconst uuid_1 = __webpack_require__(/*! uuid */ \"uuid\");\nlet S3Service = class S3Service {\n    constructor(configService) {\n        this.configService = configService;\n        this.bucketName = this.configService.get('AWS_S3_BUCKET');\n        AWS.config.update({\n            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),\n            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),\n            region: this.configService.get('AWS_REGION'),\n        });\n        this.s3 = new AWS.S3();\n    }\n    async uploadImage(file) {\n        try {\n            const fileExtension = file.originalname.split('.').pop();\n            const fileName = `${(0, uuid_1.v4)()}.${fileExtension}`;\n            const params = {\n                Bucket: this.bucketName,\n                Key: `images/${fileName}`,\n                Body: file.buffer,\n                ContentType: file.mimetype,\n                ACL: 'public-read',\n            };\n            const result = await this.s3.upload(params).promise();\n            this.logger.info('이미지 업로드 성공', { location: result.Location });\n            return result.Location;\n        }\n        catch (error) {\n            this.logger.error('이미지 업로드 실패', { error: error.message });\n            throw error;\n        }\n    }\n    async deleteImage(imageUrl) {\n        try {\n            const key = imageUrl.split('/').slice(3).join('/');\n            const params = {\n                Bucket: this.bucketName,\n                Key: key,\n            };\n            await this.s3.deleteObject(params).promise();\n            this.logger.info('이미지 삭제 성공', { key });\n        }\n        catch (error) {\n            this.logger.error('이미지 삭제 실패', { error: error.message });\n            throw error;\n        }\n    }\n};\nexports.S3Service = S3Service;\n__decorate([\n    (0, common_1.Inject)('winston'),\n    __metadata(\"design:type\", winston_1.Logger)\n], S3Service.prototype, \"logger\", void 0);\nexports.S3Service = S3Service = __decorate([\n    (0, common_1.Injectable)(),\n    __metadata(\"design:paramtypes\", [config_1.ConfigService])\n], S3Service);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/s3/s3.service.ts?");

/***/ }),

/***/ "./src/modules/uploads/decorators/uploads.swagger.ts":
/*!***********************************************************!*\
  !*** ./src/modules/uploads/decorators/uploads.swagger.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiUploadImage = ApiUploadImage;\nexports.ApiDeleteImage = ApiDeleteImage;\nexports.ApiUploadMultipleImages = ApiUploadMultipleImages;\nexports.ApiGetUploadHistory = ApiGetUploadHistory;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ../../../decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nfunction ApiUploadImage() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '이미지 업로드',\n        description: 'S3 Bucket에 이미지 파일을 업로드합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            properties: {\n                image: {\n                    type: 'string',\n                    format: 'binary',\n                    description: '업로드할 이미지 파일 (jpg, jpeg, png, gif만 가능)',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 201,\n        description: '이미지가 성공적으로 업로드됨',\n        schema: {\n            type: 'object',\n            properties: {\n                imageUrl: {\n                    type: 'string',\n                    example: 'https://soapft-bucket.s3.amazonaws.com/images/example-image.jpg',\n                },\n                message: {\n                    type: 'string',\n                    example: '이미지가 업로드되었습니다.',\n                },\n                fileName: {\n                    type: 'string',\n                    example: 'example-image.jpg',\n                },\n                fileSize: {\n                    type: 'number',\n                    example: 1024000,\n                },\n                uploadedAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_001', '지원하지 않는 파일 형식입니다.', 400, {\n        allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],\n    })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_002', '파일 크기가 너무 큽니다.', 413, {\n        maxSize: '10MB',\n    })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_003', '파일 업로드에 실패했습니다.', 500)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiDeleteImage() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '이미지 삭제',\n        description: '업로드된 이미지를 S3에서 삭제합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiParam)({\n        name: 'imageUrl',\n        description: '삭제할 이미지 URL (URL 인코딩 필요)',\n        required: true,\n        example: 'https%3A%2F%2Fsoapft-bucket.s3.amazonaws.com%2Fimages%2Fexample-image.jpg',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '이미지가 성공적으로 삭제됨',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '이미지가 삭제되었습니다.',\n                },\n                deletedUrl: {\n                    type: 'string',\n                    example: 'https://soapft-bucket.s3.amazonaws.com/images/example-image.jpg',\n                },\n                deletedAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_004', '파일을 찾을 수 없습니다.', 404)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_005', '파일 삭제에 실패했습니다.', 500)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_006', '파일 삭제 권한이 없습니다.', 403)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Forbidden), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiUploadMultipleImages() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '다중 이미지 업로드',\n        description: '여러 개의 이미지 파일을 한 번에 업로드합니다. (최대 10개)',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            properties: {\n                images: {\n                    type: 'array',\n                    items: {\n                        type: 'string',\n                        format: 'binary',\n                    },\n                    description: '업로드할 이미지 파일들 (최대 10개)',\n                    maxItems: 10,\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 201,\n        description: '이미지들이 성공적으로 업로드됨',\n        schema: {\n            type: 'object',\n            properties: {\n                imageUrls: {\n                    type: 'array',\n                    items: {\n                        type: 'string',\n                    },\n                    example: [\n                        'https://soapft-bucket.s3.amazonaws.com/images/image1.jpg',\n                        'https://soapft-bucket.s3.amazonaws.com/images/image2.jpg',\n                    ],\n                },\n                message: {\n                    type: 'string',\n                    example: '2개의 이미지가 업로드되었습니다.',\n                },\n                uploadCount: {\n                    type: 'number',\n                    example: 2,\n                },\n                totalSize: {\n                    type: 'number',\n                    example: 2048000,\n                },\n                uploadedAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_001', '지원하지 않는 파일 형식입니다.', 400, {\n        allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],\n    })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_002', '파일 크기가 너무 큽니다.', 413, {\n        maxSize: '10MB',\n    })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_007', '업로드 파일 개수가 초과되었습니다.', 400, { maxFiles: 10 })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('FILE_003', '파일 업로드에 실패했습니다.', 500)), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetUploadHistory() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '업로드 기록 조회',\n        description: '사용자가 업로드한 이미지들의 기록을 조회합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '업로드 기록 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                uploads: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            id: { type: 'number', example: 123 },\n                            imageUrl: {\n                                type: 'string',\n                                example: 'https://soapft-bucket.s3.amazonaws.com/images/example.jpg',\n                            },\n                            fileName: { type: 'string', example: 'example.jpg' },\n                            fileSize: { type: 'number', example: 1024000 },\n                            mimeType: { type: 'string', example: 'image/jpeg' },\n                            uploadedAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                            isUsed: { type: 'boolean', example: true },\n                            usedIn: {\n                                type: 'object',\n                                properties: {\n                                    type: { type: 'string', example: 'post' },\n                                    id: {\n                                        type: 'string',\n                                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                    },\n                                },\n                            },\n                        },\n                    },\n                },\n                totalCount: { type: 'number', example: 25 },\n                totalSize: { type: 'number', example: 52428800 },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/uploads/decorators/uploads.swagger.ts?");

/***/ }),

/***/ "./src/modules/uploads/dto/delete-image-param.dto.ts":
/*!***********************************************************!*\
  !*** ./src/modules/uploads/dto/delete-image-param.dto.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DeleteImageParamDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass DeleteImageParamDto {\n}\nexports.DeleteImageParamDto = DeleteImageParamDto;\n__decorate([\n    (0, class_validator_1.IsNotEmpty)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], DeleteImageParamDto.prototype, \"ImageUrl\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/uploads/dto/delete-image-param.dto.ts?");

/***/ }),

/***/ "./src/modules/uploads/uploads.controller.ts":
/*!***************************************************!*\
  !*** ./src/modules/uploads/uploads.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UploadsController = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst uploads_service_1 = __webpack_require__(/*! ./uploads.service */ \"./src/modules/uploads/uploads.service.ts\");\nconst winston_1 = __webpack_require__(/*! winston */ \"winston\");\nconst s3_service_1 = __webpack_require__(/*! ../s3/s3.service */ \"./src/modules/s3/s3.service.ts\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst delete_image_param_dto_1 = __webpack_require__(/*! ./dto/delete-image-param.dto */ \"./src/modules/uploads/dto/delete-image-param.dto.ts\");\nconst file_interceptor_decorator_1 = __webpack_require__(/*! @/decorators/file-interceptor.decorator */ \"./src/decorators/file-interceptor.decorator.ts\");\nconst uploads_swagger_1 = __webpack_require__(/*! ./decorators/uploads.swagger */ \"./src/modules/uploads/decorators/uploads.swagger.ts\");\nconst jwt_auth_guard_1 = __webpack_require__(/*! @/auth/guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nlet UploadsController = class UploadsController {\n    constructor(uploadsService, logger, s3Service) {\n        this.uploadsService = uploadsService;\n        this.logger = logger;\n        this.s3Service = s3Service;\n    }\n    async uploadImage(file) {\n        if (!file) {\n            throw new common_1.BadRequestException('이미지 파일을 제공해주세요.');\n        }\n        try {\n            this.logger.info(`이미지 업로드 시작: ${file.originalname}`);\n            const imageUrl = await this.s3Service.uploadImage(file);\n            this.logger.info(`이미지 업로드 완료: ${imageUrl}`);\n            return { message: '이미지가 업로드되었습니다.', imageUrl };\n        }\n        catch (error) {\n            this.logger.error(`이미지 업로드 실패 - ${error.message}`);\n            throw new common_1.BadRequestException(`이미지 업로드 실패: ${error.message}`);\n        }\n    }\n    async deleteImage(params) {\n        try {\n            this.logger.info(`이미지 삭제 시작: ${params.ImageUrl}`);\n            await this.s3Service.deleteImage(params.ImageUrl);\n            this.logger.info(`이미지 삭제 완료: ${params.ImageUrl}`);\n            return {\n                message: '이미지가 삭제되었습니다.',\n            };\n        }\n        catch (error) {\n            this.logger.error(`이미지 삭제 실패 - ${error.message}`);\n            throw new common_1.BadRequestException(`이미지 삭제 실패: ${error.message}`);\n        }\n    }\n};\nexports.UploadsController = UploadsController;\n__decorate([\n    (0, common_1.Post)('image'),\n    (0, uploads_swagger_1.ApiUploadImage)(),\n    (0, file_interceptor_decorator_1.ImageFileInterceptor)('image'),\n    __param(0, (0, common_1.UploadedFile)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", Promise)\n], UploadsController.prototype, \"uploadImage\", null);\n__decorate([\n    (0, common_1.Delete)('image/:url'),\n    (0, uploads_swagger_1.ApiDeleteImage)(),\n    __param(0, (0, common_1.Param)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [delete_image_param_dto_1.DeleteImageParamDto]),\n    __metadata(\"design:returntype\", Promise)\n], UploadsController.prototype, \"deleteImage\", null);\nexports.UploadsController = UploadsController = __decorate([\n    (0, swagger_1.ApiTags)('upload'),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    (0, common_1.Controller)('upload'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __param(1, (0, common_1.Inject)('winston')),\n    __metadata(\"design:paramtypes\", [uploads_service_1.UploadsService,\n        winston_1.Logger,\n        s3_service_1.S3Service])\n], UploadsController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/uploads/uploads.controller.ts?");

/***/ }),

/***/ "./src/modules/uploads/uploads.module.ts":
/*!***********************************************!*\
  !*** ./src/modules/uploads/uploads.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UploadsModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst uploads_service_1 = __webpack_require__(/*! ./uploads.service */ \"./src/modules/uploads/uploads.service.ts\");\nconst uploads_controller_1 = __webpack_require__(/*! ./uploads.controller */ \"./src/modules/uploads/uploads.controller.ts\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nconst s3_service_1 = __webpack_require__(/*! ../s3/s3.service */ \"./src/modules/s3/s3.service.ts\");\nlet UploadsModule = class UploadsModule {\n};\nexports.UploadsModule = UploadsModule;\nexports.UploadsModule = UploadsModule = __decorate([\n    (0, common_1.Module)({\n        imports: [config_1.ConfigModule],\n        controllers: [uploads_controller_1.UploadsController],\n        providers: [uploads_service_1.UploadsService, s3_service_1.S3Service],\n    })\n], UploadsModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/uploads/uploads.module.ts?");

/***/ }),

/***/ "./src/modules/uploads/uploads.service.ts":
/*!************************************************!*\
  !*** ./src/modules/uploads/uploads.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UploadsService = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nlet UploadsService = class UploadsService {\n};\nexports.UploadsService = UploadsService;\nexports.UploadsService = UploadsService = __decorate([\n    (0, common_1.Injectable)()\n], UploadsService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/uploads/uploads.service.ts?");

/***/ }),

/***/ "./src/modules/users/decorators/users.swagger.ts":
/*!*******************************************************!*\
  !*** ./src/modules/users/decorators/users.swagger.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ApiGetUserInfo = ApiGetUserInfo;\nexports.ApiUpdateProfile = ApiUpdateProfile;\nexports.ApiLogout = ApiLogout;\nexports.ApiDeleteUser = ApiDeleteUser;\nexports.ApiGetUserPosts = ApiGetUserPosts;\nexports.ApiGetUserChallenges = ApiGetUserChallenges;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst swagger_decorator_1 = __webpack_require__(/*! ../../../decorators/swagger.decorator */ \"./src/decorators/swagger.decorator.ts\");\nfunction ApiGetUserInfo() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '사용자 정보 조회',\n        description: '현재 로그인한 사용자의 정보를 조회합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '사용자 정보 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                userUuid: {\n                    type: 'string',\n                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                },\n                nickname: {\n                    type: 'string',\n                    example: '운동러버',\n                },\n                socialNickname: {\n                    type: 'string',\n                    example: '카카오_운동러버',\n                },\n                profileImage: {\n                    type: 'string',\n                    example: 'https://example.com/profile.jpg',\n                },\n                socialProvider: {\n                    type: 'string',\n                    enum: ['KAKAO', 'NAVER', 'APPLE'],\n                    example: 'KAKAO',\n                },\n                introduction: {\n                    type: 'string',\n                    example: '건강한 삶을 추구하는 운동 애호가입니다!',\n                },\n                age: {\n                    type: 'number',\n                    example: 28,\n                },\n                gender: {\n                    type: 'string',\n                    enum: ['MALE', 'FEMALE'],\n                    example: 'MALE',\n                },\n                coins: {\n                    type: 'number',\n                    example: 5000,\n                },\n                isPushEnabled: {\n                    type: 'boolean',\n                    example: true,\n                },\n                status: {\n                    type: 'string',\n                    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],\n                    example: 'ACTIVE',\n                },\n                createdAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n                updatedAt: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00Z',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiUpdateProfile() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '프로필 수정',\n        description: '사용자의 프로필 정보를 수정합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({\n        schema: {\n            type: 'object',\n            properties: {\n                nickname: {\n                    type: 'string',\n                    description: '닉네임',\n                    example: '새로운닉네임',\n                    minLength: 2,\n                    maxLength: 20,\n                },\n                profileImage: {\n                    type: 'string',\n                    description: '프로필 이미지 URL',\n                    example: 'https://soapft-bucket.s3.amazonaws.com/images/new-profile.jpg',\n                },\n                introduction: {\n                    type: 'string',\n                    description: '자기소개',\n                    example: '더욱 건강한 삶을 위해 노력하고 있습니다!',\n                    maxLength: 200,\n                },\n                age: {\n                    type: 'number',\n                    description: '연령',\n                    example: 29,\n                    minimum: 14,\n                    maximum: 100,\n                },\n                gender: {\n                    type: 'string',\n                    enum: ['MALE', 'FEMALE'],\n                    description: '성별',\n                    example: 'MALE',\n                },\n                isPushEnabled: {\n                    type: 'boolean',\n                    description: '푸시 알림 활성화 여부',\n                    example: true,\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '프로필 수정 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '프로필이 수정되었습니다.',\n                },\n                user: {\n                    type: 'object',\n                    properties: {\n                        userUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        nickname: { type: 'string', example: '새로운닉네임' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/new-profile.jpg',\n                        },\n                        introduction: {\n                            type: 'string',\n                            example: '더욱 건강한 삶을 위해 노력하고 있습니다!',\n                        },\n                        age: { type: 'number', example: 29 },\n                        gender: { type: 'string', example: 'MALE' },\n                        isPushEnabled: { type: 'boolean', example: true },\n                        updatedAt: {\n                            type: 'string',\n                            format: 'date-time',\n                            example: '2025-06-22T12:30:00Z',\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('USER_002', '이미 사용 중인 닉네임입니다.', 400)), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('USER_003', '닉네임은 2-20자 사이여야 합니다.', 400, {\n        minLength: 2,\n        maxLength: 20,\n    })), (0, swagger_1.ApiResponse)((0, swagger_decorator_1.createErrorResponse)('USER_004', '연령은 14-100세 사이여야 합니다.', 400, {\n        minAge: 14,\n        maxAge: 100,\n    })), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.ValidationFailed), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiLogout() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '로그아웃',\n        description: '사용자를 로그아웃하고 리프레시 토큰을 무효화합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '로그아웃 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                success: {\n                    type: 'boolean',\n                    example: true,\n                    description: '성공 여부',\n                },\n                message: {\n                    type: 'string',\n                    example: '로그아웃이 완료되었습니다.',\n                    description: '응답 메시지',\n                },\n                timestamp: {\n                    type: 'string',\n                    format: 'date-time',\n                    example: '2025-06-22T12:00:00.000Z',\n                    description: '응답 시각',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiDeleteUser() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '회원 탈퇴',\n        description: '사용자 계정을 삭제합니다. 모든 데이터가 삭제됩니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '회원 탈퇴 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                message: {\n                    type: 'string',\n                    example: '회원 탈퇴가 완료되었습니다.',\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonAuthResponses.Unauthorized), (0, swagger_1.ApiResponse)(swagger_decorator_1.CommonErrorResponses.InternalServerError));\n}\nfunction ApiGetUserPosts() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '사용자 인증글 조회',\n        description: '특정 사용자가 작성한 인증글 목록을 조회합니다.',\n    }), (0, swagger_1.ApiParam)({\n        name: 'userUuid',\n        description: '사용자 UUID',\n        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n    }), (0, swagger_1.ApiQuery)({\n        name: 'page',\n        required: false,\n        description: '페이지 번호 (기본값: 1)',\n        example: 1,\n    }), (0, swagger_1.ApiQuery)({\n        name: 'limit',\n        required: false,\n        description: '페이지당 항목 수 (기본값: 10)',\n        example: 10,\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '사용자 인증글 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                user: {\n                    type: 'object',\n                    properties: {\n                        userUuid: {\n                            type: 'string',\n                            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                        },\n                        nickname: { type: 'string', example: '운동러버' },\n                        profileImage: {\n                            type: 'string',\n                            example: 'https://example.com/profile.jpg',\n                        },\n                        introduction: {\n                            type: 'string',\n                            example: '건강한 삶을 추구하는 운동 애호가입니다!',\n                        },\n                    },\n                },\n                posts: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            postUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            content: {\n                                type: 'string',\n                                example: '오늘 헬스장에서 2시간 운동했어요! 💪',\n                            },\n                            imageUrl: {\n                                type: 'array',\n                                items: { type: 'string' },\n                                example: [\n                                    'https://soapft-bucket.s3.amazonaws.com/images/workout1.jpg',\n                                ],\n                            },\n                            challenge: {\n                                type: 'object',\n                                properties: {\n                                    challengeUuid: {\n                                        type: 'string',\n                                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                                    },\n                                    title: { type: 'string', example: '30일 헬스 챌린지' },\n                                },\n                            },\n                            likeCount: { type: 'number', example: 15 },\n                            commentCount: { type: 'number', example: 3 },\n                            createdAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                        },\n                    },\n                },\n                pagination: {\n                    type: 'object',\n                    properties: {\n                        currentPage: { type: 'number', example: 1 },\n                        totalPages: { type: 'number', example: 5 },\n                        totalItems: { type: 'number', example: 50 },\n                        itemsPerPage: { type: 'number', example: 10 },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 404,\n        description: '사용자를 찾을 수 없음',\n    }));\n}\nfunction ApiGetUserChallenges() {\n    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({\n        summary: '사용자 참여 챌린지 조회',\n        description: '현재 로그인한 사용자가 참여 중인 챌린지 목록을 조회합니다.',\n    }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiQuery)({\n        name: 'status',\n        required: false,\n        description: '챌린지 상태 필터',\n        enum: ['recruiting', 'ongoing', 'finished'],\n        example: 'ongoing',\n    }), (0, swagger_1.ApiResponse)({\n        status: 200,\n        description: '사용자 참여 챌린지 조회 성공',\n        schema: {\n            type: 'object',\n            properties: {\n                challenges: {\n                    type: 'array',\n                    items: {\n                        type: 'object',\n                        properties: {\n                            challengeUuid: {\n                                type: 'string',\n                                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',\n                            },\n                            title: { type: 'string', example: '30일 헬스 챌린지' },\n                            type: { type: 'string', example: 'NORMAL' },\n                            profile: {\n                                type: 'string',\n                                example: 'https://example.com/profile.jpg',\n                            },\n                            startDate: {\n                                type: 'string',\n                                format: 'date',\n                                example: '2025-07-01',\n                            },\n                            endDate: {\n                                type: 'string',\n                                format: 'date',\n                                example: '2025-07-31',\n                            },\n                            goal: { type: 'number', example: 5 },\n                            currentMember: { type: 'number', example: 25 },\n                            maxMember: { type: 'number', example: 50 },\n                            coinAmount: { type: 'number', example: 1000 },\n                            isStarted: { type: 'boolean', example: true },\n                            isFinished: { type: 'boolean', example: false },\n                            joinedAt: {\n                                type: 'string',\n                                format: 'date-time',\n                                example: '2025-06-22T12:00:00Z',\n                            },\n                            myPostCount: { type: 'number', example: 15 },\n                            weeklyGoalAchieved: { type: 'number', example: 3 },\n                        },\n                    },\n                },\n            },\n        },\n    }), (0, swagger_1.ApiResponse)({\n        status: 401,\n        description: '인증되지 않은 사용자',\n    }));\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/users/decorators/users.swagger.ts?");

/***/ }),

/***/ "./src/modules/users/dto/update-profile.dto.ts":
/*!*****************************************************!*\
  !*** ./src/modules/users/dto/update-profile.dto.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UpdateProfileDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nclass UpdateProfileDto {\n}\nexports.UpdateProfileDto = UpdateProfileDto;\n__decorate([\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], UpdateProfileDto.prototype, \"newNickname\", void 0);\n__decorate([\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], UpdateProfileDto.prototype, \"newIntroduction\", void 0);\n__decorate([\n    (0, class_validator_1.IsOptional)(),\n    (0, class_validator_1.IsString)(),\n    __metadata(\"design:type\", String)\n], UpdateProfileDto.prototype, \"newProfileImg\", void 0);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/users/dto/update-profile.dto.ts?");

/***/ }),

/***/ "./src/modules/users/users.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/users/users.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UsersController = void 0;\nconst jwt_auth_guard_1 = __webpack_require__(/*! @/auth/guards/jwt-auth.guard */ \"./src/auth/guards/jwt-auth.guard.ts\");\nconst user_uuid_decorator_1 = __webpack_require__(/*! @/decorators/user-uuid.decorator */ \"./src/decorators/user-uuid.decorator.ts\");\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst users_service_1 = __webpack_require__(/*! ./users.service */ \"./src/modules/users/users.service.ts\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst users_swagger_1 = __webpack_require__(/*! ./decorators/users.swagger */ \"./src/modules/users/decorators/users.swagger.ts\");\nconst update_profile_dto_1 = __webpack_require__(/*! ./dto/update-profile.dto */ \"./src/modules/users/dto/update-profile.dto.ts\");\nlet UsersController = class UsersController {\n    constructor(usersService) {\n        this.usersService = usersService;\n    }\n    async logout(userUuid) {\n        return this.usersService.logout(userUuid);\n    }\n    async updateProfile(updateProfileDto, UserUuid) {\n        return this.usersService.updateProfile(UserUuid, updateProfileDto);\n    }\n    async deleteAccount(UserUuid) {\n        return this.usersService.deleteUser(UserUuid);\n    }\n    async getUserInfo(UserUuid) {\n        return this.usersService.getUserInfo(UserUuid);\n    }\n};\nexports.UsersController = UsersController;\n__decorate([\n    (0, common_1.Post)('logout'),\n    (0, users_swagger_1.ApiLogout)(),\n    __param(0, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"logout\", null);\n__decorate([\n    (0, common_1.Post)('profile'),\n    (0, users_swagger_1.ApiUpdateProfile)(),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __param(0, (0, common_1.Body)()),\n    __param(1, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [update_profile_dto_1.UpdateProfileDto, String]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"updateProfile\", null);\n__decorate([\n    (0, common_1.Delete)('member'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    (0, users_swagger_1.ApiDeleteUser)(),\n    __param(0, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"deleteAccount\", null);\n__decorate([\n    (0, common_1.Get)('userInfo'),\n    (0, users_swagger_1.ApiGetUserInfo)(),\n    __param(0, (0, user_uuid_decorator_1.UserUuid)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"getUserInfo\", null);\nexports.UsersController = UsersController = __decorate([\n    (0, swagger_1.ApiTags)('user'),\n    (0, swagger_1.ApiBearerAuth)('JWT-auth'),\n    (0, common_1.Controller)('user'),\n    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),\n    __metadata(\"design:paramtypes\", [users_service_1.UsersService])\n], UsersController);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/users/users.controller.ts?");

/***/ }),

/***/ "./src/modules/users/users.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UsersModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst users_controller_1 = __webpack_require__(/*! ./users.controller */ \"./src/modules/users/users.controller.ts\");\nconst users_service_1 = __webpack_require__(/*! ./users.service */ \"./src/modules/users/users.service.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst likes_module_1 = __webpack_require__(/*! ../likes/likes.module */ \"./src/modules/likes/likes.module.ts\");\nconst auth_entity_1 = __webpack_require__(/*! @/entities/auth.entity */ \"./src/entities/auth.entity.ts\");\nconst post_entity_1 = __webpack_require__(/*! @/entities/post.entity */ \"./src/entities/post.entity.ts\");\nconst posts_module_1 = __webpack_require__(/*! ../posts/posts.module */ \"./src/modules/posts/posts.module.ts\");\nconst auth_module_1 = __webpack_require__(/*! @/auth/auth.module */ \"./src/auth/auth.module.ts\");\nlet UsersModule = class UsersModule {\n};\nexports.UsersModule = UsersModule;\nexports.UsersModule = UsersModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, auth_entity_1.Auth, post_entity_1.Post]),\n            (0, common_1.forwardRef)(() => likes_module_1.LikesModule),\n            (0, common_1.forwardRef)(() => posts_module_1.PostsModule),\n            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),\n        ],\n        controllers: [users_controller_1.UsersController],\n        providers: [users_service_1.UsersService],\n        exports: [users_service_1.UsersService],\n    })\n], UsersModule);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/users/users.module.ts?");

/***/ }),

/***/ "./src/modules/users/users.service.ts":
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UsersService = void 0;\nconst auth_entity_1 = __webpack_require__(/*! @/entities/auth.entity */ \"./src/entities/auth.entity.ts\");\nconst user_entity_1 = __webpack_require__(/*! @/entities/user.entity */ \"./src/entities/user.entity.ts\");\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst typeorm_2 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst post_entity_1 = __webpack_require__(/*! @/entities/post.entity */ \"./src/entities/post.entity.ts\");\nconst user_status_enum_1 = __webpack_require__(/*! @/types/user-status.enum */ \"./src/types/user-status.enum.ts\");\nlet UsersService = class UsersService {\n    constructor(userRepository, authRepository, postRepository) {\n        this.userRepository = userRepository;\n        this.authRepository = authRepository;\n        this.postRepository = postRepository;\n    }\n    findOneBySocialId(socialId) {\n        return this.userRepository.findOneBy({ socialId });\n    }\n    createUser(user, uuid) {\n        const newUser = this.userRepository.create({\n            userUuid: uuid,\n            nickname: user.nickname,\n            socialNickname: user.socialNickname,\n            profileImage: user.profileImage,\n            socialProvider: user.socialProvider,\n            socialId: user.socialId,\n            status: user_status_enum_1.UserStatusType.ACTIVE,\n        });\n        return this.userRepository.save(newUser);\n    }\n    async getUserIdByUuid(userUuid) {\n        const user = await this.userRepository.findOne({\n            where: { userUuid },\n            select: ['id'],\n        });\n        if (!user) {\n            throw new common_1.NotFoundException(`UUID ${userUuid}에 해당하는 사용자를 찾을 수 없습니다.`);\n        }\n        return user.id;\n    }\n    async logout(userUuid) {\n        await this.authRepository.update({ userUuid }, {\n            refreshToken: null,\n        });\n        return {\n            message: '로그아웃 성공',\n        };\n    }\n    async updateProfile(userUuid, dto) {\n        const { newNickname, newIntroduction, newProfileImg } = dto;\n        const user = await this.userRepository.findOneBy({ userUuid });\n        if (!user)\n            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');\n        if (newNickname !== undefined) {\n            user.nickname = newNickname;\n        }\n        if (newIntroduction !== undefined) {\n            user.introduction = newIntroduction;\n        }\n        if (newProfileImg !== undefined) {\n            user.profileImage = newProfileImg;\n        }\n        await this.userRepository.save(user);\n        return { message: '프로필이 수정되었습니다.' };\n    }\n    async checkUserExists(userUuid) {\n        const user = await this.userRepository.findOne({ where: { userUuid } });\n        return !!user;\n    }\n    async getUserByIds(idArray) {\n        const users = await Promise.all(idArray.map(async (id) => {\n            const user = await this.userRepository.findOneBy({ userUuid: id });\n            return user;\n        }));\n        return users.filter((user) => user !== null);\n    }\n    async deleteUser(userUuid) {\n        const user = await this.userRepository.findOneBy({ userUuid });\n        if (!user) {\n            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');\n        }\n        user.status = user_status_enum_1.UserStatusType.DELETE;\n        user.nickname = null;\n        user.profileImage = null;\n        await this.userRepository.save(user);\n        return { message: '회원 탈퇴 성공!' };\n    }\n    async getUserInfo(userUuid) {\n        const user = await this.userRepository.findOne({\n            where: { userUuid },\n        });\n        if (!user) {\n            return {\n                userName: null,\n                userImage: null,\n                userIntroduction: null,\n                userUuid: userUuid,\n            };\n        }\n        return {\n            userName: user.nickname,\n            userImage: user.profileImage,\n            userIntroduction: user.introduction,\n            userUuid: user.userUuid,\n        };\n    }\n};\nexports.UsersService = UsersService;\nexports.UsersService = UsersService = __decorate([\n    (0, common_1.Injectable)(),\n    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),\n    __param(1, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),\n    __param(2, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),\n    __metadata(\"design:paramtypes\", [typeorm_2.Repository,\n        typeorm_2.Repository,\n        typeorm_2.Repository])\n], UsersService);\n\n\n//# sourceURL=webpack://soapft-backend/./src/modules/users/users.service.ts?");

/***/ }),

/***/ "./src/types/challenge.enum.ts":
/*!*************************************!*\
  !*** ./src/types/challenge.enum.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.GenderType = exports.ChallengeType = void 0;\nvar ChallengeType;\n(function (ChallengeType) {\n    ChallengeType[\"NORMAL\"] = \"NORMAL\";\n    ChallengeType[\"EVENT\"] = \"EVENT\";\n})(ChallengeType || (exports.ChallengeType = ChallengeType = {}));\nvar GenderType;\n(function (GenderType) {\n    GenderType[\"NONE\"] = \"NONE\";\n    GenderType[\"MALE\"] = \"MALE\";\n    GenderType[\"FEMALE\"] = \"FEMALE\";\n})(GenderType || (exports.GenderType = GenderType = {}));\n\n\n//# sourceURL=webpack://soapft-backend/./src/types/challenge.enum.ts?");

/***/ }),

/***/ "./src/types/error-code.enum.ts":
/*!**************************************!*\
  !*** ./src/types/error-code.enum.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ERROR_CODE_INFO = exports.ErrorCode = void 0;\nexports.getErrorInfo = getErrorInfo;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nvar ErrorCode;\n(function (ErrorCode) {\n    ErrorCode[\"INTERNAL_SERVER_ERROR\"] = \"SYS_001\";\n    ErrorCode[\"DATABASE_ERROR\"] = \"SYS_002\";\n    ErrorCode[\"EXTERNAL_API_ERROR\"] = \"SYS_003\";\n    ErrorCode[\"INVALID_INPUT_VALUE\"] = \"SYS_004\";\n    ErrorCode[\"METHOD_NOT_ALLOWED\"] = \"SYS_005\";\n    ErrorCode[\"RESOURCE_NOT_FOUND\"] = \"SYS_006\";\n    ErrorCode[\"TOO_MANY_REQUESTS\"] = \"SYS_007\";\n    ErrorCode[\"UNAUTHORIZED\"] = \"AUTH_001\";\n    ErrorCode[\"FORBIDDEN\"] = \"AUTH_002\";\n    ErrorCode[\"INVALID_TOKEN\"] = \"AUTH_003\";\n    ErrorCode[\"EXPIRED_TOKEN\"] = \"AUTH_004\";\n    ErrorCode[\"REFRESH_TOKEN_NOT_FOUND\"] = \"AUTH_005\";\n    ErrorCode[\"INVALID_REFRESH_TOKEN\"] = \"AUTH_006\";\n    ErrorCode[\"SOCIAL_LOGIN_FAILED\"] = \"AUTH_007\";\n    ErrorCode[\"USER_NOT_FOUND\"] = \"USER_001\";\n    ErrorCode[\"DUPLICATE_USER\"] = \"USER_002\";\n    ErrorCode[\"INVALID_USER_STATUS\"] = \"USER_003\";\n    ErrorCode[\"USER_ALREADY_DELETED\"] = \"USER_004\";\n    ErrorCode[\"INVALID_AGE_RANGE\"] = \"USER_005\";\n    ErrorCode[\"INVALID_GENDER\"] = \"USER_006\";\n    ErrorCode[\"EMAIL_ALREADY_EXISTS\"] = \"ACCOUNT_001\";\n    ErrorCode[\"PHONE_ALREADY_EXISTS\"] = \"ACCOUNT_002\";\n    ErrorCode[\"INVALID_PASSWORD\"] = \"ACCOUNT_003\";\n    ErrorCode[\"NICKNAME_ALREADY_EXISTS\"] = \"ACCOUNT_004\";\n    ErrorCode[\"INVALID_NICKNAME\"] = \"ACCOUNT_005\";\n    ErrorCode[\"SOCIAL_ID_ALREADY_EXISTS\"] = \"ACCOUNT_006\";\n    ErrorCode[\"CHALLENGE_NOT_FOUND\"] = \"CHALLENGE_001\";\n    ErrorCode[\"CHALLENGE_ALREADY_STARTED\"] = \"CHALLENGE_002\";\n    ErrorCode[\"CHALLENGE_ALREADY_FINISHED\"] = \"CHALLENGE_003\";\n    ErrorCode[\"CHALLENGE_FULL\"] = \"CHALLENGE_004\";\n    ErrorCode[\"CHALLENGE_ACCESS_DENIED\"] = \"CHALLENGE_005\";\n    ErrorCode[\"ALREADY_JOINED_CHALLENGE\"] = \"CHALLENGE_006\";\n    ErrorCode[\"NOT_JOINED_CHALLENGE\"] = \"CHALLENGE_007\";\n    ErrorCode[\"CHALLENGE_NOT_STARTED\"] = \"CHALLENGE_008\";\n    ErrorCode[\"INVALID_CHALLENGE_DATES\"] = \"CHALLENGE_009\";\n    ErrorCode[\"CHALLENGE_CREATOR_CANNOT_LEAVE\"] = \"CHALLENGE_010\";\n    ErrorCode[\"AGE_RESTRICTION_NOT_MET\"] = \"CHALLENGE_011\";\n    ErrorCode[\"GENDER_RESTRICTION_NOT_MET\"] = \"CHALLENGE_012\";\n    ErrorCode[\"POST_NOT_FOUND\"] = \"POST_001\";\n    ErrorCode[\"POST_ACCESS_DENIED\"] = \"POST_002\";\n    ErrorCode[\"POST_ALREADY_DELETED\"] = \"POST_003\";\n    ErrorCode[\"INVALID_POST_CONTENT\"] = \"POST_004\";\n    ErrorCode[\"POST_IMAGE_LIMIT_EXCEEDED\"] = \"POST_005\";\n    ErrorCode[\"CHALLENGE_POST_REQUIRED\"] = \"POST_006\";\n    ErrorCode[\"POST_EDIT_TIME_EXPIRED\"] = \"POST_007\";\n    ErrorCode[\"COMMENT_NOT_FOUND\"] = \"COMMENT_001\";\n    ErrorCode[\"COMMENT_ALREADY_DELETED\"] = \"COMMENT_002\";\n    ErrorCode[\"COMMENT_ACCESS_DENIED\"] = \"COMMENT_003\";\n    ErrorCode[\"COMMENT_TOO_LONG\"] = \"COMMENT_004\";\n    ErrorCode[\"COMMENT_EMPTY\"] = \"COMMENT_005\";\n    ErrorCode[\"PARENT_COMMENT_NOT_FOUND\"] = \"COMMENT_006\";\n    ErrorCode[\"INVALID_COMMENT_DEPTH\"] = \"COMMENT_007\";\n    ErrorCode[\"POST_NOT_FOUND_FOR_COMMENT\"] = \"COMMENT_008\";\n    ErrorCode[\"MENTIONED_USER_NOT_FOUND\"] = \"COMMENT_009\";\n    ErrorCode[\"COMMENT_EDIT_TIME_EXPIRED\"] = \"COMMENT_010\";\n    ErrorCode[\"LIKE_NOT_FOUND\"] = \"LIKE_001\";\n    ErrorCode[\"ALREADY_LIKED\"] = \"LIKE_002\";\n    ErrorCode[\"CANNOT_LIKE_OWN_POST\"] = \"LIKE_003\";\n    ErrorCode[\"NOT_LIKED_POST\"] = \"LIKE_004\";\n    ErrorCode[\"FRIENDSHIP_NOT_FOUND\"] = \"FRIENDSHIP_001\";\n    ErrorCode[\"ALREADY_FRIENDS\"] = \"FRIENDSHIP_002\";\n    ErrorCode[\"FRIEND_REQUEST_ALREADY_SENT\"] = \"FRIENDSHIP_003\";\n    ErrorCode[\"FRIEND_REQUEST_NOT_FOUND\"] = \"FRIENDSHIP_004\";\n    ErrorCode[\"CANNOT_FRIEND_SELF\"] = \"FRIENDSHIP_005\";\n    ErrorCode[\"FRIEND_REQUEST_ALREADY_PROCESSED\"] = \"FRIENDSHIP_006\";\n    ErrorCode[\"NOT_FRIEND_REQUEST_RECIPIENT\"] = \"FRIENDSHIP_007\";\n    ErrorCode[\"NOT_FRIEND_REQUEST_SENDER\"] = \"FRIENDSHIP_008\";\n    ErrorCode[\"USERS_NOT_FRIENDS\"] = \"FRIENDSHIP_009\";\n    ErrorCode[\"BLOCK_NOT_FOUND\"] = \"BLOCK_001\";\n    ErrorCode[\"ALREADY_BLOCKED\"] = \"BLOCK_002\";\n    ErrorCode[\"CANNOT_BLOCK_SELF\"] = \"BLOCK_003\";\n    ErrorCode[\"NOT_BLOCKED_USER\"] = \"BLOCK_004\";\n    ErrorCode[\"BLOCKED_BY_USER\"] = \"BLOCK_005\";\n    ErrorCode[\"CANNOT_INTERACT_WITH_BLOCKED_USER\"] = \"BLOCK_006\";\n    ErrorCode[\"CHAT_ROOM_NOT_FOUND\"] = \"CHAT_001\";\n    ErrorCode[\"CHAT_ROOM_ACCESS_DENIED\"] = \"CHAT_002\";\n    ErrorCode[\"MESSAGE_NOT_FOUND\"] = \"CHAT_003\";\n    ErrorCode[\"MESSAGE_ACCESS_DENIED\"] = \"CHAT_004\";\n    ErrorCode[\"CANNOT_LEAVE_DIRECT_CHAT\"] = \"CHAT_005\";\n    ErrorCode[\"CHAT_ROOM_FULL\"] = \"CHAT_006\";\n    ErrorCode[\"NOT_FRIENDS_CANNOT_CHAT\"] = \"CHAT_007\";\n    ErrorCode[\"MESSAGE_TOO_LONG\"] = \"CHAT_008\";\n    ErrorCode[\"INVALID_MESSAGE_TYPE\"] = \"CHAT_009\";\n    ErrorCode[\"MESSAGE_EDIT_TIME_EXPIRED\"] = \"CHAT_010\";\n    ErrorCode[\"FILE_UPLOAD_FAILED\"] = \"FILE_001\";\n    ErrorCode[\"FILE_NOT_FOUND\"] = \"FILE_002\";\n    ErrorCode[\"INVALID_FILE_TYPE\"] = \"FILE_003\";\n    ErrorCode[\"FILE_SIZE_EXCEEDED\"] = \"FILE_004\";\n    ErrorCode[\"INVALID_FILE_FORMAT\"] = \"FILE_005\";\n    ErrorCode[\"S3_UPLOAD_FAILED\"] = \"FILE_006\";\n    ErrorCode[\"IMAGE_PROCESSING_FAILED\"] = \"FILE_007\";\n    ErrorCode[\"NOTIFICATION_NOT_FOUND\"] = \"NOTIFICATION_001\";\n    ErrorCode[\"NOTIFICATION_ALREADY_READ\"] = \"NOTIFICATION_002\";\n    ErrorCode[\"PUSH_TOKEN_INVALID\"] = \"NOTIFICATION_003\";\n    ErrorCode[\"PUSH_SEND_FAILED\"] = \"NOTIFICATION_004\";\n    ErrorCode[\"REPORT_NOT_FOUND\"] = \"REPORT_001\";\n    ErrorCode[\"ALREADY_REPORTED\"] = \"REPORT_002\";\n    ErrorCode[\"CANNOT_REPORT_SELF\"] = \"REPORT_003\";\n    ErrorCode[\"INVALID_REPORT_TYPE\"] = \"REPORT_004\";\n    ErrorCode[\"INVALID_REPORT_REASON\"] = \"REPORT_005\";\n    ErrorCode[\"REPORT_TARGET_NOT_FOUND\"] = \"REPORT_006\";\n    ErrorCode[\"INSUFFICIENT_COINS\"] = \"COIN_001\";\n    ErrorCode[\"INVALID_COIN_AMOUNT\"] = \"COIN_002\";\n    ErrorCode[\"COIN_TRANSACTION_FAILED\"] = \"COIN_003\";\n})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));\nexports.ERROR_CODE_INFO = {\n    [ErrorCode.INTERNAL_SERVER_ERROR]: {\n        code: 'SYS_001',\n        message: '서버 오류가 발생했습니다.',\n        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,\n    },\n    [ErrorCode.DATABASE_ERROR]: {\n        code: 'SYS_002',\n        message: '데이터베이스 오류가 발생했습니다.',\n        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,\n    },\n    [ErrorCode.EXTERNAL_API_ERROR]: {\n        code: 'SYS_003',\n        message: '외부 API 호출 중 오류가 발생했습니다.',\n        httpStatus: common_1.HttpStatus.BAD_GATEWAY,\n    },\n    [ErrorCode.INVALID_INPUT_VALUE]: {\n        code: 'SYS_004',\n        message: '입력값이 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.METHOD_NOT_ALLOWED]: {\n        code: 'SYS_005',\n        message: '허용되지 않은 메서드입니다.',\n        httpStatus: common_1.HttpStatus.METHOD_NOT_ALLOWED,\n    },\n    [ErrorCode.RESOURCE_NOT_FOUND]: {\n        code: 'SYS_006',\n        message: '요청한 리소스를 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.TOO_MANY_REQUESTS]: {\n        code: 'SYS_007',\n        message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',\n        httpStatus: common_1.HttpStatus.TOO_MANY_REQUESTS,\n    },\n    [ErrorCode.UNAUTHORIZED]: {\n        code: 'AUTH_001',\n        message: '로그인이 필요합니다.',\n        httpStatus: common_1.HttpStatus.UNAUTHORIZED,\n    },\n    [ErrorCode.FORBIDDEN]: {\n        code: 'AUTH_002',\n        message: '접근 권한이 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.INVALID_TOKEN]: {\n        code: 'AUTH_003',\n        message: '유효하지 않은 토큰입니다.',\n        httpStatus: common_1.HttpStatus.UNAUTHORIZED,\n    },\n    [ErrorCode.EXPIRED_TOKEN]: {\n        code: 'AUTH_004',\n        message: '토큰이 만료되었습니다.',\n        httpStatus: common_1.HttpStatus.UNAUTHORIZED,\n    },\n    [ErrorCode.REFRESH_TOKEN_NOT_FOUND]: {\n        code: 'AUTH_005',\n        message: '리프레시 토큰을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.UNAUTHORIZED,\n    },\n    [ErrorCode.INVALID_REFRESH_TOKEN]: {\n        code: 'AUTH_006',\n        message: '유효하지 않은 리프레시 토큰입니다.',\n        httpStatus: common_1.HttpStatus.UNAUTHORIZED,\n    },\n    [ErrorCode.SOCIAL_LOGIN_FAILED]: {\n        code: 'AUTH_007',\n        message: '소셜 로그인에 실패했습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.USER_NOT_FOUND]: {\n        code: 'USER_001',\n        message: '존재하지 않는 사용자입니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.DUPLICATE_USER]: {\n        code: 'USER_002',\n        message: '이미 존재하는 사용자입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.INVALID_USER_STATUS]: {\n        code: 'USER_003',\n        message: '사용자 상태가 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.USER_ALREADY_DELETED]: {\n        code: 'USER_004',\n        message: '이미 탈퇴한 사용자입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_AGE_RANGE]: {\n        code: 'USER_005',\n        message: '연령 범위가 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_GENDER]: {\n        code: 'USER_006',\n        message: '성별 정보가 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.EMAIL_ALREADY_EXISTS]: {\n        code: 'ACCOUNT_001',\n        message: '이미 등록된 이메일입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.PHONE_ALREADY_EXISTS]: {\n        code: 'ACCOUNT_002',\n        message: '이미 등록된 휴대폰 번호입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.INVALID_PASSWORD]: {\n        code: 'ACCOUNT_003',\n        message: '비밀번호가 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.NICKNAME_ALREADY_EXISTS]: {\n        code: 'ACCOUNT_004',\n        message: '이미 사용 중인 닉네임입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.INVALID_NICKNAME]: {\n        code: 'ACCOUNT_005',\n        message: '닉네임 형식이 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.SOCIAL_ID_ALREADY_EXISTS]: {\n        code: 'ACCOUNT_006',\n        message: '이미 등록된 소셜 계정입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.CHALLENGE_NOT_FOUND]: {\n        code: 'CHALLENGE_001',\n        message: '존재하지 않는 챌린지입니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.CHALLENGE_ALREADY_STARTED]: {\n        code: 'CHALLENGE_002',\n        message: '이미 시작된 챌린지입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.CHALLENGE_ALREADY_FINISHED]: {\n        code: 'CHALLENGE_003',\n        message: '이미 종료된 챌린지입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.CHALLENGE_FULL]: {\n        code: 'CHALLENGE_004',\n        message: '챌린지 정원이 가득 찼습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.CHALLENGE_ACCESS_DENIED]: {\n        code: 'CHALLENGE_005',\n        message: '챌린지에 접근할 권한이 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.ALREADY_JOINED_CHALLENGE]: {\n        code: 'CHALLENGE_006',\n        message: '이미 참여한 챌린지입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.NOT_JOINED_CHALLENGE]: {\n        code: 'CHALLENGE_007',\n        message: '참여하지 않은 챌린지입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.CHALLENGE_NOT_STARTED]: {\n        code: 'CHALLENGE_008',\n        message: '아직 시작되지 않은 챌린지입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_CHALLENGE_DATES]: {\n        code: 'CHALLENGE_009',\n        message: '챌린지 날짜가 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.CHALLENGE_CREATOR_CANNOT_LEAVE]: {\n        code: 'CHALLENGE_010',\n        message: '챌린지 생성자는 나갈 수 없습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.AGE_RESTRICTION_NOT_MET]: {\n        code: 'CHALLENGE_011',\n        message: '연령 제한에 맞지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.GENDER_RESTRICTION_NOT_MET]: {\n        code: 'CHALLENGE_012',\n        message: '성별 제한에 맞지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.POST_NOT_FOUND]: {\n        code: 'POST_001',\n        message: '존재하지 않는 인증글입니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.POST_ACCESS_DENIED]: {\n        code: 'POST_002',\n        message: '인증글에 접근할 권한이 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.POST_ALREADY_DELETED]: {\n        code: 'POST_003',\n        message: '이미 삭제된 인증글입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_POST_CONTENT]: {\n        code: 'POST_004',\n        message: '인증글 내용이 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.POST_IMAGE_LIMIT_EXCEEDED]: {\n        code: 'POST_005',\n        message: '인증글 이미지 개수를 초과했습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.CHALLENGE_POST_REQUIRED]: {\n        code: 'POST_006',\n        message: '챌린지 인증글이 필요합니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.POST_EDIT_TIME_EXPIRED]: {\n        code: 'POST_007',\n        message: '인증글 수정 시간이 만료되었습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.COMMENT_NOT_FOUND]: {\n        code: 'COMMENT_001',\n        message: '존재하지 않는 댓글입니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.COMMENT_ALREADY_DELETED]: {\n        code: 'COMMENT_002',\n        message: '이미 삭제된 댓글입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.COMMENT_ACCESS_DENIED]: {\n        code: 'COMMENT_003',\n        message: '댓글에 접근할 권한이 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.COMMENT_TOO_LONG]: {\n        code: 'COMMENT_004',\n        message: '댓글이 너무 깁니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.COMMENT_EMPTY]: {\n        code: 'COMMENT_005',\n        message: '댓글 내용이 비어있습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.PARENT_COMMENT_NOT_FOUND]: {\n        code: 'COMMENT_006',\n        message: '부모 댓글을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.INVALID_COMMENT_DEPTH]: {\n        code: 'COMMENT_007',\n        message: '댓글 깊이가 유효하지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.POST_NOT_FOUND_FOR_COMMENT]: {\n        code: 'COMMENT_008',\n        message: '댓글을 작성할 인증글을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.MENTIONED_USER_NOT_FOUND]: {\n        code: 'COMMENT_009',\n        message: '멘션된 사용자를 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.COMMENT_EDIT_TIME_EXPIRED]: {\n        code: 'COMMENT_010',\n        message: '댓글 수정 시간이 만료되었습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.LIKE_NOT_FOUND]: {\n        code: 'LIKE_001',\n        message: '좋아요 정보를 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.ALREADY_LIKED]: {\n        code: 'LIKE_002',\n        message: '이미 좋아요를 누른 인증글입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.CANNOT_LIKE_OWN_POST]: {\n        code: 'LIKE_003',\n        message: '자신의 인증글에는 좋아요를 누를 수 없습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.NOT_LIKED_POST]: {\n        code: 'LIKE_004',\n        message: '좋아요를 누르지 않은 인증글입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.FRIENDSHIP_NOT_FOUND]: {\n        code: 'FRIENDSHIP_001',\n        message: '친구 관계를 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.ALREADY_FRIENDS]: {\n        code: 'FRIENDSHIP_002',\n        message: '이미 친구인 사용자입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.FRIEND_REQUEST_ALREADY_SENT]: {\n        code: 'FRIENDSHIP_003',\n        message: '이미 친구 요청을 보낸 사용자입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.FRIEND_REQUEST_NOT_FOUND]: {\n        code: 'FRIENDSHIP_004',\n        message: '친구 요청을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.CANNOT_FRIEND_SELF]: {\n        code: 'FRIENDSHIP_005',\n        message: '자기 자신에게 친구 요청을 보낼 수 없습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.FRIEND_REQUEST_ALREADY_PROCESSED]: {\n        code: 'FRIENDSHIP_006',\n        message: '이미 처리된 친구 요청입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.NOT_FRIEND_REQUEST_RECIPIENT]: {\n        code: 'FRIENDSHIP_007',\n        message: '친구 요청을 받은 사람이 아닙니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.NOT_FRIEND_REQUEST_SENDER]: {\n        code: 'FRIENDSHIP_008',\n        message: '친구 요청을 보낸 사람이 아닙니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.USERS_NOT_FRIENDS]: {\n        code: 'FRIENDSHIP_009',\n        message: '친구 관계가 아닌 사용자입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.BLOCK_NOT_FOUND]: {\n        code: 'BLOCK_001',\n        message: '차단 정보를 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.ALREADY_BLOCKED]: {\n        code: 'BLOCK_002',\n        message: '이미 차단된 사용자입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.CANNOT_BLOCK_SELF]: {\n        code: 'BLOCK_003',\n        message: '자기 자신을 차단할 수 없습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.NOT_BLOCKED_USER]: {\n        code: 'BLOCK_004',\n        message: '차단되지 않은 사용자입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.BLOCKED_BY_USER]: {\n        code: 'BLOCK_005',\n        message: '해당 사용자에게 차단되었습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.CANNOT_INTERACT_WITH_BLOCKED_USER]: {\n        code: 'BLOCK_006',\n        message: '차단된 사용자와는 상호작용할 수 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.CHAT_ROOM_NOT_FOUND]: {\n        code: 'CHAT_001',\n        message: '채팅방을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.CHAT_ROOM_ACCESS_DENIED]: {\n        code: 'CHAT_002',\n        message: '채팅방에 접근할 권한이 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.MESSAGE_NOT_FOUND]: {\n        code: 'CHAT_003',\n        message: '메시지를 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.MESSAGE_ACCESS_DENIED]: {\n        code: 'CHAT_004',\n        message: '메시지에 접근할 권한이 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.CANNOT_LEAVE_DIRECT_CHAT]: {\n        code: 'CHAT_005',\n        message: '1대1 채팅방은 나갈 수 없습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.CHAT_ROOM_FULL]: {\n        code: 'CHAT_006',\n        message: '채팅방 정원이 가득 찼습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.NOT_FRIENDS_CANNOT_CHAT]: {\n        code: 'CHAT_007',\n        message: '친구가 아닌 사용자와는 채팅할 수 없습니다.',\n        httpStatus: common_1.HttpStatus.FORBIDDEN,\n    },\n    [ErrorCode.MESSAGE_TOO_LONG]: {\n        code: 'CHAT_008',\n        message: '메시지가 너무 깁니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_MESSAGE_TYPE]: {\n        code: 'CHAT_009',\n        message: '유효하지 않은 메시지 타입입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.MESSAGE_EDIT_TIME_EXPIRED]: {\n        code: 'CHAT_010',\n        message: '메시지 수정 시간이 만료되었습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.FILE_UPLOAD_FAILED]: {\n        code: 'FILE_001',\n        message: '파일 업로드에 실패했습니다.',\n        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,\n    },\n    [ErrorCode.FILE_NOT_FOUND]: {\n        code: 'FILE_002',\n        message: '파일을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.INVALID_FILE_TYPE]: {\n        code: 'FILE_003',\n        message: '지원하지 않는 파일 형식입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.FILE_SIZE_EXCEEDED]: {\n        code: 'FILE_004',\n        message: '파일 크기가 제한을 초과했습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_FILE_FORMAT]: {\n        code: 'FILE_005',\n        message: '파일 형식이 올바르지 않습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.S3_UPLOAD_FAILED]: {\n        code: 'FILE_006',\n        message: 'S3 업로드에 실패했습니다.',\n        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,\n    },\n    [ErrorCode.IMAGE_PROCESSING_FAILED]: {\n        code: 'FILE_007',\n        message: '이미지 처리에 실패했습니다.',\n        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,\n    },\n    [ErrorCode.NOTIFICATION_NOT_FOUND]: {\n        code: 'NOTIFICATION_001',\n        message: '알림을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.NOTIFICATION_ALREADY_READ]: {\n        code: 'NOTIFICATION_002',\n        message: '이미 읽은 알림입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.PUSH_TOKEN_INVALID]: {\n        code: 'NOTIFICATION_003',\n        message: '유효하지 않은 푸시 토큰입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.PUSH_SEND_FAILED]: {\n        code: 'NOTIFICATION_004',\n        message: '푸시 알림 전송에 실패했습니다.',\n        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,\n    },\n    [ErrorCode.REPORT_NOT_FOUND]: {\n        code: 'REPORT_001',\n        message: '신고 정보를 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.ALREADY_REPORTED]: {\n        code: 'REPORT_002',\n        message: '이미 신고된 콘텐츠입니다.',\n        httpStatus: common_1.HttpStatus.CONFLICT,\n    },\n    [ErrorCode.CANNOT_REPORT_SELF]: {\n        code: 'REPORT_003',\n        message: '자신의 콘텐츠는 신고할 수 없습니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_REPORT_TYPE]: {\n        code: 'REPORT_004',\n        message: '유효하지 않은 신고 타입입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_REPORT_REASON]: {\n        code: 'REPORT_005',\n        message: '유효하지 않은 신고 사유입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.REPORT_TARGET_NOT_FOUND]: {\n        code: 'REPORT_006',\n        message: '신고 대상을 찾을 수 없습니다.',\n        httpStatus: common_1.HttpStatus.NOT_FOUND,\n    },\n    [ErrorCode.INSUFFICIENT_COINS]: {\n        code: 'COIN_001',\n        message: '코인이 부족합니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.INVALID_COIN_AMOUNT]: {\n        code: 'COIN_002',\n        message: '유효하지 않은 코인 금액입니다.',\n        httpStatus: common_1.HttpStatus.BAD_REQUEST,\n    },\n    [ErrorCode.COIN_TRANSACTION_FAILED]: {\n        code: 'COIN_003',\n        message: '코인 지불에 실패했습니다.',\n        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,\n    },\n};\nfunction getErrorInfo(errorCode) {\n    return exports.ERROR_CODE_INFO[errorCode];\n}\n\n\n//# sourceURL=webpack://soapft-backend/./src/types/error-code.enum.ts?");

/***/ }),

/***/ "./src/types/social-provider.enum.ts":
/*!*******************************************!*\
  !*** ./src/types/social-provider.enum.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SocialProvider = void 0;\nvar SocialProvider;\n(function (SocialProvider) {\n    SocialProvider[\"KAKAO\"] = \"KAKAO\";\n    SocialProvider[\"NAVER\"] = \"NAVER\";\n    SocialProvider[\"APPLE\"] = \"APPLE\";\n})(SocialProvider || (exports.SocialProvider = SocialProvider = {}));\n\n\n//# sourceURL=webpack://soapft-backend/./src/types/social-provider.enum.ts?");

/***/ }),

/***/ "./src/types/user-status.enum.ts":
/*!***************************************!*\
  !*** ./src/types/user-status.enum.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UserStatusType = void 0;\nvar UserStatusType;\n(function (UserStatusType) {\n    UserStatusType[\"ACTIVE\"] = \"ACTIVE\";\n    UserStatusType[\"DELETE\"] = \"DELETE\";\n})(UserStatusType || (exports.UserStatusType = UserStatusType = {}));\n\n\n//# sourceURL=webpack://soapft-backend/./src/types/user-status.enum.ts?");

/***/ }),

/***/ "./src/utils/custom-exception.ts":
/*!***************************************!*\
  !*** ./src/utils/custom-exception.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.BusinessException = exports.CustomException = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst error_code_enum_1 = __webpack_require__(/*! ../types/error-code.enum */ \"./src/types/error-code.enum.ts\");\nclass CustomException extends common_1.HttpException {\n    constructor(errorCode, customMessage, details) {\n        const errorInfo = (0, error_code_enum_1.getErrorInfo)(errorCode);\n        const message = customMessage || errorInfo.message;\n        super({\n            errorCode: errorInfo.code,\n            message,\n            timestamp: new Date().toISOString(),\n            details,\n        }, errorInfo.httpStatus);\n        this.errorCode = errorInfo.code;\n        this.timestamp = new Date().toISOString();\n    }\n    static throw(errorCode, customMessage, details) {\n        throw new CustomException(errorCode, customMessage, details);\n    }\n}\nexports.CustomException = CustomException;\nclass BusinessException {\n    static userNotFound(userUuid) {\n        CustomException.throw(error_code_enum_1.ErrorCode.USER_NOT_FOUND, undefined, { userUuid });\n    }\n    static insufficientCoins(required, current) {\n        CustomException.throw(error_code_enum_1.ErrorCode.INSUFFICIENT_COINS, `필요한 코인: ${required}, 보유 코인: ${current}`, { required, current });\n    }\n    static challengeNotFound(challengeUuid) {\n        CustomException.throw(error_code_enum_1.ErrorCode.CHALLENGE_NOT_FOUND, undefined, {\n            challengeUuid,\n        });\n    }\n    static challengeAlreadyStarted() {\n        CustomException.throw(error_code_enum_1.ErrorCode.CHALLENGE_ALREADY_STARTED);\n    }\n    static challengeFull(maxMember) {\n        CustomException.throw(error_code_enum_1.ErrorCode.CHALLENGE_FULL, `최대 참여 인원(${maxMember}명)을 초과했습니다.`, { maxMember });\n    }\n    static ageRestrictionNotMet(userAge, minAge, maxAge) {\n        CustomException.throw(error_code_enum_1.ErrorCode.AGE_RESTRICTION_NOT_MET, `참여 가능 연령: ${minAge}세 ~ ${maxAge}세 (현재: ${userAge}세)`, { userAge, minAge, maxAge });\n    }\n    static genderRestrictionNotMet(requiredGender, userGender) {\n        CustomException.throw(error_code_enum_1.ErrorCode.GENDER_RESTRICTION_NOT_MET, `${requiredGender} 전용 챌린지입니다.`, { requiredGender, userGender });\n    }\n    static postNotFound(postUuid) {\n        CustomException.throw(error_code_enum_1.ErrorCode.POST_NOT_FOUND, undefined, { postUuid });\n    }\n    static postImageLimitExceeded(limit, provided) {\n        CustomException.throw(error_code_enum_1.ErrorCode.POST_IMAGE_LIMIT_EXCEEDED, `이미지는 최대 ${limit}개까지 업로드 가능합니다. (현재: ${provided}개)`, { limit, provided });\n    }\n    static commentNotFound(commentId) {\n        CustomException.throw(error_code_enum_1.ErrorCode.COMMENT_NOT_FOUND, undefined, {\n            commentId,\n        });\n    }\n    static commentTooLong(maxLength, currentLength) {\n        CustomException.throw(error_code_enum_1.ErrorCode.COMMENT_TOO_LONG, `댓글은 최대 ${maxLength}자까지 작성 가능합니다. (현재: ${currentLength}자)`, { maxLength, currentLength });\n    }\n    static mentionedUserNotFound(userUuids) {\n        CustomException.throw(error_code_enum_1.ErrorCode.MENTIONED_USER_NOT_FOUND, `멘션된 사용자를 찾을 수 없습니다: ${userUuids.join(', ')}`, { userUuids });\n    }\n    static friendshipNotFound(friendshipId) {\n        CustomException.throw(error_code_enum_1.ErrorCode.FRIENDSHIP_NOT_FOUND, undefined, {\n            friendshipId,\n        });\n    }\n    static alreadyFriends(userUuid) {\n        CustomException.throw(error_code_enum_1.ErrorCode.ALREADY_FRIENDS, undefined, { userUuid });\n    }\n    static cannotFriendSelf() {\n        CustomException.throw(error_code_enum_1.ErrorCode.CANNOT_FRIEND_SELF);\n    }\n    static notFriendsCannotChat() {\n        CustomException.throw(error_code_enum_1.ErrorCode.NOT_FRIENDS_CANNOT_CHAT);\n    }\n    static chatRoomNotFound(roomUuid) {\n        CustomException.throw(error_code_enum_1.ErrorCode.CHAT_ROOM_NOT_FOUND, undefined, {\n            roomUuid,\n        });\n    }\n    static messageNotFound(messageId) {\n        CustomException.throw(error_code_enum_1.ErrorCode.MESSAGE_NOT_FOUND, undefined, {\n            messageId,\n        });\n    }\n    static cannotLeaveDirectChat() {\n        CustomException.throw(error_code_enum_1.ErrorCode.CANNOT_LEAVE_DIRECT_CHAT);\n    }\n    static messageTooLong(maxLength, currentLength) {\n        CustomException.throw(error_code_enum_1.ErrorCode.MESSAGE_TOO_LONG, `메시지는 최대 ${maxLength}자까지 작성 가능합니다. (현재: ${currentLength}자)`, { maxLength, currentLength });\n    }\n    static alreadyLiked() {\n        CustomException.throw(error_code_enum_1.ErrorCode.ALREADY_LIKED);\n    }\n    static cannotLikeOwnPost() {\n        CustomException.throw(error_code_enum_1.ErrorCode.CANNOT_LIKE_OWN_POST);\n    }\n    static notLikedPost() {\n        CustomException.throw(error_code_enum_1.ErrorCode.NOT_LIKED_POST);\n    }\n    static alreadyBlocked(userUuid) {\n        CustomException.throw(error_code_enum_1.ErrorCode.ALREADY_BLOCKED, undefined, { userUuid });\n    }\n    static cannotBlockSelf() {\n        CustomException.throw(error_code_enum_1.ErrorCode.CANNOT_BLOCK_SELF);\n    }\n    static blockedByUser(userUuid) {\n        CustomException.throw(error_code_enum_1.ErrorCode.BLOCKED_BY_USER, undefined, { userUuid });\n    }\n    static fileUploadFailed(fileName, reason) {\n        CustomException.throw(error_code_enum_1.ErrorCode.FILE_UPLOAD_FAILED, reason ? `파일 업로드 실패: ${reason}` : undefined, { fileName, reason });\n    }\n    static invalidFileType(allowedTypes, providedType) {\n        CustomException.throw(error_code_enum_1.ErrorCode.INVALID_FILE_TYPE, `허용된 파일 형식: ${allowedTypes.join(', ')} (제공된 형식: ${providedType})`, { allowedTypes, providedType });\n    }\n    static fileSizeExceeded(maxSize, currentSize) {\n        CustomException.throw(error_code_enum_1.ErrorCode.FILE_SIZE_EXCEEDED, `파일 크기 제한: ${maxSize}MB (현재: ${Math.round(currentSize / 1024 / 1024)}MB)`, { maxSize, currentSize });\n    }\n    static unauthorized() {\n        CustomException.throw(error_code_enum_1.ErrorCode.UNAUTHORIZED);\n    }\n    static forbidden() {\n        CustomException.throw(error_code_enum_1.ErrorCode.FORBIDDEN);\n    }\n    static invalidToken() {\n        CustomException.throw(error_code_enum_1.ErrorCode.INVALID_TOKEN);\n    }\n    static expiredToken() {\n        CustomException.throw(error_code_enum_1.ErrorCode.EXPIRED_TOKEN);\n    }\n}\nexports.BusinessException = BusinessException;\n\n\n//# sourceURL=webpack://soapft-backend/./src/utils/custom-exception.ts?");

/***/ }),

/***/ "./src/utils/global-exception.filter.ts":
/*!**********************************************!*\
  !*** ./src/utils/global-exception.filter.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar GlobalExceptionFilter_1;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.GlobalExceptionFilter = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst custom_exception_1 = __webpack_require__(/*! ./custom-exception */ \"./src/utils/custom-exception.ts\");\nconst error_code_enum_1 = __webpack_require__(/*! ../types/error-code.enum */ \"./src/types/error-code.enum.ts\");\nlet GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {\n    constructor() {\n        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);\n    }\n    catch(exception, host) {\n        const ctx = host.switchToHttp();\n        const response = ctx.getResponse();\n        const request = ctx.getRequest();\n        let status;\n        let errorCode;\n        let message;\n        let details;\n        if (exception instanceof custom_exception_1.CustomException) {\n            status = exception.getStatus();\n            const exceptionResponse = exception.getResponse();\n            errorCode = exceptionResponse.errorCode;\n            message = exceptionResponse.message;\n            details = exceptionResponse.details;\n        }\n        else if (exception instanceof common_1.HttpException) {\n            status = exception.getStatus();\n            const exceptionResponse = exception.getResponse();\n            if (typeof exceptionResponse === 'string') {\n                errorCode = this.getErrorCodeByStatus(status);\n                message = exceptionResponse;\n            }\n            else {\n                errorCode = this.getErrorCodeByStatus(status);\n                message = exceptionResponse.message || exception.message;\n                details = exceptionResponse;\n            }\n        }\n        else {\n            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;\n            errorCode = error_code_enum_1.ErrorCode.INTERNAL_SERVER_ERROR;\n            message = '서버 오류가 발생했습니다.';\n            details =  true ? exception : 0;\n        }\n        this.logError(exception, request, status, errorCode, message);\n        const errorResponse = {\n            success: false,\n            errorCode,\n            message,\n            timestamp: new Date().toISOString(),\n            path: request.url,\n            method: request.method,\n            ...(details && { details }),\n        };\n        response.status(status).json(errorResponse);\n    }\n    getErrorCodeByStatus(status) {\n        switch (status) {\n            case common_1.HttpStatus.BAD_REQUEST:\n                return error_code_enum_1.ErrorCode.INVALID_INPUT_VALUE;\n            case common_1.HttpStatus.UNAUTHORIZED:\n                return error_code_enum_1.ErrorCode.UNAUTHORIZED;\n            case common_1.HttpStatus.FORBIDDEN:\n                return error_code_enum_1.ErrorCode.FORBIDDEN;\n            case common_1.HttpStatus.NOT_FOUND:\n                return error_code_enum_1.ErrorCode.RESOURCE_NOT_FOUND;\n            case common_1.HttpStatus.METHOD_NOT_ALLOWED:\n                return error_code_enum_1.ErrorCode.METHOD_NOT_ALLOWED;\n            case common_1.HttpStatus.TOO_MANY_REQUESTS:\n                return error_code_enum_1.ErrorCode.TOO_MANY_REQUESTS;\n            case common_1.HttpStatus.INTERNAL_SERVER_ERROR:\n            default:\n                return error_code_enum_1.ErrorCode.INTERNAL_SERVER_ERROR;\n        }\n    }\n    logError(exception, request, status, errorCode, message) {\n        const logMessage = {\n            errorCode,\n            message,\n            status,\n            method: request.method,\n            url: request.url,\n            userAgent: request.get('User-Agent'),\n            ip: request.ip,\n            timestamp: new Date().toISOString(),\n        };\n        if (status >= 500) {\n            this.logger.error(`Server Error: ${JSON.stringify(logMessage)}`, exception instanceof Error ? exception.stack : undefined);\n        }\n        else if (status >= 400) {\n            this.logger.warn(`Client Error: ${JSON.stringify(logMessage)}`);\n        }\n        else {\n            this.logger.log(`Request: ${JSON.stringify(logMessage)}`);\n        }\n    }\n};\nexports.GlobalExceptionFilter = GlobalExceptionFilter;\nexports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([\n    (0, common_1.Catch)()\n], GlobalExceptionFilter);\n\n\n//# sourceURL=webpack://soapft-backend/./src/utils/global-exception.filter.ts?");

/***/ }),

/***/ "./src/utils/logger.service.ts":
/*!*************************************!*\
  !*** ./src/utils/logger.service.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LoggerService = void 0;\nconst winston_1 = __webpack_require__(/*! winston */ \"winston\");\nconst logging_config_1 = __webpack_require__(/*! ../../config/logging.config */ \"./config/logging.config.ts\");\nclass LoggerService {\n    constructor() {\n        this.logger = (0, winston_1.createLogger)(logging_config_1.winstonConfig);\n    }\n    static getInstance() {\n        if (!LoggerService.instance) {\n            LoggerService.instance = new LoggerService();\n        }\n        return LoggerService.instance;\n    }\n}\nexports.LoggerService = LoggerService;\n\n\n//# sourceURL=webpack://soapft-backend/./src/utils/logger.service.ts?");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/typeorm":
/*!**********************************!*\
  !*** external "@nestjs/typeorm" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcryptjs");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "nanoid":
/*!*************************!*\
  !*** external "nanoid" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("nanoid");

/***/ }),

/***/ "nest-winston":
/*!*******************************!*\
  !*** external "nest-winston" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("nest-winston");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),

/***/ "typeorm":
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("winston");

/***/ }),

/***/ "winston-daily-rotate-file":
/*!********************************************!*\
  !*** external "winston-daily-rotate-file" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("winston-daily-rotate-file");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("2b8ed1819a862eb501ca")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				// inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								}
/******/ 								return setStatus("ready").then(function () {
/******/ 									return updatedModules;
/******/ 								});
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result = newModuleFactory
/******/ 						? getAffectedModuleEffects(moduleId)
/******/ 						: {
/******/ 								type: "disposed",
/******/ 								moduleId: moduleId
/******/ 							};
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err1) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err1,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err1);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./node_modules/webpack/hot/poll.js?100");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;