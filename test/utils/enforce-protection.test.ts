import enforceProtection from '../../src/utils/enforce-protection';

describe('enforce protection util', () => {
    let octokit: any;
    let repository: any;
    let contextName: string;
    let owner: string;
    let repo: string;
    let enforce: boolean;
    let enforceAdmins: boolean;
    let defaultBranch: string;
    let currentSettings: any;
    let result: any;

    beforeEach(async () => {
        contextName = 'a_check';
        owner = 'octocat';
        repo = 'mona';
        repository = { owner, repo };
        enforce = false;
        enforceAdmins = false;
        defaultBranch = 'main_foo';

        currentSettings = {
            data: {
                enforce_admins: {
                    enabled: true
                },
                required_status_checks: {
                    contexts: []
                },
                required_linear_history: {
                    enabled: false
                },
                allow_force_pushes: {
                    enabled: false
                },
                allow_deletions: {
                    enabled: false
                },
            }
        };

        octokit = {
            repos: {
                get: jest.fn().mockImplementation(async () => ({ data: { default_branch: defaultBranch } })),
                getBranchProtection: jest.fn().mockImplementation(async () => (currentSettings)),
                updateBranchProtection: jest.fn()
            }
        };

        // run_function = async () => await enforceProtection(octokit, repository, context_name, enforce, enforce_admins)
    });

    describe('...', () => {
        test('should call octokit.repos.get', async () => {
            await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
            expect(octokit.repos.get).toBeCalledWith({ mediaType: { previews: [ "symmetra" ] }, owner, repo });
        });

        test('should call octokit.repos.getBranchProtection with the right values', async () => {
            await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
            expect(octokit.repos.getBranchProtection).toBeCalledWith({ branch: defaultBranch, owner, repo });
        });

        describe('enforce admin is set to true while this is already enforced for admins', () => {
            beforeEach(() => {
                currentSettings.data.enforce_admins.enabled = true;
                enforceAdmins = true;
            });

            describe('context that is required is already required', () => {
                beforeEach(async () => {
                    enforce = true;
                    currentSettings.data.required_status_checks.contexts = [ contextName ];
                    result = await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
                });

                test('should not call octokit.repos.updateBranchProtection', () => {
                    expect(octokit.repos.updateBranchProtection).not.toBeCalled();
                });

                test('should return false', () => {
                    expect(result).toBe(false);
                });
            });

            describe('context that isn\'t required given is already not required', () => {
                beforeEach(async () => {
                    enforce = false;
                    currentSettings.data.required_status_checks.contexts = [];
                    result = await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
                });

                test('should not call octokit.repos.updateBranchProtection', () => {
                    expect(octokit.repos.updateBranchProtection).not.toBeCalled();
                });

                test('should return false', () => {
                    expect(result).toBe(false);
                });
            });
        });

        describe('enforce admin is set to true while its current setting is false', () => {
            beforeEach(() => {
                currentSettings.data.enforce_admins.enabled = false;
                enforceAdmins = true;
            });

            describe('new setting requires context that isn\'t required yet', () => {
                beforeEach(async () => {
                    enforce = true;
                    currentSettings.data.required_status_checks.contexts = [];
                    result = await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
                });

                test('should call octokit.repos.updateBranchProtection with the right values', () => {
                    expect(octokit.repos.updateBranchProtection).toHaveBeenCalledWith(
                        expect.objectContaining({ enforce_admins: true, required_status_checks: { contexts: [ contextName ] } })
                    );
                });

                test('should return true', () => {
                    expect(result).toBe(true);
                });
            });

            describe('new setting unrequires context', () => {
                beforeEach(async () => {
                    enforce = false;
                    currentSettings.data.required_status_checks.contexts = [ contextName ];
                    result = await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
                });

                test('should call octokit.repos.updateBranchProtection with the right values', () => {
                    expect(octokit.repos.updateBranchProtection).toHaveBeenCalledWith(
                        expect.objectContaining({ enforce_admins: true, required_status_checks: { contexts: [] } })
                    );
                });

                test('should return true', () => {
                    expect(result).toBe(true);
                });
            });
        });

        describe('enforce admin is set to false while its current setting is true', () => {
            beforeEach(() => {
                currentSettings.data.enforce_admins.enabled = true;
                enforceAdmins = false;
            });

            describe('new setting requires context that isn\'t required yet', () => {
                beforeEach(async () => {
                    enforce = true;
                    currentSettings.data.required_status_checks.contexts = [];
                    result = await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
                });

                test('should call octokit.repos.updateBranchProtection with the right values', () => {
                    expect(octokit.repos.updateBranchProtection).toHaveBeenCalledWith(
                        expect.objectContaining({ enforce_admins: false, required_status_checks: { contexts: [ contextName ] } })
                    );
                });

                test('should return true', () => {
                    expect(result).toBe(true);
                });
            });

            describe('new setting unrequires context', () => {
                beforeEach(async () => {
                    enforce = false;
                    currentSettings.data.required_status_checks.contexts = [ contextName ];
                    result = await enforceProtection(octokit, repository, contextName, enforce, enforceAdmins);
                });

                test('should call octokit.repos.updateBranchProtection with the right values', () => {
                    expect(octokit.repos.updateBranchProtection).toHaveBeenCalledWith(
                        expect.objectContaining({ enforce_admins: false, required_status_checks: { contexts: [] } })
                    );
                });

                test('should return true', () => {
                    expect(result).toBe(true);
                });
            });
        });
    });
});
