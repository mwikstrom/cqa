import {
    Command,
    ReadonlyJsonValue,
} from "../api";

import {
    createIdentifier,
    freezeDeep,
    InternalBase,
} from "../internal";

export class InternalCommand extends InternalBase<Command> {
    private _descriptor?: ReadonlyJsonValue;
    private _id?: string;

    public get descriptor(): ReadonlyJsonValue {
        if (this._descriptor === undefined) {
            this._descriptor = freezeDeep(this.pub.buildDescriptor());
        }

        return this._descriptor;
    }

    public get id(): string {
        if (this._id === undefined) {
            this._id = createIdentifier();
        }

        return this._id;
    }
}
