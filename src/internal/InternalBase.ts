export abstract class InternalBase<TPublic extends object> {
    constructor(public readonly pub: TPublic) {}
}
