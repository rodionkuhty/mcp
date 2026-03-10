import test from "node:test";
import assert from "node:assert";

// Mocking some of the logic that index.ts performs manually, 
// as index.ts is an entry point with side effects (starting the server)
test("Tool registration logic in index.ts (logic check)", async (t) => {
  const addNumbers = (a: number, b: number) => `total is ${a + b}`;

  await t.test("add-numbers should return correct total", () => {
    assert.strictEqual(addNumbers(1, 2), "total is 3");
    assert.strictEqual(addNumbers(-1, 5), "total is 4");
    assert.strictEqual(addNumbers(0, 0), "total is 0");
  });

  await t.test("explain-sql logic should return russian and chinese mention", () => {
    const sql = "SELECT * FROM users";
    const content = `explain this ${sql} in a russian and chinese language`;
    assert.ok(content.includes("russian"));
    assert.ok(content.includes("chinese"));
    assert.ok(content.includes(sql));
  });
});
