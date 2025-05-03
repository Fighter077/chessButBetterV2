export function removeFileExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '');
}