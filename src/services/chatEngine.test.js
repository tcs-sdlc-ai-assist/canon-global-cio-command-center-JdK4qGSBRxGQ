import { describe, it, expect, vi, beforeEach } from 'vitest';
import { matchResponse, processMessage } from './chatEngine';

describe('chatEngine', () => {
  describe('matchResponse', () => {
    it('returns fallback response for empty message', () => {
      const result = matchResponse('');
      expect(result).toBe(
        'I can help you with insights across several areas: business impact and value creation, operational excellence, risk and governance, innovation portfolio, and partnership performance. What would you like to explore?'
      );
    });

    it('returns fallback response for null message', () => {
      const result = matchResponse(null);
      expect(result).toBe(
        'I can help you with insights across several areas: business impact and value creation, operational excellence, risk and governance, innovation portfolio, and partnership performance. What would you like to explore?'
      );
    });

    it('returns fallback response for undefined message', () => {
      const result = matchResponse(undefined);
      expect(result).toBe(
        'I can help you with insights across several areas: business impact and value creation, operational excellence, risk and governance, innovation portfolio, and partnership performance. What would you like to explore?'
      );
    });

    it('returns fallback response for non-string message', () => {
      const result = matchResponse(123);
      expect(result).toBe(
        'I can help you with insights across several areas: business impact and value creation, operational excellence, risk and governance, innovation portfolio, and partnership performance. What would you like to explore?'
      );
    });

    it('returns fallback response when no keywords match', () => {
      const result = matchResponse('tell me about the weather');
      expect(result).toBe(
        'I can help you with insights across several areas: business impact and value creation, operational excellence, risk and governance, innovation portfolio, and partnership performance. What would you like to explore?'
      );
    });

    it('matches Q4 board presentation keyword', () => {
      const result = matchResponse('Can you prepare the Q4 board presentation?');
      expect(result).toContain('Q4 board presentation');
      expect(result).toContain('12.5% revenue growth');
    });

    it('matches TCS partnership keyword', () => {
      const result = matchResponse('What is the status of the TCS partnership?');
      expect(result).toContain('TCS partnership analysis');
      expect(result).toContain('170% ROI');
    });

    it('matches contract keyword', () => {
      const result = matchResponse('I need to review the contract terms');
      expect(result).toContain('TCS partnership analysis');
    });

    it('matches business value keyword', () => {
      const result = matchResponse('Show me business value metrics');
      expect(result).toContain('Business impact metrics');
      expect(result).toContain('€2.4B');
    });

    it('matches revenue keyword', () => {
      const result = matchResponse('What is our revenue growth?');
      expect(result).toContain('Business impact metrics');
    });

    it('matches americas regional keyword', () => {
      const result = matchResponse('How is the Americas region performing?');
      expect(result).toContain('Regional performance comparison');
      expect(result).toContain('Americas');
    });

    it('matches region keyword', () => {
      const result = matchResponse('Give me a regional performance overview');
      expect(result).toContain('Regional performance comparison');
    });

    it('matches innovation keyword', () => {
      const result = matchResponse('What are our innovation metrics?');
      expect(result).toContain('Innovation metrics');
      expect(result).toContain('47 AI/ML models');
    });

    it('matches future keyword', () => {
      const result = matchResponse('What does the future look like for AI?');
      expect(result).toContain('Innovation metrics');
    });

    it('matches pipeline keyword', () => {
      const result = matchResponse('What is in the innovation pipeline?');
      expect(result).toContain('Innovation metrics');
    });

    it('matches security keyword', () => {
      const result = matchResponse('How is our security posture?');
      expect(result).toContain('Risk and governance metrics');
      expect(result).toContain('Compliance Score 96.2%');
    });

    it('matches risk keyword', () => {
      const result = matchResponse('What are the key risks?');
      expect(result).toContain('Risk and governance metrics');
    });

    it('matches compliance keyword', () => {
      const result = matchResponse('Are we compliant with regulations?');
      expect(result).toContain('Risk and governance metrics');
    });

    it('matches operations keyword', () => {
      const result = matchResponse('How are our operations doing?');
      expect(result).toContain('Operations metrics');
      expect(result).toContain('247 total incidents');
    });

    it('matches incidents keyword', () => {
      const result = matchResponse('How many incidents this month?');
      expect(result).toContain('Operations metrics');
    });

    it('matches availability keyword', () => {
      const result = matchResponse('What is our system availability?');
      expect(result).toContain('Operations metrics');
    });

    it('matches europe keyword', () => {
      const result = matchResponse('How is Europe performing?');
      expect(result).toContain('Europe region leads');
      expect(result).toContain('excellent (94%)');
    });

    it('matches emea keyword', () => {
      const result = matchResponse('EMEA region update please');
      expect(result).toContain('Europe region leads');
    });

    it('matches india keyword', () => {
      const result = matchResponse('India CoE performance');
      expect(result).toContain('India (CoE) shows strong performance');
      expect(result).toContain('good (85%)');
    });

    it('matches coe keyword', () => {
      const result = matchResponse('How is the Center of Excellence doing?');
      expect(result).toContain('India (CoE) shows strong performance');
    });

    it('matches center of excellence keyword', () => {
      const result = matchResponse('center of excellence update');
      expect(result).toContain('India (CoE) shows strong performance');
    });

    it('matches sustainability keyword', () => {
      const result = matchResponse('What is our sustainability index?');
      expect(result).toContain('Sustainability Index stands at 82.1%');
    });

    it('matches carbon keyword', () => {
      const result = matchResponse('Carbon footprint reduction progress');
      expect(result).toContain('Sustainability Index stands at 82.1%');
    });

    it('matches green keyword', () => {
      const result = matchResponse('Green IT initiatives update');
      expect(result).toContain('Sustainability Index stands at 82.1%');
    });

    it('matches AI keyword', () => {
      const result = matchResponse('Tell me about our AI initiatives');
      expect(result).toContain('AI/ML initiatives show strong momentum');
      expect(result).toContain('47 models in production');
    });

    it('matches machine learning keyword', () => {
      const result = matchResponse('Machine learning model status');
      expect(result).toContain('AI/ML initiatives show strong momentum');
    });

    it('matches ml keyword', () => {
      const result = matchResponse('ML deployment progress');
      expect(result).toContain('AI/ML initiatives show strong momentum');
    });

    it('matches export keyword', () => {
      const result = matchResponse('How do I export the data?');
      expect(result).toContain('I can help you export dashboard data');
    });

    it('matches download keyword', () => {
      const result = matchResponse('Can I download a report?');
      expect(result).toContain('I can help you export dashboard data');
    });

    it('matches csv keyword', () => {
      const result = matchResponse('Generate a CSV file');
      expect(result).toContain('I can help you export dashboard data');
    });

    it('matches help keyword', () => {
      const result = matchResponse('Help me understand the dashboard');
      expect(result).toContain('I can help you with insights across several areas');
    });

    it('matches what can you do keyword', () => {
      const result = matchResponse('What can you do?');
      expect(result).toContain('I can help you with insights across several areas');
    });

    it('matches capabilities keyword', () => {
      const result = matchResponse('What are your capabilities?');
      expect(result).toContain('I can help you with insights across several areas');
    });

    it('is case insensitive', () => {
      const result = matchResponse('Q4 BOARD PRESENTATION');
      expect(result).toContain('Q4 board presentation');
    });

    it('handles mixed case input', () => {
      const result = matchResponse('Tcs PaRtNeRsHiP rEvIeW');
      expect(result).toContain('TCS partnership analysis');
    });

    it('matches first keyword pattern when multiple match', () => {
      const result = matchResponse('Q4 board presentation and TCS partnership');
      expect(result).toContain('Q4 board presentation');
    });

    it('trims whitespace from input', () => {
      const result = matchResponse('  innovation update  ');
      expect(result).toContain('Innovation metrics');
    });
  });

  describe('processMessage', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns a response after a delay', async () => {
      const promise = processMessage('Q4 board presentation');
      vi.advanceTimersByTime(1500);
      const result = await promise;
      expect(result).toContain('Q4 board presentation');
    });

    it('returns fallback response for unmatched message', async () => {
      const promise = processMessage('random message with no keywords');
      vi.advanceTimersByTime(1500);
      const result = await promise;
      expect(result).toBe(
        'I can help you with insights across several areas: business impact and value creation, operational excellence, risk and governance, innovation portfolio, and partnership performance. What would you like to explore?'
      );
    });

    it('handles empty message gracefully', async () => {
      const promise = processMessage('');
      vi.advanceTimersByTime(1500);
      const result = await promise;
      expect(result).toBe(
        'I can help you with insights across several areas: business impact and value creation, operational excellence, risk and governance, innovation portfolio, and partnership performance. What would you like to explore?'
      );
    });
  });
});