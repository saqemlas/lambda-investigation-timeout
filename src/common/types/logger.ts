export interface Options {
    [key: string]: any
  };
  
export interface LogStandard {
    message: string,
    channel: string,
    level_name: string,
    context: Options,
    correlation_id: string | null,
    tags: string[]
};
