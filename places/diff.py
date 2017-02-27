import json

with open('portals1.json', 'r') as f:
    data = json.load(f)

pokestops = 0
gyms = 0
for element in data['data']:
    if element['type'] == 'pokestop':
        pokestops += 1
    elif element['type'] == 'gym':
        gyms += 1
print(pokestops)
print(gyms)
