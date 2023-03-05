"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const todo_1 = require("./entities/todo");
const path_1 = __importDefault(require("path"));
const config = {
    migrations: {
        glob: '!(*.d).{js,ts}',
        path: path_1.default.join(__dirname, './migrations'),
    },
    entities: [todo_1.Todo],
    dbName: 'tasks',
    user: 'rohith',
    type: 'postgresql',
    password: 'm@rg3simpson69',
    debug: !constants_1.__prod__,
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map