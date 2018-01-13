// Vendor
import parseHDR from 'parse-hdr';

export default function HDRParser(buffer: ArrayBuffer) {
    return parseHDR(buffer);
}
