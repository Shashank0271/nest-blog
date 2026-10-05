import { registerAs } from '@nestjs/config';

const parseBoolean = (value: string | undefined): boolean =>
  value?.toLowerCase() === 'true';

export default registerAs('database', () => ({
  url: process.env.DB_URL,
  synchronize: parseBoolean(process.env.DB_SYNC),
  autoLoadEntities: parseBoolean(process.env.DB_AUTOLOAD),
}));
