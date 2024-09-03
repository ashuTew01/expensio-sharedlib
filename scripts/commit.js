// scripts/commit.js
import { execSync } from "child_process";

const args = process.argv.slice(2);
const versionType = args[0] || "patch";
const commitMessage = args[1] || `Bump version to ${versionType}`;

try {
	execSync("git add .", { stdio: "inherit" });

	execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });
	execSync(`git push`, { stdio: "inherit" });

	execSync(`npm version ${versionType}`, { stdio: "inherit" });

	execSync("npm publish", { stdio: "inherit" });

	console.log(`Successfully published a ${versionType} version.`);
} catch (error) {
	console.error("Error during version bump and publish process:", error);
	process.exit(1);
}

// Usage
// Patch Version Update:
// npm run pub:patch "Your commit message for patch"

// Minor Version Update:
// npm run pub:minor "Your commit message for minor update"

// Major Version Update:
// npm run pub:major "Your commit message for major update"
