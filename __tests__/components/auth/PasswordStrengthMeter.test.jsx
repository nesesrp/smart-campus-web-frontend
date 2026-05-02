import React from 'react';
import { render, screen } from '@testing-library/react';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
    it('should not render anything if password is empty', () => {
        const { container } = render(<PasswordStrengthMeter password="" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render checks correctly', () => {
        render(<PasswordStrengthMeter password="password" />);

        expect(screen.getByText('En az 8 karakter')).toBeInTheDocument();
        expect(screen.getByText('Büyük harf')).toBeInTheDocument();
        expect(screen.getByText('Küçük harf')).toBeInTheDocument();
        expect(screen.getByText('Rakam')).toBeInTheDocument();
        expect(screen.getByText('Özel karakter')).toBeInTheDocument();
    });

    it('should update strength indicator based on password complexity', () => {
        // 1. Weak: only lowercase
        const { rerender } = render(<PasswordStrengthMeter password="abc" />);
        // Expect "Çok Zayıf" or similar label, or check colors/icons
        // Score 1 (lowercase only)

        // Let's verify text content of requirements
        // "Küçük harf" should have check icon (or class)
        // Others should have X

        // Since we test implementation details, we can check labels
        // Score 1: "Çok Zayıf"
        expect(screen.getByText('Çok Zayıf')).toBeInTheDocument();

        // 2. Medium: lowercase + length + uppercase
        rerender(<PasswordStrengthMeter password="Password123" />);
        // Checks: length(>8), upper, lower, number. (special missing) -> Score 4 -> Güçlü

        expect(screen.getByText('Güçlü')).toBeInTheDocument();

        // 3. Full
        rerender(<PasswordStrengthMeter password="Password123!" />);
        // Score 5 -> Çok Güçlü
        expect(screen.getByText('Çok Güçlü')).toBeInTheDocument();
    });
});
