declare var process: {
    env: {
        NODE_ENV?: string;
    },
};

if (typeof process !== "object") {
    process = { env: { } };
} else if (typeof process.env !== "object") {
    process.env = {};
}
