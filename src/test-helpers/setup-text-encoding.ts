import { TextDecoder, TextEncoder } from "text-encoding";

(global as any).TextDecoder = TextDecoder;
(global as any).TextEncoder = TextEncoder;
