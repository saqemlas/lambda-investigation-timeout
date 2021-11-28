# Lambda Timeout Monitoring Investigation

## Info 

### Approach 1 - Logic in Middleware (Lambda Function)

When Lambda runs a function, it passes a context object to the handler. This object provides methods and properties that provide information about the invocation, function, and execution environment. One of the context methods is getRemainingTimeInMillis() which returns the number of milliseconds left before the execution times out. Using the method, we can schedule a callback to be actioned before the function times out and and perform whatever task needed ie preemptively log the timeout event. The possibility of false positive could happen for the 50 ms reserved, but that probably outweighs not having any error logs when the function does time out.

<p align="center">
  <img src="/media/catch-timeout-diagram1.png" />
  <img src="/media/catch-timeout-diagram2.png" />
</p>

> Cost: Milliseconds of execution time & single cloudwatch log event. See information on pricing - https://aws.amazon.com/lambda/pricing/


### Approached 2 - Function Duration (Cloudwatch Alarm)

A large indicator of timeouts is by looking at a function’s Max Duration metric.

> Cost: Pay for cloudwatch alarm (metric already exists). See information on pricing - https://aws.amazon.com/cloudwatch/pricing/


### Approached 3 - Filtering Logs (Cloudwatch Log Metrics & Alarm)

Guaranteed receiving a 'Task timed out after...' log for when a function times out, therefore creating a cloudwatch log metric for the filter pattern and cloudwatch alarm to be trigger on a certain count.

> Cost: Pay for both cloudwatch alarm and custom metric. See information on pricing - https://aws.amazon.com/cloudwatch/pricing/


### For more information
- [AWS Documentation: Lambda context object in Node.js](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html)
- [AWS Documentation: Cloudwatch Alarms](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cw-alarm.html#cfn-cloudwatch-alarms-period)
- [AWS Documentation: Creating metrics from log events using filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html)


## Usage 

### Credentials:
```bash
export AWS_PROFILE=<profile_name>
```

### Install Dependencies:

```bash
yarn run install
```

### Deploy:

```bash
yarn run deploy
```

### Test:
*Check serverless output for api endpoints to test.*

#### test log timeouts
```bash
curl -X GET https://<API_ID>.<REGION>.execute-api.amazonaws.com/dev/log
```

```bash
serverless logs -f log 
```

#### test alarm duration timeouts
```bash
curl -X GET https://<API_ID>.<REGION>.execute-api.amazonaws.com/dev/durationAlarm
```

#### test log metric filter timeouts
```bash
curl -X GET https://<API_ID>.<REGION>.execute-api.amazonaws.com/dev/metricFilter
```

### Remove:

```bash
yarn run remove
```
