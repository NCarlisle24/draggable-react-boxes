import type { BoxCreatorMinProps } from './BoxCreator.tsx';

type BoxCreatorMenuProps = {
    isVisible: boolean,
    makeInvisible: () => any,
    createBoxCreator: (creatorProps: BoxCreatorMinProps) => any
};

export default function BoxCreatorMenu(props: BoxCreatorMenuProps) {
    const overlayStyle: React.CSSProperties = {
        visibility: props.isVisible ? "visible" : "hidden",
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const form: HTMLFormElement = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const newBoxCreator: BoxCreatorMinProps = {
            width: parseInt(formData.get("width") as string),
            height: parseInt(formData.get("height") as string),
            color: formData.get("color") as string
        };

        props.createBoxCreator(newBoxCreator);
        props.makeInvisible();
    }

    /*
    Authentication is done via amplify
    - Amplify condenses AWS microservices.

    - Cognito is user authentication
    - Lambda handles serverless
    - DynamoDB
    - Amplify lists active pull requests and has github integration
    - The "amplify" folder handles the backend
    - "backend.ts" configues creates a stack (i.e. where is the backend lives), dyno DB table for forecasting, a table for models,
      data bucket is where the results of simulations show up
        - IAM user policies as well (s3 bucket)
        - Lambda makes up the meat of it
    - handler.ts handles most lambda
    - Using express for the API
    - auth/resource.ts handles email login (via AWS amplify)
    - AWS Sandbox is an individual backend for development purposes
        - Run 'just sandbox-once'
        - Shouldn't have to export the AWS key
    
    Epidermis is seperate from AWS Amplify, responsible for running simulations.
    - Automatically interfaces with the site and uploads data to the s3 bucket
    - Has four projects
    1. Terraform creates the AWS services
    2. Runner runs the simulations
    3. Lambda handles submitting batch jobs
    4. Everything else in docker

    AWS SDK is used.
    - Lets you access AWS services from code
    
    Whenever a simulation job is run via the site, it is submitted to the dynamo db table
    - Lambda service listens to the dynamo DB table and runs jobs whenever a new service is uploaded
    - The "shared" folder in the s3 bucket is configured so that other users can view the simulation
    - "Publishing" a simulation uploads it to the dashboard

    S3 stores objects/files like in a hierarchical system, while DynamoDB is a typical DB.
    - Use S3 to store simulation/forecast output
    - Use Dynamo to store metadata about stuff stored in S3
        - Every simulation has a corresponding entry in dynamo DB, storing things such as time created, link to AWS files, job events, etc.
    
    All simulations must be given an API key to access simulation metadata.
    - Job array size is in beta, but allows you to run multiple simulations at the same time

    Users are stored in AWS Cognito.
    - Amplify hosts the web server (probably via EC2)

    AWS Batch has predefined jobs and is structured differently from AWS lambda.
    
    AWS CloudFormation is used by Amplify to comile all services into one thing.
    - Search for sandbox in here

    model.ts handles the interface between frontend and backend.
    - zod handles datatype verification
    - Using axios to call express functions
    - Express is only used to handle backend integration, not file serving

    */

    return (
        <div className="fixed w-full h-full top-0 left-0 right-0 bottom-0 backdrop-blur-sm z-10000 flex items-center justify-center" style={overlayStyle}>
            <div className="w-100 h-100 bg-gray-300">
                <button onClick={props.makeInvisible} className="cursor-pointer">Close</button>
                <form onSubmit={handleSubmit}>
                    <label>
                        Width: 
                        <input type="number" name="width"></input>
                    </label>
                    <br />
                    <label>
                        Height: 
                        <input type="number" name="height"></input>
                    </label>
                    <br />
                    <label>
                        Color: 
                        <input type="color" name="color"></input>
                    </label>
                    <br />
                    <button type="submit" className="cursor-pointer">Submit</button>
                </form>
            </div>
        </div>
    )
}