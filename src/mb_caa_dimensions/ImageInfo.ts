/** Image dimensions. */
export interface Dimensions {
    width: number;
    height: number;
}

/** Information about the file itself. */
export interface FileInfo {
    /** Image size in bytes, may be unknown. */
    size?: number;
    /** Textual file type description, may be unknown. */
    fileType?: string;
}

/** Image information. */
export interface ImageInfo extends FileInfo {
    /** Dimensions of the image. */
    dimensions?: Dimensions;
}
