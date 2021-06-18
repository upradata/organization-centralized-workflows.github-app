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
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceProtection = void 0;
function enforceProtection(options) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const { octokit, repository, contextName, enforce, enforceAdmin = false, logger } = options;
        const repo = yield octokit.repos.get(Object.assign(Object.assign({}, repository), { mediaType: {
                previews: ['symmetra']
            } }));
        const protection = yield octokit.repos.getBranchProtection(Object.assign(Object.assign({}, repository), { branch: repo.data.default_branch })).catch(e => {
            logger.error('Error while requestion the branch protection');
            logger.error(e);
            return undefined;
        });
        if (!protection)
            return false;
        const { required_status_checks, enforce_admins, required_pull_request_reviews, required_linear_history, allow_force_pushes, allow_deletions } = protection.data || {};
        const { contexts } = required_status_checks !== null && required_status_checks !== void 0 ? required_status_checks : {};
        const enforceAdminsCurrentSetting = (_a = enforce_admins === null || enforce_admins === void 0 ? void 0 : enforce_admins.enabled) !== null && _a !== void 0 ? _a : false;
        const adminForceChange = enforceAdminsCurrentSetting !== enforceAdmin;
        const contextIndex = (contexts === null || contexts === void 0 ? void 0 : contexts.indexOf(contextName)) || -1;
        // noop actions
        if (!adminForceChange) { // Admin enforce didn't change
            if (contextIndex !== -1 && enforce)
                return false; // Context is already enforced
            if (contextIndex === -1 && !enforce)
                return false; // Context isn't enforced and shouldn't be.
        }
        if (contextIndex !== -1 && !enforce) {
            contexts.splice(contextIndex, 1);
        }
        else if (contextIndex === -1 && enforce) {
            contexts.push(contextName);
        }
        yield octokit.repos.updateBranchProtection(Object.assign(Object.assign({}, repository), { branch: repo.data.default_branch, required_status_checks: {
                strict: (_b = (required_status_checks === null || required_status_checks === void 0 ? void 0 : required_status_checks.enforcement_level) === 'strict') !== null && _b !== void 0 ? _b : false,
                contexts: contexts || []
            }, enforce_admins: adminForceChange ? !enforceAdminsCurrentSetting : enforceAdminsCurrentSetting, required_pull_request_reviews: required_pull_request_reviews ? {
                dismiss_stale_reviews: (_c = required_pull_request_reviews === null || required_pull_request_reviews === void 0 ? void 0 : required_pull_request_reviews.dismiss_stale_reviews) !== null && _c !== void 0 ? _c : false,
                require_code_owner_reviews: (_d = required_pull_request_reviews === null || required_pull_request_reviews === void 0 ? void 0 : required_pull_request_reviews.require_code_owner_reviews) !== null && _d !== void 0 ? _d : 0
            } : null, required_linear_history: required_linear_history === null || required_linear_history === void 0 ? void 0 : required_linear_history.enabled, allow_force_pushes: allow_force_pushes === null || allow_force_pushes === void 0 ? void 0 : allow_force_pushes.enabled, allow_deletions: allow_deletions === null || allow_deletions === void 0 ? void 0 : allow_deletions.enabled, restrictions: null }));
        return true;
    });
}
exports.enforceProtection = enforceProtection;
//# sourceMappingURL=enforce-protection.js.map