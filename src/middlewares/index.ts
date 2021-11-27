import middy from '@middy/core';
import LoggerHandler from './logger';
import {Handler} from 'aws-lambda/handler';

const middleware = (f: Handler) => {
  return middy(f)
    .use(LoggerHandler())
};

export default middleware;
