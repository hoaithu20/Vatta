import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Answer, Dictionary, Point, Post, User, History, QuestionHistory, Question, Story, Profile, Topic, Week } from 'src/entities';
require('dotenv').config();

const logger = new Logger('MikroORM');
const config: Options = {
  entities: [Post, User, Answer, Dictionary, History, Point, QuestionHistory, Question, Story, Topic, Profile, Week],
  type: 'mysql',
  port: 3306,
  dbName: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  highlighter: new SqlHighlighter(),
  debug: true,
  //autoLoadEntities: true,
  logger: logger.log.bind(logger),
};

export default config;