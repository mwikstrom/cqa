import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";

const expect = chai.expect;

describe("setCommandResolved", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
        await store.addCommand({ target: "x", type: "y" });
    });

    afterEach(() => store.close());

    it("can mark pending command as accepted", async () => {
        await store.setCommandAccepted(1, "abc123");
        const list = await store.getCommandList();
        expect(list.map(data => data.result).join()).to.eq("accepted");
    });

    it("can mark pending command as rejected", async () => {
        await store.setCommandRejected(1);
        const list = await store.getCommandList();
        expect(list.map(data => data.result).join()).to.eq("rejected");
    });

    it("can re-mark accepted command with same commit", async () => {
        expect(await store.setCommandAccepted(1, "abc123")).to.eq(true);
        expect(await store.setCommandAccepted(1, "abc123")).to.eq(false);
    });

    it("can re-mark rejected command", async () => {
        expect(await store.setCommandRejected(1)).to.eq(true);
        expect(await store.setCommandRejected(1)).to.eq(false);
    });

    it("cannot mark accepted command with other commit", async () => {
        await store.setCommandAccepted(1, "abc123");
        await store.setCommandAccepted(1, "other").then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Command 1 is already accepted in another commit"),
        );
    });

    it("cannot mark accepted command as rejected", async () => {
        await store.setCommandAccepted(1, "abc123");
        await store.setCommandRejected(1).then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Command 1 is accepted and cannot be rejected"),
        );
    });

    it("cannot mark rejected command as accepted", async () => {
        await store.setCommandRejected(1);
        await store.setCommandAccepted(1, "abc123").then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Command 1 is rejected and cannot be accepted"),
        );
    });

    it("cannot mark non-existing command as rejected", async () => {
        await store.setCommandRejected(123).then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Unknown command 123 cannot be rejected"),
        );
    });

    it("cannot mark non-existing command as accepted", async () => {
        await store.setCommandAccepted(123, "abc123").then(
            expect.fail,
            error => expect(error).to.have.property("message").that
                .eq("Unknown command 123 cannot be accepted"),
        );
    });
});
