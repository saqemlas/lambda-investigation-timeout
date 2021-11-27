import middy from '@middy/core';

const RESERVED_TIME_MS = 50

const timeoutHandler = () => {  
  return {
    before: async (request: middy.Request) => {

      // schedule a callback to be executed 50ms before the function times out 
      const timer = setTimeout(() => {
        request.event.logger.error('Invocation Timed Out', {
          awsRequestId: request.context.awsRequestId, 
          ...request.event
        });
      }, request.context.getRemainingTimeInMillis() - RESERVED_TIME_MS);

      Object.defineProperty(request.context, 'lambdaLogTimeoutMiddleware', {
        enumerable: false,
        value: {timer}
      });

    },
    after: (request: middy.Request & {context: {lambdaLogTimeoutMiddleware?:{timer?:ReturnType<typeof setTimeout>}}} ) => {
      // clear timeout between invocations
      if (request.context.lambdaLogTimeoutMiddleware.timer) {
        clearTimeout(request.context.lambdaLogTimeoutMiddleware.timer);
      }
    },
    onError: (request: middy.Request & {context: {lambdaLogTimeoutMiddleware?:{timer?:ReturnType<typeof setTimeout>}}}) => {
      // clear timeout between invocations
      if (request.context.lambdaLogTimeoutMiddleware.timer) {
        clearTimeout(request.context.lambdaLogTimeoutMiddleware.timer);
      }
    }
  };
};

export default timeoutHandler;
