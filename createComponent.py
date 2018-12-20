import os
import sys

moduleName = sys.argv[1]

modulesRootPath = './src/components/{}'
modulePath = modulesRootPath.format(moduleName)

structure = {
    'rootPath': modulesRootPath.format(moduleName),
    'children': [
        {
            'type': 'dir',
            'name': 'stories',
            'children': [
                {
                    'type': 'file',
                    'name': 'index',
                    'ext': 'js',
                    'lines': [],
                    'children': [],
                }
            ],
        },
        {
            'type': 'file',
            'name': moduleName,
            'ext': 'tsx',
            'children': [],
            'lines': [
                'import routes from "./routes";',
                'import * as actionTypes from "./actionTypes";',
                'import store from "./store"',
                'export default { routes, store, actionTypes };',

            ]
        },
        {
            'type': 'file',
            'name': moduleName,
            'ext': 'md',
            'children': [],
            'lines': []
        },
         {
                    'type': 'file',
                    'name': 'index',
                    'ext': 'tsx',
                    'children': [],
                    'lines': [
                        'export {{ default as {name} }} from "./{name}"'.format(name=moduleName)
                    ]
        },
        {
                   'type': 'file',
                   'name': 'package',
                   'ext': 'json',
                   'children': [],
                   'lines': [
                    '{',
                     '"main": "./{}",'.format(moduleName),
                     '"name": "@latoken-component/{}",'.format(moduleName),
                     '"version": "0.0.1",',
                      '"license": "MIT",',
                       '"dependencies": {}'
                    '}'
                   ]
               },

    ]
}

os.mkdir(modulePath)


def generateStructure(list, root):
    def walkTo(item):
        if len(item.get('children')) > 0:
            normal_path = os.path.normpath(root + '/{}'.format(item.get('name')))
            os.mkdir(normal_path)
            return generateStructure(item.get('children'), os.path.normpath(normal_path))
        file = os.path.normpath(root + '/{name}.{ext}'.format(name=item.get('name'), ext=item.get('ext')))
        with open(file, mode='w') as f:
            for l in item.get('lines'):
                f.write(l + '\n')

        # if item.type == 'dir':
        #     return os.makedirs(root + '/{}'.format(item.name))

    map(walkTo, list)


generateStructure(structure.get('children'), structure.get('rootPath'))
# print(os.path.normpath('./app/src/modules/user/./index.js'))
