// idGenerator.test.ts
import { generateId } from '../utils/idGenerator.js';
import { ethers } from 'ethers';
describe('ID Generator', () => {
    describe('Generate Gig ID', () => {
        const validAddress = '0x1234567890123456789012345678901234567890';
        it('should generate a valid hex string ID', () => {
            const id = generateId(validAddress, 'Test Gig', 'Test Description');
            expect(id).toMatch(/^0x[0-9a-f]{64}$/i);
        });
        it('should throw error for invalid address', () => {
            expect(() => generateId('invalid-address', 'title', 'description'))
                .toThrow('Invalid Ethereum address format');
            expect(() => generateId('0x123', 'title', 'description'))
                .toThrow('Invalid Ethereum address format');
        });
        it('should throw error for empty or whitespace-only values', () => {
            // Empty first value
            expect(() => generateId(validAddress, '', 'description'))
                .toThrow('First value cannot be empty');
            expect(() => generateId(validAddress, '   ', 'description'))
                .toThrow('First value cannot be empty');
            // Empty second value
            expect(() => generateId(validAddress, 'title', ''))
                .toThrow('Second value cannot be empty');
            expect(() => generateId(validAddress, 'title', '  '))
                .toThrow('Second value cannot be empty');
        });
        it('should throw error for undefined or null values', () => {
            expect(() => generateId(validAddress, undefined, 'description'))
                .toThrow('First value cannot be empty');
            expect(() => generateId(validAddress, 'title', null))
                .toThrow('Second value cannot be empty');
        });
        it('should generate different IDs for different inputs', () => {
            const id1 = generateId(validAddress, 'Title 1', 'Desc 1');
            const id2 = generateId(validAddress, 'Title 2', 'Desc 2');
            expect(id1).not.toEqual(id2);
        });
        it('should generate consistent IDs for same inputs', () => {
            const title = 'Test Gig';
            const description = 'Test Description';
            const id1 = generateId(validAddress, title, description);
            const id2 = generateId(validAddress, title, description);
            expect(id1).toEqual(id2);
        });
        it('should trim whitespace from inputs', () => {
            const id1 = generateId(validAddress, 'Title', 'Description');
            const id2 = generateId(validAddress, '  Title  ', '  Description  ');
            expect(id1).toEqual(id2);
        });
    });
    describe('Edge Cases', () => {
        const validAddress = '0x1234567890123456789012345678901234567890';
        it('should handle long inputs', () => {
            const longTitle = 'a'.repeat(1000);
            const longDescription = 'b'.repeat(1000);
            const id = generateId(validAddress, longTitle, longDescription);
            expect(id).toMatch(/^0x[0-9a-f]{64}$/i);
        });
        it('should handle special characters', () => {
            const id = generateId(validAddress, 'Test @#$%^&* Gig!', 'Test 你好 Description ❤️');
            expect(id).toMatch(/^0x[0-9a-f]{64}$/i);
        });
        it('should generate unique IDs for different addresses with same content', () => {
            const address2 = '0x1234567890123456789012345678901234567891';
            const id1 = generateId(validAddress, 'Same Title', 'Same Description');
            const id2 = generateId(address2, 'Same Title', 'Same Description');
            expect(id1).not.toEqual(id2);
        });
        it('should be a valid ethereum bytes32', () => {
            const id = generateId(validAddress, 'Test Gig', 'Test Description');
            // Remove '0x' prefix for length check
            const idWithoutPrefix = id.slice(2);
            expect(idWithoutPrefix.length).toBe(64);
            expect(ethers.isHexString(id)).toBeTruthy();
        });
    });
});
//# sourceMappingURL=generateGigId.test.js.map