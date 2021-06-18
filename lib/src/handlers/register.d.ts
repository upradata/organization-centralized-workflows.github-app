import { Probot } from 'probot';
import { Request, Response } from 'express';
import { ActionInputs } from '../models';
import { AppConfig } from '../config';
export declare type RegisterRequest = Request<Record<string, string>, any, any, ActionInputs>;
export declare const handleRegister: (appConfig: AppConfig) => (req: RegisterRequest, res: Response, { app }: {
    app: Probot;
}) => Promise<any>;
