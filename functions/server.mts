import app from "./api.mjs";

const PORT: number = 5050;

app.listen(PORT, (): void => console.log(`Listening on port ${PORT}`));
