import json

class UnknownLevelError(Exception):
    """
        Raise when the level is unknown
    """
    pass

def jsonify(response):
    json_str = response.replace('jQuery22006645514662215135_1486001171505(', '').replace(')', '')
    data = json.loads(json_str)['list']
    print('# of elements: {}'.format(len(data)))
    levels = {
        '1': 'pokestop',
        '100': 'gym',
        '300': '7-eleven',
        '301': 'lotteria',
        '302': 'angel-in-us'
    }
    for element in data:
        element['id'] = '{},{}'.format(element['lat'], element['lng'])
        level = element['level']
        if level in levels:
            element['type'] = levels[level]
        else:
            raise UnknownLevelError('Unknown level: {}, Known levels: {}'.format(element['level'], levels))
        del element['level']
    return data
