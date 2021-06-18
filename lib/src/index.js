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
const node_fetch_1 = __importDefault(require("node-fetch"));
const db_connect_1 = require("./db-connect");
const handlers_1 = require("./handlers");
const config_1 = require("./config");
const app_config_json_1 = __importDefault(require("../app.config.json"));
exports.default = (app, { getRouter }) => __awaiter(void 0, void 0, void 0, function* () {
    const appConfig = new config_1.AppConfig(app_config_json_1.default);
    db_connect_1.initDatabase(appConfig, app.log);
    const { dbStatus } = yield db_connect_1.dbConnect(appConfig, app.log);
    app.log.info('app started');
    const router = getRouter(appConfig.appRoute);
    // The App listens to the following events of the repositories within the organization
    app.on(['push'], handlers_1.runOrgAction(appConfig));
    app.on('workflow_run.completed', handlers_1.handleCompletedRun(appConfig));
    app.on('check_run.rerequested', handlers_1.handleReRun(appConfig));
    if (process.env.STATS_URI) {
        getRouter().get('/probot/stats', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield node_fetch_1.default(process.env.STATS_URI);
                const stats = yield response.json();
                res.status(200).json(stats);
            }
            catch (e) {
                res.status(404);
            }
        }));
    }
    // runWorkflow will call the organization GitHub Action listening to the trigger the GET request
    router.get('/register', (req, res) => handlers_1.handleRegister(appConfig)(req, res, { app }));
    router.get('/health', (_, res) => {
        const { connection, dbState } = dbStatus();
        const status = connection === 'up' && dbState === 'connected' ? 200 : 503;
        res.status(status).json(Object.assign(Object.assign({}, dbStatus()), { sha: process.env.SHA_REF || 'unknown' }));
    });
});
//# sourceMappingURL=index.js.map