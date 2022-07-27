import ormConfig from '@app/ormConfig';

const ormSeedConfig = {
  ...ormConfig,
  migrations: [__dirname + '/seeds/**/*{.ts, .js}'],
  cli: {
    migrationsDir: 'src/seeds',
  },
};

export default ormSeedConfig;
