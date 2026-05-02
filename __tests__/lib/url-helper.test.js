import { getFullUrl, getProfilePictureUrl } from '@/lib/url-helper';

describe('url-helper', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('getFullUrl', () => {
    it('should return null if url is falsy', () => {
      expect(getFullUrl(null)).toBeNull();
      expect(getFullUrl('')).toBeNull();
      expect(getFullUrl(undefined)).toBeNull();
    });

    it('should return the url as is if it starts with http:// or https://', () => {
      const urlHttp = 'http://example.com/image.png';
      const urlHttps = 'https://example.com/image.png';
      expect(getFullUrl(urlHttp)).toBe(urlHttp);
      expect(getFullUrl(urlHttps)).toBe(urlHttps);
    });

    it('should return the url as is if it starts with data:', () => {
      const dataUrl = 'data:image/png;base64,abcdef';
      expect(getFullUrl(dataUrl)).toBe(dataUrl);
    });

    it('should handle paths with and without leading slash', () => {
       const urlWithSlash = '/images/test.jpg';
       const urlWithoutSlash = 'images/test.jpg';

       const result1 = getFullUrl(urlWithSlash);
       const result2 = getFullUrl(urlWithoutSlash);

       expect(result1).toBe(result2);
       expect(result1).toContain('/images/test.jpg');
    });
  });

  describe('getProfilePictureUrl', () => {
    it('should be an alias for getFullUrl', () => {
       const url = '/profile.jpg';
       expect(getProfilePictureUrl(url)).toBe(getFullUrl(url));
    });
  });
});
