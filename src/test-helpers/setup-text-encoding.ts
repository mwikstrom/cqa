import { TextDecoder, TextEncoder } from "util";

(global as any).TextDecoder = TextDecoder;
(global as any).TextEncoder = TextEncoder;
