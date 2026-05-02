import '@testing-library/jest-dom'

// Mock window.scrollTo - jsdom doesn't implement this
Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true,
});

// Mock matchMedia - needed for responsive components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock ResizeObserver - needed for some UI components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
