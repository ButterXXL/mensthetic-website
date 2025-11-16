import '@testing-library/jest-dom';

// Mock Supabase client
jest.mock('./js/supabase-client.js', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }))
    }
}));

// Mock window.ENV
global.window.ENV = {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key'
};