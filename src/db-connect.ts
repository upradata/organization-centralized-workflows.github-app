import { Context } from 'probot';
import mongoose from 'mongoose';
import { AppConfig } from './config';
import { MongoRun, mongoWorkflowsRepositoryKey } from './models';



// Update existing document with config.workflows_repository field
export const initDatabase = (_appConfig: AppConfig, logger: Context[ 'log' ]) => MongoRun.updateMany(
    { [ `config.${mongoWorkflowsRepositoryKey}` ]: { $exists: false } },
    { $set: { config: { workflows_repository: '.github' } } },
    { new: true, multi: true },
    (err, numberAffected) => {
        if (err)
            return logger.error(err);

        if (numberAffected?.ok) {
            logger.debbug('updated', numberAffected.nModified, 'rows');
        }
    }
);




interface Status {
    connection: string;
    dbState: string;
}


let connection: string = 'down';


export const dbConnect = async (appConfig: AppConfig, logger: Context[ 'log' ]): Promise<{ dbStatus: () => Status; }> => {
    try {

        await mongoose.connect(appConfig.mongoUri, {
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            dbName: process.env.DB_NAME,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        connection = 'up';
      console.log(logger)
        logger.debug('DB connection established');
    } catch (e) {
        connection = 'down';
        throw e;
    }

    return { dbStatus };
};

export const dbStatus = (): Status => ({
    connection,
    dbState: mongoose.STATES[ mongoose.connection.readyState ]
});
