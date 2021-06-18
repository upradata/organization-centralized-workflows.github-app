"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRun = void 0;
const shouldRun = (repositoryName, exclude) => {
    const excludeMatch = exclude.some((repository) => {
        return new RegExp('^' + repository.replace(/\*/g, '.*') + '$').test(repositoryName);
    });
    return !excludeMatch;
};
exports.shouldRun = shouldRun;
//# sourceMappingURL=should-run.js.map