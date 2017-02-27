import json
import jsonify

with open('response.txt', 'r') as f:
    f.readline()
    response = f.readline()

data = jsonify.jsonify(response)
data = {
    'data': data
}

with open('data.json', 'w') as f:
    json.dump(data, f, indent='    ')
