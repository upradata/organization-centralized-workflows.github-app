import { Probot } from 'probot';
import { Request, Response } from 'express';
<<<<<<< HEAD
import { ActionInputs } from '../models';
import { AppConfig } from '../config';
export declare type RegisterRequest = Request<Record<string, string>, any, any, ActionInputs>;
export declare const handleRegister: (appConfig: AppConfig) => (req: RegisterRequest, res: Response, { app }: {
=======
import { AppConfig } from '../config';
export declare const handleRegister: (appConfig: AppConfig) => (req: Request, res: Response, { app }: {
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
    app: Probot;
}) => Promise<any>;
