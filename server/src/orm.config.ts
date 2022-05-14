import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function ormConfig(): TypeOrmModuleOptions {
    const commonConf = {
        SYNCRONIZE: false,
        ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        CLI: {
            migrationsDir: 'src/migrations',
        },
        MIGRATIONS_RUN: true,
    };

    let ormconfig: TypeOrmModuleOptions = {
        name: 'default',
        type: 'sqlite',
        database: '../target/db/sqlite-dev-db.sql',
        logging: true,
        synchronize: true,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        cli: commonConf.CLI,
        migrationsRun: commonConf.MIGRATIONS_RUN,
    };

    if (process.env.BACKEND_ENV === 'prod') {
        ormconfig = {
            name: 'default',
            type: 'mysql',
            database: 'myexpenses',
            host: process.env.DATABASE_PORT,
            port: 3306,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            logging: true,
            synchronize: commonConf.SYNCRONIZE,
            entities: commonConf.ENTITIES,
            migrations: commonConf.MIGRATIONS,
            cli: commonConf.CLI,
            migrationsRun: commonConf.MIGRATIONS_RUN,
        };
    }

    if (process.env.BACKEND_ENV === 'test') {
        ormconfig = {
            name: 'default',
            type: 'sqlite',
            database: ':memory:',
            keepConnectionAlive: true,
            logging: true,
            synchronize: true,
            entities: commonConf.ENTITIES,
            migrations: commonConf.MIGRATIONS,
            cli: commonConf.CLI,
            migrationsRun: commonConf.MIGRATIONS_RUN,
        };
    }
    return ormconfig;
}

export { ormConfig };
