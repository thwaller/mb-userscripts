import { assert, assertDefined, assertHasValue, AssertionError, assertNonNull } from '@lib/util/assert';

describe('assert', () => {
    it('throws on false condition', () => {
        expect(() => {
            assert(false);
        }).toThrow(AssertionError);
    });

    it('does not throw on true conditions', () => {
        expect(() => {
            assert(true);
        }).not.toThrow(AssertionError);
    });

    it('allows using custom messages', () => {
        expect(() => {
            assert(false, 'message');
        }).toThrow(new AssertionError('message'));
    });
});

describe('assertNonNull', () => {
    it('throws on null values', () => {
        expect(() => {
            assertNonNull(null);
        }).toThrow(AssertionError);
    });

    it('does not throw on undefined values', () => {
        expect(() => {
            assertNonNull(undefined);
        }).not.toThrow(AssertionError);
    });

    it.each(['', true, false, 'test'])('does not throw on truthy values (%s)', (value) => {
        expect(() => {
            assertNonNull(value);
        }).not.toThrow(AssertionError);
    });

    it('allows using custom messages', () => {
        expect(() => {
            assertNonNull(null, 'message');
        }).toThrow(new AssertionError('message'));
    });
});

describe('assertDefined', () => {
    it('throws on undefined values', () => {
        expect(() => {
            assertDefined(undefined);
        }).toThrow(AssertionError);
    });

    it('does not throw on null values', () => {
        expect(() => {
            assertDefined(null);
        }).not.toThrow(AssertionError);
    });

    it.each(['', true, false, 'test'])('does not throw on truthy values (%s)', (value) => {
        expect(() => {
            assertDefined(value);
        }).not.toThrow(AssertionError);
    });

    it('allows using custom messages', () => {
        expect(() => {
            assertDefined(undefined, 'message');
        }).toThrow(new AssertionError('message'));
    });
});

describe('assertHasValue', () => {
    it('throws on undefined values', () => {
        expect(() => {
            assertHasValue(undefined);
        }).toThrow(AssertionError);
    });

    it('throws on null values', () => {
        expect(() => {
            assertHasValue(null);
        }).toThrow(AssertionError);
    });

    it.each(['', true, false, 'test'])('does not throw on truthy values (%s)', (value) => {
        expect(() => {
            assertHasValue(value);
        }).not.toThrow(AssertionError);
    });

    it('allows using custom messages', () => {
        expect(() => {
            assertHasValue(null, 'message');
        }).toThrow(new AssertionError('message'));
    });
});

