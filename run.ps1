# Activate the LambdaGPT conda environment
& conda activate LambdaGPT

# Start the Flask API in a new PowerShell window
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command & { conda activate LambdaGPT; python .\api\api.py }"

# Change directory to the front folder
cd .\front

# Run the React app
npm start

# Return to the initial directory if necessary
cd ..
