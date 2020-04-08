# Azure Functions

Refer to [Serverless docs](https://serverless.com/framework/docs/providers/azure/guide/intro/) for more information.

## Available Scripts

In the project directory, you can run:

### `sls offline`

Runs the app in the development mode.<br />
Open [http://localhost:7071](http://localhost:7071) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `sls deploy`

Deploys the app to azure.

# Issues
I am experiencing large latency for cold start to my serverless functions. This issue is explained in this article https://azure.microsoft.com/en-us/blog/understanding-serverless-cold-start/ . A solution to this problem is to keep the serverless function continuously warm by pinging the function every 5 minutes. This solution is explained in this doc https://itnext.io/how-to-tackle-the-cold-start-problem-of-azure-function-serverless-app-e90030cdb0c7
