export interface ActionInputs {
    id: string;
    runId: string;
    name: string;
    sha: string;
    enforce: 'true' | 'false';
    enforceAdmin: 'true' | 'false';
    documentation: string;
}
