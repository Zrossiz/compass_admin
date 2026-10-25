import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = ts.transpileModule(
  readFileSync(new URL('../src/shared/api/index.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  },
).outputText;
function setup(refresh = async () => {}) {
  let reject;
  const retries = [],
    redirects = [];
  const client = async (config) => {
    retries.push(config);
    return { status: 200 };
  };
  client.interceptors = {
    response: {
      use: (_ok, fail) => {
        reject = fail;
      },
    },
  };
  const context = {
    exports: {},
    window: { location: { replace: (path) => redirects.push(path) } },
    require: (name) =>
      name === './refresh'
        ? { refresh }
        : name === '../constants'
          ? { baseUrl: 'http://test' }
          : { create: () => client, isAxiosError: () => false },
  };
  vm.runInNewContext(source, context);
  return { reject, retries, redirects };
}
const unauthorized = (url = '/api/v1/spheres') => ({ response: { status: 401 }, config: { url } });
test('login errors do not refresh or redirect', async () => {
  let count = 0;
  const env = setup(async () => {
    count++;
  });
  const error = unauthorized('/api/v1/users/login');
  await assert.rejects(env.reject(error), (e) => e === error);
  assert.equal(count, 0);
  assert.equal(env.retries.length, 0);
  assert.equal(env.redirects.length, 0);
});
test('failed refresh redirects without retrying the original mutation', async () => {
  const failure = new Error('expired');
  const env = setup(async () => {
    throw failure;
  });
  await assert.rejects(env.reject(unauthorized()), (e) => e === failure);
  assert.deepEqual(env.redirects, ['/']);
  assert.equal(env.retries.length, 0);
});
test('concurrent unauthorized requests share one refresh', async () => {
  let count = 0,
    resolve;
  const pending = new Promise((r) => {
    resolve = r;
  });
  const env = setup(async () => {
    count++;
    await pending;
  });
  const a = env.reject(unauthorized()),
    b = env.reject(unauthorized());
  assert.equal(count, 1);
  resolve();
  await Promise.all([a, b]);
  assert.equal(env.retries.length, 2);
});
test('second 401 stops the retry loop', async () => {
  let count = 0;
  const env = setup(async () => {
    count++;
  });
  const error = unauthorized();
  error.config._retried = true;
  await assert.rejects(env.reject(error), (e) => e === error);
  assert.equal(count, 0);
  assert.equal(env.retries.length, 0);
  assert.deepEqual(env.redirects, ['/']);
});
