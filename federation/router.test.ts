import { assertEquals, assertThrows } from "@std/assert";
import { test } from "../testing/mod.ts";
import { Router, RouterError } from "./router.ts";

function setUp(): Router {
  const router = new Router();
  router.add("/users/{name}", "user");
  router.add("/users/{name}/{postId}", "post");
  return router;
}

test("Router.add()", () => {
  const router = new Router();
  assertEquals(router.add("/users", "users"), new Set());
  assertEquals(router.add("/users/{name}", "user"), new Set(["name"]));
  assertEquals(
    router.add("/users/{name}/{postId}", "post"),
    new Set([
      "name",
      "postId",
    ]),
  );
  assertThrows(() => router.add("foo", "name"), RouterError);
});

test("Router.route()", () => {
  const router = setUp();
  assertEquals(router.route("/users/alice"), {
    name: "user",
    values: { name: "alice" },
  });
  assertEquals(router.route("/users/alice/123"), {
    name: "post",
    values: { name: "alice", postId: "123" },
  });
});

test("Router.build()", () => {
  const router = setUp();
  assertEquals(router.build("user", { name: "alice" }), "/users/alice");
  assertEquals(
    router.build("post", { name: "alice", postId: "123" }),
    "/users/alice/123",
  );
});
