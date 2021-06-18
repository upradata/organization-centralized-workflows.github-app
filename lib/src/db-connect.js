"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbStatus = exports.dbConnect = exports.initDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("./models");
// Update existing document with config.workflowsRepository field
const initDatabase = (_appConfig, logger) => models_1.MongoRun.updateMany({ [`config.${models_1.mongoWorkflowsRepositoryKey}`]: { $exists: false } }, { $set: { config: { workflowsRepository: '.github' } } }, { new: true, multi: true }, (err, numberAffected) => {
    if (err)
        return logger.error(err);
    if (numberAffected === null || numberAffected === void 0 ? void 0 : numberAffected.ok) {
        logger.debug('updated', numberAffected.nModified, 'rows');
    }
});
exports.initDatabase = initDatabase;
let connection = 'down';
const dbConnect = (appConfig, logger) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(appConfig.mongoUri, {
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            dbName: process.env.DB_NAME,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        connection = 'up';
        logger.debug('DB connection established');
    }
    catch (e) {
        connection = 'down';
        throw e;
    }
    return { dbStatus: exports.dbStatus };
});
exports.dbConnect = dbConnect;
const dbStatus = () => ({
    connection,
    dbState: mongoose_1.default.STATES[mongoose_1.default.connection.readyState]
});
exports.dbStatus = dbStatus;
//# sourceMappingURL=db-connect.js.map