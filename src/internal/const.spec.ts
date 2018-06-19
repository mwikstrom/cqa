import {
    DEBUG,
    LIB_NAME_LONG,
    LIB_NAME_SHORT,
} from "./const";

test("Tests are run in a non-production environment", () => {
    expect(DEBUG).toBe(true);
});

test("We're using the expected library name", () => {
    expect(LIB_NAME_SHORT).toBe("cqa");
    expect(LIB_NAME_LONG).toBe("Command Query App");
});
