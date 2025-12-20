/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'jsdom',
	preset: 'ts-jest',
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	testMatch: ['<rootDir>/src/**/*.(test|spec).(ts|tsx)'],
	testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	transform: {
		'^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(uuid|@contentstack/venus-components)/)',
	],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},
};


