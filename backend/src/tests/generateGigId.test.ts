import { generateId } from '../utils/idGenerator';

describe('Generate Gig ID', () => {
  it('should generate a unique ID', () => {
    const clientAddress = '0x1234567890123456789012345678901234567890';
    const title = 'Test Gig';
    
    const gigId = generateId(clientAddress, title);
    console.log('Generated Gig ID:', gigId);
    
    expect(gigId).toBeTruthy();
    expect(gigId.length).toBeGreaterThan(0);
    expect(gigId.startsWith('0x')).toBeTruthy();
  });
});

// Run test using `npm test`