import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isPending = false;
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isPending && 'pending-class'
      );
      expect(result).toBe('base-class active-class');
    });

    it('should merge tailwind classes properly using tailwind-merge', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toBe('p-2');
    });

    it('should handle arrays and objects', () => {
      const result = cn(['p-4', { 'text-center': true, 'hidden': false }]);
      expect(result).toBe('p-4 text-center');
    });
  });
});
