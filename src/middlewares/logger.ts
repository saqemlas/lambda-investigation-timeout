import {Logger} from '../common/logger';

const LoggerHandler = () => {
  const LambdaLogger = new Logger();

  return ({
    before: async (request) => {
      LambdaLogger.init(request.event, {}, request.context.awsRequestId);
      request.event.logger = new Logger();
    },
  });
};

export default LoggerHandler;
