import { ICommandInput } from "../api/command-input";
import { createJsonCrypto } from "../api/create-json-crypto";
import { IDatastore } from "../api/datastore";
import { openDatastore } from "../api/open-datastore";

const expect = chai.expect;

describe("addCommand", () => {
    let store: IDatastore;

    beforeEach(async () => {
        const name = `test-${Math.floor(Math.random() * 9999999)}`;
        const crypto = await createJsonCrypto();
        store = await openDatastore({ name, crypto });
    });

    afterEach(() => store.close());

    it("can be invoked with minimal input", async () => {
        const input: ICommandInput = {
            target: "x",
            type: "y",
        };

        const data = await store.addCommand(input);

        expect(data.commit).to.eq("");
        expect(data.id).to.match(/^[0-9a-zA-Z_-]{22}$/);
        expect(data.key).to.eq(1);
        expect(data.payload).to.eq(null);
        expect(data.result).to.eq("pending");
        expect(data.target).to.eq(input.target);
        expect(data.type).to.eq(input.type);
    });

    it("can be invoked with full input", async () => {
        const payload = { hello: "world" };
        const input: ICommandInput = {
            id: "a",
            payload,
            target: "x",
            type: "y",
        };

        const data = await store.addCommand(input);

        expect(data.commit).to.eq("");
        expect(data.id).to.eq(input.id);
        expect(data.key).to.eq(1);
        expect(data.payload).to.deep.eq(payload);
        expect(data.result).to.eq("pending");
        expect(data.target).to.eq(input.target);
        expect(data.type).to.eq(input.type);
    });
});
