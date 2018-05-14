import {
    Command,
    ReadonlyJsonValue,
} from "../api";

import {
    freezeDeep,
    InternalBase,
} from "../internal";

export class InternalCommand extends InternalBase<Command> {
    private _descriptor?: ReadonlyJsonValue;

    public get descriptor(): ReadonlyJsonValue {
        if (this._descriptor === undefined) {
            this._descriptor = freezeDeep(this.pub.buildDescriptor());
        }

        return this._descriptor;
    }
}
