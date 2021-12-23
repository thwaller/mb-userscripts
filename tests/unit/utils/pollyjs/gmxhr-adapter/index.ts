// GM_xmlhttpRequest adapter for pollyjs
import { Buffer } from 'buffer';

import type { Request } from '@pollyjs/core';
import Adapter from '@pollyjs/adapter';
import fetch from 'node-fetch';

import { assertDefined } from '@lib/util/assert';
import { mockGMxmlHttpRequest } from '@test-utils/gm_mocks';

import { CRLFHeaders, FetchHeaders, PollyHeaders } from '../headers';

type RequestType<Context> = Request<GM.Request<Context>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export default class GMXHRAdapter<Context> extends Adapter<{}, RequestType<Context>> {

    static override get id(): string {
        return 'GM_xmlhttpRequest';
    }

    override onConnect(): void {
        mockGMxmlHttpRequest.mockImplementation((options: GM.Request<Context>): void => {
            this.handleRequest({
                url: options.url,
                method: options.method,
                headers: options.headers ?? {},
                body: options.data,
                requestArguments: options,
            }).catch((err) => {
                const resp: GM.Response<Context> = {
                    readyState: 4,
                    status: 0,
                    statusText: err.toString(),
                    responseHeaders: '',
                    finalUrl: options.url,
                    context: options.context,
                    responseXML: false,
                    responseText: '',
                    response: null,
                };
                options.onerror?.(resp);
            });
        });
    }

    override onDisconnect(): void {
        mockGMxmlHttpRequest.mockRestore();
    }

    override async onFetchResponse(pollyRequest: RequestType<Context>): ReturnType<Adapter['onFetchResponse']> {
        const { responseType } = pollyRequest.requestArguments;
        const headers = FetchHeaders.fromPollyHeaders(pollyRequest.headers);
        const resp = await fetch(pollyRequest.url, {
            method: pollyRequest.method,
            headers: headers,
            body: pollyRequest.body,
        });

        const pollyHeaders = PollyHeaders.fromFetchHeaders(resp.headers);
        // Storing the final URL after redirect, see `passthroughRealGMXHR`.
        pollyHeaders['x-pollyjs-finalurl'] = resp.url;

        const arrayBuffer = await resp.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const isBinary = responseType && responseType !== 'text';
        return {
            statusCode: resp.status,
            headers: pollyHeaders,
            body: buffer.toString(isBinary ? 'base64' : 'utf8'),
            encoding: isBinary ? 'base64' : undefined,
        };
    }

    override async onRespond(pollyRequest: RequestType<Context>, error?: Error): Promise<void> {
        if (error) throw error;

        const response = pollyRequest.response;
        const options = pollyRequest.requestArguments;
        const responseType = options.responseType;
        assertDefined(response);

        // Extract the final URL from the headers. We stored these in
        // the passthrough
        const headers = {...response.headers};
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const finalUrl = headers['x-pollyjs-finalurl'] ?? options.url;
        delete headers['x-pollyjs-finalUrl'];

        const resp: GM.Response<Context> = {
            readyState: 4,
            responseHeaders: CRLFHeaders.fromPollyHeaders(headers),
            status: response.statusCode,
            statusText: response.statusText,
            finalUrl: Array.isArray(finalUrl) ? finalUrl[0] : finalUrl,
            context: options.context,
            responseXML: false,
            responseText: '',
            response: null,
        };

        if (!options.onload) return;

        if (response.encoding === 'base64') {
            const buffer = Buffer.from(response.body ?? '', 'base64');
            const arrayBuffer = Uint8Array.from(buffer);
            if (responseType === 'blob') {
                options.onload({
                    ...resp,
                    response: new Blob([arrayBuffer]),
                });
            } else if (responseType === 'arraybuffer') {
                options.onload({
                    ...resp,
                    response: arrayBuffer,
                });
            } else {
                throw new Error(`Unknown response type: ${responseType}`);
            }
        } else {
            options.onload({
                ...resp,
                responseText: response.body ?? '',
            });
        }
    }
}
