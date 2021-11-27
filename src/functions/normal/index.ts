import {Context} from 'aws-lambda/handler';
import {APIGatewayProxyEvent, APIGatewayProxyResultV2} from 'aws-lambda/trigger/api-gateway-proxy';
import {Logger} from '../../common/logger';
import middleware from '../../middlewares/index';
import wait from '../../common/wait';

const timeoutMs: number = (Number(process.env.TIMEOUT_SECONDS || 30) + 1) * 1000;

async function subHandler(event: APIGatewayProxyEvent & {logger: Logger}, context?: Context): Promise<APIGatewayProxyResultV2> {
  const {requestContext, logger} = event;
  
  try {
    logger.info('execution started...');
    await wait(timeoutMs, () => logger.info('Delayed Message!'));

    logger.info('...execution ending.');
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: requestContext.requestId
      })
    };
  } catch(error) {
    logger.error('unable to execute', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        id: requestContext.requestId,
        error: 'unable to execute'
      })
    };
  }
};

const handler = middleware(subHandler) // .use();
export {handler, subHandler};
