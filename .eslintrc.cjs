module.exports = {
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'ecmaFeatures': {
            'jsx': true,
            'tsx': true,
        },
        'sourceType': 'module',
        'project': './tsconfig.json',
    },
    'plugins': [
        '@typescript-eslint',
        'react',
    ],
    'ignorePatterns': [
        '.eslintrc.cjs',
    ],
    'rules': {
        'semi': 'error',
        'no-param-reassign': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        'max-len': ['error', {
            'code': 120,
            'tabWidth': 4,
        }],
        'space-before-blocks': ['error', {
            'functions': 'always',
            'keywords': 'always',
            'classes': 'always'
        }],
        'keyword-spacing': ['error', {
            'before': true,
            'after': false,
            'overrides': {
                'import': {
                    'after': true,
                },
                'from': {
                    'after': true,
                },
                'return': {
                    'after': true,
                },
                'const': {
                    'after': true,
                },
                'case': {
                    'after': true,
                },
                'else': {
                    'after': true,
                },
                'of': {
                    'after': true,
                },
                'try': {
                    'after': true,
                },
                'throw': {
                    'after': true,
                },
                'default': {
                    'after': true,
                },
                'class': {
                    'after': true,
                },
                'finally': {
                    'after': true,
                },
                'let': {
                    'after': true,
                },
            },
        }],
        'curly': ['error', 'multi-line', 'consistent'],
        'nonblock-statement-body-position': ['error', 'beside'],
        'brace-style': ['error', '1tbs'],
        'space-infix-ops': ['error', { 'int32Hint': false }],
        'switch-colon-spacing': ['error', {
            'before': false,
            'after': true,
        }],
        'key-spacing': ['error', {
            'beforeColon': false,
            'afterColon': true,
            'mode': 'strict',
        }],
        'no-constant-condition': ['error', {
            'checkLoops': false,
        }],

        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/strict-boolean-expressions': ['error', {
            'allowString': true,
            'allowNumber': true,
            'allowNullableObject': true,
            'allowNullableBoolean': false,
            'allowNullableString': false,
            'allowNullableNumber': false,
            'allowNullableEnum': true,
            'allowAny': false,
            'allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing': false,
        }],
        '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
        '@typescript-eslint/no-unused-vars': ['warn', {
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_',
            'destructuredArrayIgnorePattern': '^_',
        }],
        '@typescript-eslint/explicit-function-return-type': ['warn', {
            'allowHigherOrderFunctions': true,
            'allowConciseArrowFunctionExpressionsStartingWithVoid': true,
            'allowDirectConstAssertionInArrowFunctions': true,
            'allowTypedFunctionExpressions': true,
            'allowExpressions': true,
        }],
        '@typescript-eslint/no-empty-interface': ['error', {
            'allowSingleExtends': true,
        }],
    },
};
