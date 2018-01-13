// Vendor
import parseHDR from 'parse-hdr';

export default function HDRParser(buffer) {
    return parseHDR(buffer);
}
