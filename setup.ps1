# Download the model
Invoke-WebRequest -Uri "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q5_K_M.gguf" -OutFile "./api/models/llama-2-7b-chat.Q5_K_M.gguf"


# Create a new Conda environment named LambdaGPT with Python 3.11
conda create --name LambdaGPT python=3.11 -y

# Activate the new environment
conda activate LambdaGPT

# Install the required modules from requirements.txt in the api folder
pip install -r .\api\requirements.txt

# Navigate to the front folder
cd .\front

# Run npm install to install dependencies for the React app
npm install

# Navigate back to the root folder or any other desired directory after the setup
cd ..
