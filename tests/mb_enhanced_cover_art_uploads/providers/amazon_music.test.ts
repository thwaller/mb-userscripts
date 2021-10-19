import { setupPolly } from '@test-utils/pollyjs';

import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { AmazonMusicProvider } from '@src/mb_enhanced_cover_art_uploads/providers/amazon_music';

describe('amazon music provider', () => {
    // eslint-disable-next-line jest/require-hook
    setupPolly();
    const provider = new AmazonMusicProvider();

    it('matches album links', () => {
        expect(provider.supportsUrl(new URL('https://music.amazon.com/albums/B08Y99SFVJ')))
            .toBeTrue();
    });

    it.each`
        url | type
        ${'https://music.amazon.com/artists/B08YC6GFB7/hannapeles'} | ${'artist'}
        ${'https://music.amazon.com/playlists/B07H8NWNNF'} | ${'playlist'}
    `('does not match $type links', ({ url }: { url: string }) => {
        expect(provider.supportsUrl(new URL(url)))
            .toBeFalse();
    });

    it('extracts album ID', () => {
        expect(provider.extractId(new URL('https://music.amazon.com/albums/B08Y99SFVJ')))
            .toBe('B08Y99SFVJ');
    });

    it('uses Amazon provider covers', async () => {
        const covers = await provider.findImages(new URL('https://music.amazon.com/albums/B08MCFCQD8'));

        expect(covers).toBeArrayOfSize(1);
        expect(covers[0].url.pathname).toContain('81NnKXVjJvL');
        expect(covers[0].types).toStrictEqual([ArtworkTypeIDs.Front]);
    });
});
