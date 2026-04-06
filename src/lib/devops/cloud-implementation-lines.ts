import type { PopularStackLanguage } from "@/lib/highlight/web-stack-language";

export const CLOUD_PROVIDERS = ["azure", "aws", "gcp"] as const;
export type CloudProvider = (typeof CLOUD_PROVIDERS)[number];

function languageBuildLines(language: PopularStackLanguage): string[] {
  switch (language) {
    case "javascript":
    case "jsx":
      return ["npm ci", "npm run lint", "npm run build"];
    case "typescript":
    case "tsx":
      return ["npm ci", "npm run check", "npm run build"];
    case "python":
      return [
        "python -m venv .venv",
        "source .venv/bin/activate",
        "pip install -r requirements.txt",
        "pytest -q",
      ];
    case "go":
      return ["go mod tidy", "go test ./...", "go build ./..."];
    case "java":
      return ["./mvnw test package", "# ou: ./gradlew test build"];
    case "ruby":
      return ["bundle install", "bundle exec rspec"];
    case "rails":
      return ["bundle install", "bin/rails db:migrate", "bundle exec rspec"];
    case "sql":
      return ['psql "$DATABASE_URL" -f migrations/001_init.sql'];
    case "nosql":
      return [
        'mongosh "$MONGODB_URI" --file scripts/init.mongodb.js',
        'mongosh "$MONGODB_URI" --file scripts/indexes.mongodb.js',
      ];
    case "shell":
      return ["chmod +x scripts/*.sh", "shellcheck scripts/*.sh"];
    case "react-native":
      return [
        "npm ci",
        "npm run lint",
        "npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle",
        "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle",
      ];
    case "flutter":
      return [
        "flutter pub get",
        "flutter analyze",
        "flutter test",
        "flutter build apk --release",
      ];
    case "swift":
      return [
        "swift package resolve",
        "swift test",
        "xcodebuild -scheme App -configuration Release -destination 'generic/platform=iOS' build",
      ];
    case "html":
    case "css":
    case "json":
      return ["npm ci", "npm run build"];
    default:
      return ["npm ci", "npm run build"];
  }
}

function cloudDeployLines(cloud: CloudProvider, appName: string): string[] {
  if (cloud === "azure") {
    return [
      "az login",
      "az group create --name $AZURE_RG --location $AZURE_LOCATION",
      "az acr create --resource-group $AZURE_RG --name $AZURE_ACR --sku Basic",
      "az acr build --registry $AZURE_ACR --image " +
        `${appName}:latest` +
        " .",
      "az containerapp up --name " +
        `${appName}` +
        " --resource-group $AZURE_RG --location $AZURE_LOCATION --environment $AZURE_CONTAINERAPPS_ENV --image $AZURE_ACR.azurecr.io/" +
        `${appName}:latest`,
    ];
  }

  if (cloud === "aws") {
    return [
      "aws configure",
      `aws ecr create-repository --repository-name ${appName}`,
      "aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com",
      `docker build -t ${appName}:latest .`,
      "docker tag " +
        `${appName}:latest` +
        " $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/" +
        `${appName}:latest`,
      "docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/" +
        `${appName}:latest`,
      "aws apprunner create-service --service-name " +
        `${appName}` +
        " --source-configuration ImageRepository={ImageIdentifier=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/" +
        `${appName}:latest,ImageRepositoryType=ECR}`,
    ];
  }

  return [
    "gcloud auth login",
    "gcloud config set project $GCP_PROJECT_ID",
    `gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/${appName}:latest`,
    "gcloud run deploy " +
      `${appName}` +
      " --image gcr.io/$GCP_PROJECT_ID/" +
      `${appName}:latest` +
      " --platform managed --region $GCP_REGION --allow-unauthenticated",
  ];
}

function mobileCloudLines(cloud: CloudProvider): string[] {
  if (cloud === "azure") {
    return [
      "# mobile artifact pipeline (Azure DevOps)",
      "az login",
      "az pipelines run --name mobile-build-pipeline --branch main",
      "az artifacts universal publish --organization $AZURE_DEVOPS_ORG --project $AZURE_DEVOPS_PROJECT --feed mobile --name app-bundle --version 1.0.$BUILD_ID --path ./dist",
    ];
  }

  if (cloud === "aws") {
    return [
      "# mobile artifact pipeline (AWS)",
      "aws codebuild start-build --project-name mobile-build",
      "aws s3 cp ./build s3://$AWS_MOBILE_ARTIFACT_BUCKET/builds/ --recursive",
      "aws devicefarm schedule-run --project-arn $AWS_DEVICE_FARM_PROJECT_ARN --app-arn $AWS_DEVICE_FARM_APP_ARN --device-pool-arn $AWS_DEVICE_POOL_ARN --name mobile-smoke-tests",
    ];
  }

  return [
    "# mobile artifact pipeline (GCP)",
    "gcloud auth login",
    "gcloud builds submit --config cloudbuild.mobile.yaml .",
    "gsutil -m cp -r ./build gs://$GCP_MOBILE_ARTIFACT_BUCKET/builds/",
    "firebase appdistribution:distribute ./build/app/outputs/flutter-apk/app-release.apk --app $FIREBASE_APP_ID --groups qa",
  ];
}

export interface CloudImplementationInput {
  language: PopularStackLanguage;
  cloud: CloudProvider;
  appName?: string;
}

export function generateCloudImplementationLines({
  language,
  cloud,
  appName = "my-app",
}: CloudImplementationInput): string[] {
  const isMobileLanguage =
    language === "react-native" ||
    language === "flutter" ||
    language === "swift";

  return [
    `# stack detectada: ${language}`,
    "# build + quality",
    ...languageBuildLines(language),
    "",
    "# deploy cloud",
    ...(isMobileLanguage
      ? mobileCloudLines(cloud)
      : cloudDeployLines(cloud, appName)),
  ];
}
