from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import os


app = Flask(__name__)
CORS(app)

def validate_output(output):
    if "<>User:" in output["choices"][0]["text"]:
        output["choices"][0]["text"]=output["choices"][0]["text"].split("<>User:")[0]
        output["choices"][0]["finish_reason"] = "stop"
    return output

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the file relative to the script's directory
model_path = os.path.join(script_dir, 'models', 'llama-2-7b-chat.Q5_K_M.gguf')
context_path = os.path.join(script_dir, 'context.txt')

# Initialize the Llama model
LLM = Llama(model_path=model_path, n_ctx=2048)

with open(context_path, 'r') as file:
    context = file.read()

@app.route('/generate', methods=['POST'])
def generate():
    # Get the prompt from the JSON body of the request
    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error' : 'No prompt provided'}), 400
    
    # Generate the response
    try:
        output = validate_output(LLM(context + prompt, max_tokens=4))
        return jsonify({'response': output})
    except Exception as e:
        print(e)
        return jsonify({'error' : str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)