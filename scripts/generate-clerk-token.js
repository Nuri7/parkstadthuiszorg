const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw new Error("CLERK_SECRET_KEY not found in env");

    const res = await fetch('https://api.clerk.com/v1/testing_tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to create testing token: ${await res.text()}`);
    }

    const data = await res.json();
    const token = data.token;
    
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('CLERK_TESTING_TOKEN=')) {
      envContent = envContent.replace(/CLERK_TESTING_TOKEN=.*/, `CLERK_TESTING_TOKEN="${token}"`);
    } else {
      envContent += `\nCLERK_TESTING_TOKEN="${token}"\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('Testing token successfully generated and added to .env!');
  } catch (err) {
    console.error('Error generating token:', err);
    process.exit(1);
  }
}

main();
