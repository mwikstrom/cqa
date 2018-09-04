import { createIdentifier } from "./create-identifier";

const expect = chai.expect;

describe("createIdentifier", () => {
    it("creates random 16-byte identifiers using base-64 url encoding", () => {
        const a = createIdentifier();
        const b = createIdentifier();
        expect(a).to.match(/^[0-9a-zA-Z_-]{22}$/);
        expect(b).to.match(/^[0-9a-zA-Z_-]{22}$/);
        expect(a).not.to.eq(b);
    });

    it("can be told to create identifiers of custom length", () => {
        const id = createIdentifier(3);
        expect(id).to.match(/^[0-9a-zA-Z_-]{4}$/);
    });
});
