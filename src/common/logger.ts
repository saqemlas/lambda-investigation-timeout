import {pino} from 'pino';
import {Options, LogStandard} from './types/logger';

export class Logger {
    static readonly INFO = 'INFO'
    static readonly ERROR = 'ERROR'
    static readonly WARNING = 'WARN'
    static readonly DEBUG = 'DEBUG'
  
    public logger: any
    public meta: Options = {}
    public correlationId: string | null = null
    // CloudWatch Log Group
    public channel: string = ''
  
    constructor (args: any = {}) {
      this.logger = pino(args)
    }
  
    init (event: Options = {}, context: Options = {}, correlationId: string | null = null): void {
      this.channel = context.logGroupName ?? ''
      this.correlationId = correlationId
      this.meta = { event, ...context }
    }
  
    setCorrelationId (correlationId: string | null): void {
      this.correlationId = correlationId
    }
  
    getCorrelationId(): string | null {
      return this.correlationId
    }
  
    info (msg: string, meta?: Options, tags?: string[]): void {
      this.logger.info(this.toLogStandard(Logger.INFO, msg, meta, tags))
    }
  
    warn (msg: string, meta?: Options, tags?: string[]): void {
      this.logger.warn(this.toLogStandard(Logger.WARNING, msg, meta, tags))
    }
  
    error (msg: string, meta?: Options, tags?: string[]): void {
      this.logger.error(this.toLogStandard(Logger.ERROR, msg, meta, tags))
    }
  
    debug (msg: string, meta?: Options, tags?: string[]): void {
      this.logger.debug(this.toLogStandard(Logger.DEBUG, msg, meta, tags))
    }
  
    toLogStandard (level: string, msg: string, meta: Options = {}, tags: string[] = []): LogStandard {
      return {
        message: msg,
        channel: this.channel,
        level_name: level,
        context: {
            ...this.meta, 
            ...meta
          },
        correlation_id: this.correlationId,
        tags: tags
      }
    }
};
