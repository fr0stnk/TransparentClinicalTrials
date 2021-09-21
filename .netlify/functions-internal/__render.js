var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/chunks/http.js
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4, request);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error3 = e;
          }
          if (loaded && !error3) {
            branch.push(loaded);
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error3,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error4
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$9 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\texport let props_3 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}>\\n\\t\\t\\t\\t\\t{#if components[3]}\\n\\t\\t\\t\\t\\t\\t<svelte:component this={components[3]} {...(props_3 || {})}/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</svelte:component>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AA2DC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  let { props_3 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  if ($$props.props_3 === void 0 && $$bindings.props_3 && props_3 !== void 0)
    $$bindings.props_3(props_3);
  $$result.css.add(css$9);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {
        default: () => `${components[3] ? `${validate_component(components[3] || missing_component, "svelte:component").$$render($$result, Object.assign(props_3 || {}), {}, {})}` : ``}`
      })}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base$2 = "";
var assets = "";
function set_paths(paths) {
  base$2 = paths.base;
  assets = paths.assets || base$2;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-632ab0d0.js",
      css: [assets + "/_app/assets/start-61d1577b.css"],
      js: [assets + "/_app/start-632ab0d0.js", assets + "/_app/chunks/vendor-bbfa0731.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22, request) => {
      hooks.handleError({ error: error22, request });
      error22.stack = options.get_stack(error22);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": ".DS_Store", "size": 6148, "type": null }, { "file": "biotech.jpg", "size": 11963, "type": "image/jpeg" }, { "file": "euromed.png", "size": 23531, "type": "image/png" }, { "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "fgbu.png", "size": 12190, "type": "image/png" }, { "file": "gbuz-mordv.png", "size": 3412, "type": "image/png" }, { "file": "gbuz.png", "size": 34681, "type": "image/png" }, { "file": "keynote.png", "size": 22053, "type": "image/png" }, { "file": "lokod.png", "size": 37539, "type": "image/png" }, { "file": "onkoivreg.png", "size": 35117, "type": "image/png" }, { "file": "ronc.jpg", "size": 13018, "type": "image/jpeg" }, { "file": "rzd.jpg", "size": 12447, "type": "image/jpeg" }, { "file": "sgkb2.jpeg", "size": 51761, "type": "image/jpeg" }, { "file": "tomsknrmc.jpg", "size": 11643, "type": "image/jpeg" }, { "file": "vomiac.png", "size": 43012, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/search\/ConditionSearchBar\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/search/__layout.svelte", "src/routes/search/ConditionSearchBar.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/search\/SearchResults\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/search/__layout.svelte", "src/routes/search/SearchResults.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/search\/TagsSearchBar\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/search/__layout.svelte", "src/routes/search/TagsSearchBar.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/search\/testFunctions\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return testFunctions;
      })
    },
    {
      type: "page",
      pattern: /^\/search\/searchPage\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/search/__layout.svelte", "src/routes/search/searchPage.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/search\/trials\/([^/]+?)\/?$/,
      params: (m) => ({ trial: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/search/__layout.svelte", "src/routes/search/trials/[trial].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/search\/Trial\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/search/__layout.svelte", "src/routes/search/Trial.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/search\/([^/]+?)\/?$/,
      params: (m) => ({ searchResultsPage: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/search/__layout.svelte", "src/routes/search/[searchResultsPage].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/base\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return base$1;
      })
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error22 }) => console.error(error22.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout$1;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/search/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/search/ConditionSearchBar.svelte": () => Promise.resolve().then(function() {
    return ConditionSearchBar$1;
  }),
  "src/routes/search/SearchResults.svelte": () => Promise.resolve().then(function() {
    return SearchResults$1;
  }),
  "src/routes/search/TagsSearchBar.svelte": () => Promise.resolve().then(function() {
    return TagsSearchBar$1;
  }),
  "src/routes/search/searchPage.svelte": () => Promise.resolve().then(function() {
    return searchPage;
  }),
  "src/routes/search/trials/[trial].svelte": () => Promise.resolve().then(function() {
    return _trial_;
  }),
  "src/routes/search/Trial.svelte": () => Promise.resolve().then(function() {
    return Trial$1;
  }),
  "src/routes/search/[searchResultsPage].svelte": () => Promise.resolve().then(function() {
    return _searchResultsPage_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-a081fd24.js", "css": ["assets/pages/__layout.svelte-7045ab79.css"], "js": ["pages/__layout.svelte-a081fd24.js", "chunks/vendor-bbfa0731.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-511f715f.js", "css": [], "js": ["error.svelte-511f715f.js", "chunks/vendor-bbfa0731.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-0ef45d68.js", "css": ["assets/pages/index.svelte-19935c43.css"], "js": ["pages/index.svelte-0ef45d68.js", "chunks/vendor-bbfa0731.js"], "styles": [] }, "src/routes/search/__layout.svelte": { "entry": "pages/search/__layout.svelte-71731c9b.js", "css": ["assets/pages/search/__layout.svelte-f8a06f0d.css"], "js": ["pages/search/__layout.svelte-71731c9b.js", "chunks/vendor-bbfa0731.js"], "styles": [] }, "src/routes/search/ConditionSearchBar.svelte": { "entry": "pages/search/ConditionSearchBar.svelte-15a08dc3.js", "css": ["assets/pages/search/ConditionSearchBar.svelte-1b26f81d.css"], "js": ["pages/search/ConditionSearchBar.svelte-15a08dc3.js", "chunks/vendor-bbfa0731.js", "chunks/stores-e4e5fbd7.js"], "styles": [] }, "src/routes/search/SearchResults.svelte": { "entry": "pages/search/SearchResults.svelte-b3de327f.js", "css": ["assets/SearchResults.svelte_svelte&type=style&lang-878887c3.css", "assets/Trial.svelte_svelte&type=style&lang-6ad8cca2.css"], "js": ["pages/search/SearchResults.svelte-b3de327f.js", "chunks/vendor-bbfa0731.js", "pages/search/Trial.svelte-6713f0db.js", "chunks/stores-e4e5fbd7.js"], "styles": [] }, "src/routes/search/TagsSearchBar.svelte": { "entry": "pages/search/TagsSearchBar.svelte-89b05f8e.js", "css": ["assets/pages/search/TagsSearchBar.svelte-649e8dcd.css"], "js": ["pages/search/TagsSearchBar.svelte-89b05f8e.js", "chunks/vendor-bbfa0731.js"], "styles": [] }, "src/routes/search/searchPage.svelte": { "entry": "pages/search/searchPage.svelte-fa499a1f.js", "css": ["assets/pages/search/searchPage.svelte-44ab650a.css", "assets/Trial.svelte_svelte&type=style&lang-6ad8cca2.css", "assets/SearchResults.svelte_svelte&type=style&lang-878887c3.css", "assets/pages/search/ConditionSearchBar.svelte-1b26f81d.css", "assets/pages/search/TagsSearchBar.svelte-649e8dcd.css"], "js": ["pages/search/searchPage.svelte-fa499a1f.js", "chunks/vendor-bbfa0731.js", "pages/search/ConditionSearchBar.svelte-15a08dc3.js", "chunks/stores-e4e5fbd7.js", "pages/search/TagsSearchBar.svelte-89b05f8e.js"], "styles": [] }, "src/routes/search/trials/[trial].svelte": { "entry": "pages/search/trials/[trial].svelte-3e25f5c8.js", "css": ["assets/pages/search/trials/[trial].svelte-354375eb.css"], "js": ["pages/search/trials/[trial].svelte-3e25f5c8.js", "chunks/vendor-bbfa0731.js"], "styles": [] }, "src/routes/search/Trial.svelte": { "entry": "pages/search/Trial.svelte-6713f0db.js", "css": ["assets/Trial.svelte_svelte&type=style&lang-6ad8cca2.css"], "js": ["pages/search/Trial.svelte-6713f0db.js", "chunks/vendor-bbfa0731.js"], "styles": [] }, "src/routes/search/[searchResultsPage].svelte": { "entry": "pages/search/[searchResultsPage].svelte-6cd934b6.js", "css": ["assets/Trial.svelte_svelte&type=style&lang-6ad8cca2.css", "assets/SearchResults.svelte_svelte&type=style&lang-878887c3.css"], "js": ["pages/search/[searchResultsPage].svelte-6cd934b6.js", "chunks/vendor-bbfa0731.js", "pages/search/SearchResults.svelte-b3de327f.js", "pages/search/Trial.svelte-6713f0db.js", "chunks/stores-e4e5fbd7.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var testFunctions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var base = "";
var base$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": base
});
var css$8 = {
  code: ".svelte-1p9udav{font-family:sans-serif}",
  map: '{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["\\n\\n<div class=\\"style\\">\\n\\t<slot />\\n</div>\\n\\n<style> \\n\\n\\t* {\\n\\t\\tfont-family: sans-serif;\\n\\t}\\n\\n</style>"],"names":[],"mappings":"AAQC,eAAE,CAAC,AACF,WAAW,CAAE,UAAU,AACxB,CAAC"}'
};
var _layout$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$8);
  return `<div class="${"style svelte-1p9udav"}">${slots.default ? slots.default({}) : ``}
</div>`;
});
var __layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout$1
});
function load$3({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$3
});
var css$7 = {
  code: "main.svelte-1g4aob4{display:flex;justify-content:center;align-items:center;flex-flow:row;flex-wrap:wrap;min-height:90vh}.roles.svelte-1g4aob4{display:flex;justify-content:space-between;align-items:center;flex-flow:row;flex-wrap:wrap;width:50%;text-align:center}@media(max-width: 550px){.roles.svelte-1g4aob4{justify-content:center}}.cube.svelte-1g4aob4{display:flex;justify-content:center;align-items:center;flex-flow:row;flex-wrap:wrap;height:120px;width:120px;margin:auto;padding:auto;font-family:sans-serif;font-size:40px;font-weight:auto;background:#24b2ff;border-radius:8px}.cube.svelte-1g4aob4:hover{background:#5cc6ff}.not-available.svelte-1g4aob4{filter:grayscale(100%);cursor:unset}.not-available.svelte-1g4aob4:hover{background:#24b2ff}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<main>\\n\\t<div class=\\"roles\\">\\n\\t\\t<div class=\\"role\\">\\n\\t\\t\\t<a sveltekit:prefetch href=\\"/search/searchPage\\"><div class=\\"cube\\">\u{1F469}\u{1F3FB}\u200D\u2695\uFE0F</div></a>\\n\\t\\t\\t<p>\u042F \u0434\u043E\u043A\u0442\u043E\u0440</p>\\n\\t\\t</div>\\n\\t\\t<div class=\\"role\\">\\n\\t\\t\\t<div class=\\"cube not-available\\">\u{1F64B}\u{1F3FC}\u200D\u2642\uFE0F</div>\\n\\t\\t\\t<p>\u042F \u043F\u0430\u0446\u0438\u0435\u043D\u0442</p>\\n\\t\\t</div>\\n\\t\\t<div class=\\"role\\">\\n\\t\\t\\t<div class=\\"cube not-available\\">\u{1F3E8}</div>\\n\\t\\t\\t<p>\u0424\u0430\u0440\u043C\u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F</p>\\n\\t\\t</div>\\n\\t</div>\\n</main>\\n\\n<style lang=\\"scss\\">main {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  min-height: 90vh;\\n}\\n\\n.roles {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  width: 50%;\\n  text-align: center;\\n}\\n@media (max-width: 550px) {\\n  .roles {\\n    justify-content: center;\\n  }\\n}\\n\\n.cube {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  height: 120px;\\n  width: 120px;\\n  margin: auto;\\n  padding: auto;\\n  font-family: sans-serif;\\n  font-size: 40px;\\n  font-weight: auto;\\n  background: #24b2ff;\\n  border-radius: 8px;\\n}\\n.cube:hover {\\n  background: #5cc6ff;\\n}\\n\\n.not-available {\\n  filter: grayscale(100%);\\n  cursor: unset;\\n}\\n.not-available:hover {\\n  background: #24b2ff;\\n}</style>"],"names":[],"mappings":"AAiBmB,IAAI,eAAC,CAAC,AACvB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,MAAM,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,GAAG,CACV,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,eAAC,CAAC,AACN,eAAe,CAAE,MAAM,AACzB,CAAC,AACH,CAAC,AAED,KAAK,eAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,OAAO,CACnB,aAAa,CAAE,GAAG,AACpB,CAAC,AACD,oBAAK,MAAM,AAAC,CAAC,AACX,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,cAAc,eAAC,CAAC,AACd,MAAM,CAAE,UAAU,IAAI,CAAC,CACvB,MAAM,CAAE,KAAK,AACf,CAAC,AACD,6BAAc,MAAM,AAAC,CAAC,AACpB,UAAU,CAAE,OAAO,AACrB,CAAC"}'
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$7);
  return `<main class="${"svelte-1g4aob4"}"><div class="${"roles svelte-1g4aob4"}"><div class="${"role"}"><a sveltekit:prefetch href="${"/search/searchPage"}"><div class="${"cube svelte-1g4aob4"}">\u{1F469}\u{1F3FB}\u200D\u2695\uFE0F</div></a>
			<p>\u042F \u0434\u043E\u043A\u0442\u043E\u0440</p></div>
		<div class="${"role"}"><div class="${"cube not-available svelte-1g4aob4"}">\u{1F64B}\u{1F3FC}\u200D\u2642\uFE0F</div>
			<p>\u042F \u043F\u0430\u0446\u0438\u0435\u043D\u0442</p></div>
		<div class="${"role"}"><div class="${"cube not-available svelte-1g4aob4"}">\u{1F3E8}</div>
			<p>\u0424\u0430\u0440\u043C\u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F</p></div></div>
</main>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var css$6 = {
  code: ".svelte-gd7vwf.svelte-gd7vwf{font-family:sans-serif}.navbar.svelte-gd7vwf.svelte-gd7vwf{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:wrap}.navbar.svelte-gd7vwf p a.svelte-gd7vwf{display:flex;justify-content:center;align-items:center;flex-flow:row;flex-wrap:wrap;height:40px;width:160px;margin:6px;padding:auto;border:none;outline:none;background:none;color:none;text-decoration:none;list-style-type:none;background:#fcfcfc;border-radius:8px;cursor:pointer;color:black}.navbar.svelte-gd7vwf p a.svelte-gd7vwf:hover{background:#ebebeb}",
  map: '{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["\\n<div class=\\"navbar\\">\\n    <p><a sveltekit:prefetch href=\\"/\\">\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a></p>\\n    <p><a sveltekit:prefetch href=\\"/search/searchPage\\">\u041A \u043F\u043E\u0438\u0441\u043A\u0443</a></p>\\n</div>\\n<div class=\\"style\\">\\n\\t<slot />\\n</div>\\n\\n<style lang=\\"scss\\">* {\\n  font-family: sans-serif;\\n}\\n\\n.navbar {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n}\\n.navbar p a {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  height: 40px;\\n  width: 160px;\\n  margin: 6px;\\n  padding: auto;\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  background: #fcfcfc;\\n  border-radius: 8px;\\n  cursor: pointer;\\n  color: black;\\n}\\n.navbar p a:hover {\\n  background: #ebebeb;\\n}</style>"],"names":[],"mappings":"AASmB,4BAAE,CAAC,AACpB,WAAW,CAAE,UAAU,AACzB,CAAC,AAED,OAAO,4BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,AACjB,CAAC,AACD,qBAAO,CAAC,CAAC,CAAC,CAAC,cAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,IAAI,CACrB,UAAU,CAAE,OAAO,CACnB,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,KAAK,AACd,CAAC,AACD,qBAAO,CAAC,CAAC,CAAC,eAAC,MAAM,AAAC,CAAC,AACjB,UAAU,CAAE,OAAO,AACrB,CAAC"}'
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `<div class="${"navbar svelte-gd7vwf"}"><p class="${"svelte-gd7vwf"}"><a sveltekit:prefetch href="${"/"}" class="${"svelte-gd7vwf"}">\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E</a></p>
    <p class="${"svelte-gd7vwf"}"><a sveltekit:prefetch href="${"/search/searchPage"}" class="${"svelte-gd7vwf"}">\u041A \u043F\u043E\u0438\u0441\u043A\u0443</a></p></div>
<div class="${"style svelte-gd7vwf"}">${slots.default ? slots.default({}) : ``}
</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
var subscriber_queue2 = [];
function writable2(value, start = noop2) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue2.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue2.length; i += 2) {
            subscriber_queue2[i][0](subscriber_queue2[i + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var browser = false;
var searchTerms = writable2(browser);
searchTerms.subscribe((val) => browser);
var searchResultsFiltered = writable2(browser);
searchResultsFiltered.subscribe((val) => browser);
var css$5 = {
  code: "p.svelte-1gqnyuq.svelte-1gqnyuq{border:none;outline:none;background:none;color:none;text-decoration:none;list-style-type:none;height:auto;width:auto;margin:4px;padding:4px;border-radius:4px;max-width:280px}main.svelte-1gqnyuq.svelte-1gqnyuq{display:flex;justify-content:flex-start;align-items:center;flex-flow:column;flex-wrap:wrap;max-height:500px;font-family:sans-serif;padding:4px 20px 20px 20px}.searchBar.svelte-1gqnyuq.svelte-1gqnyuq{display:flex;justify-content:center;align-items:center;flex-flow:column;flex-wrap:wrap;align-items:center}.visibleSearchTipsContainer.svelte-1gqnyuq.svelte-1gqnyuq{display:flex;justify-content:center;align-items:center;flex-flow:row;flex-wrap:wrap;flex-flow:column;position:sticky;min-width:fit-content;max-width:240px;max-height:fit-content;background:#ffffff;box-shadow:rgba(100, 100, 110, 0.08) 0px 2px 29px 0px;border-radius:12px;overflow:hidden;overflow-y:scroll}@media(max-width: 550px){.visibleSearchTipsContainer.svelte-1gqnyuq.svelte-1gqnyuq{max-width:85%}}.visibleSearchTipsContainer.svelte-1gqnyuq button.svelte-1gqnyuq{border:none;outline:none;background:none;color:none;text-decoration:none;list-style-type:none;height:auto;width:auto;margin:4px;padding:8px;border-radius:4px;min-width:fit-content;max-width:360px;text-align:center}@media(max-width: 550px){.visibleSearchTipsContainer.svelte-1gqnyuq button.svelte-1gqnyuq{min-width:fit-content}}.visibleSearchTipsContainer.svelte-1gqnyuq button.svelte-1gqnyuq:hover{background-color:#fcfcfc;cursor:pointer}@media(max-width: 550px){}.searchDescription.svelte-1gqnyuq.svelte-1gqnyuq{font-family:sans-serif;font-size:12px;font-weight:600;color:#24b2ff;padding:8px}.searchArray.svelte-1gqnyuq.svelte-1gqnyuq{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:wrap}.searchArraySpan.svelte-1gqnyuq.svelte-1gqnyuq{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:nowrap;max-height:fit-content;padding:4px;margin:2px 2px 2px 2px;background:lightGrey;color:color;border-radius:6px}.removeSearchArraySpan.svelte-1gqnyuq.svelte-1gqnyuq{max-height:10px;font-size:14px;margin:2px;padding:4px;cursor:pointer;border-radius:4px;background:darkgrey}.removeSearchArraySpan.svelte-1gqnyuq.svelte-1gqnyuq:hover{background:#fcfcfc}.inputContainer.svelte-1gqnyuq.svelte-1gqnyuq{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:wrap;height:auto;width:auto;margin:6px;padding:4px;border:1px #ebebeb solid;border-radius:10px;min-height:30px;min-width:260px;max-width:360px}@media(max-width: 550px){.inputContainer.svelte-1gqnyuq.svelte-1gqnyuq{width:auto;min-width:260px}}input.svelte-1gqnyuq.svelte-1gqnyuq{border:none;outline:none;background:none;color:none;text-decoration:none;list-style-type:none;height:30px;width:auto;margin:auto;padding:4px;font-family:sans-serif;font-size:16px;font-weight:auto;min-width:200px}@media(max-width: 550px){input.svelte-1gqnyuq.svelte-1gqnyuq{width:auto;min-width:260px}}.focused.svelte-1gqnyuq.svelte-1gqnyuq{background:#fcfcfc !important}",
  map: `{"version":3,"file":"ConditionSearchBar.svelte","sources":["ConditionSearchBar.svelte"],"sourcesContent":["<script>\\n\\n\\timport { fly, scale } from 'svelte/transition'\\n\\timport { quintOut } from 'svelte/easing'\\n\\timport { createEventDispatcher } from 'svelte'\\n\\timport { searchTerms } from '../../stores.js'\\n\\n\\texport let searchTips;\\n\\texport let searchPropsArray = [];\\n\\texport let searchTerm = \\"\\";\\n\\texport let searchButton = \\"Text\\";\\n\\texport let searchButtonClicked = false;\\n\\texport let chosenElement = -1;\\n\\t$ :$searchTerms = searchPropsArray;\\n\\n\\tconst dispatch = createEventDispatcher()\\n\\n\\t$: uniqueSearchTips = searchTips.filter(function(item, pos) {\\n\\t\\treturn searchTips.indexOf(item) == pos;\\n\\t})\\n\\n\\t$ :visibleSearchTips = uniqueSearchTips.filter((tip) => {\\n\\t\\treturn tip.toLowerCase().includes(searchTerm.toLowerCase());\\n\\t})\\n\\tfunction removeDiv (i) {\\n\\t\\tif ($searchTerms.length > -1) {\\n\\t\\t\\tsearchPropsArray.splice(i, 1);\\n\\t\\t\\t$searchTerms = searchPropsArray;\\n    \\t\\tevent.target.parentNode.remove();\\n    \\t}\\n\\t}\\n\\tfunction chooseSearchTip (e) {\\n\\t\\tsearchPropsArray.push(e.target.innerHTML);\\n\\t\\tsearchPropsArray = searchPropsArray;\\n\\t\\tsearchTerm = \\"\\";\\n\\t\\tsearchButtonClicked = true;\\n\\t\\t// $searchTerms = searchPropsArray;\\n\\t}\\n\\tfunction defocusAndDeclick () {\\n\\t\\tdocument.querySelectorAll(\\".focused\\").forEach(item => item.classList.toggle(\\"focused\\"));\\n\\t\\tsearchButtonClicked = false;\\n\\t}\\n\\tfunction chooseSearchTipWithKeys (e) {\\n\\t    if (e.keyCode == 38) {\\n\\t        e.preventDefault()\\n\\t        chosenElement -= 1;\\n\\t        if (chosenElement < 0) {\\n\\t            chosenElement = -1;\\n\\t            document.querySelectorAll(\\"#tipsButton\\")[0].classList.toggle(\\"focused\\");\\n\\t            return;\\n\\t        } else {\\n\\t        document.querySelectorAll(\\"#tipsButton\\")[chosenElement+1].classList.toggle(\\"focused\\");\\n\\t        document.querySelectorAll(\\"#tipsButton\\")[chosenElement].classList.toggle(\\"focused\\");\\n\\t        }\\n\\t    }\\n\\t    if (e.keyCode == 40) {\\n\\t        e.preventDefault()\\n\\t        chosenElement += 1;\\n\\t        if (chosenElement == visibleSearchTips.length) {\\n\\t            chosenElement = 0;\\n\\t            document.querySelectorAll(\\"#tipsButton\\")[visibleSearchTips.length-1].classList.toggle(\\"focused\\");\\n\\t            document.querySelectorAll(\\"#tipsButton\\")[chosenElement].classList.toggle(\\"focused\\");\\n\\t        } else if (chosenElement == 0) {\\n\\t            document.querySelectorAll(\\"#tipsButton\\")[chosenElement].classList.toggle(\\"focused\\");\\n\\t        } else {\\n\\t        document.querySelectorAll(\\"#tipsButton\\")[chosenElement-1].classList.toggle(\\"focused\\");\\n\\t        document.querySelectorAll(\\"#tipsButton\\")[chosenElement].classList.toggle(\\"focused\\");\\n\\t        \\t}\\n\\t    \\t}\\n\\t\\t}\\n\\tfunction onKeyPress (e) {\\n\\t\\tif (e.charCode == 13) {\\n\\t\\t\\te.preventDefault();\\n\\t\\t\\tchosenElement = -1;\\n\\t\\t\\tif (!searchButtonClicked && document.querySelectorAll(\\".focused\\").length > 0) {\\n\\t\\t\\t\\tsearchTerm = document.querySelector(\\".focused\\").innerHTML;\\n\\t\\t\\t\\tsearchPropsArray.push(searchTerm);\\n\\t\\t\\t\\tsearchPropsArray = searchPropsArray;\\n\\t\\t\\t\\tsearchTerm = \\"\\";\\n\\t\\t\\t\\tsearchButtonClicked = true;\\n\\t\\t\\t} else {\\n\\t\\t\\t\\tpassSearchTerm();\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n\\tfunction passSearchTerm () {\\n\\t\\tsearchButtonClicked = true;\\n\\t\\tdispatch(\\"searchTermPassed\\", {\\n\\t\\t\\t\\"passedSearchTerm\\": searchPropsArray,\\n\\t\\t})\\n\\t}\\n\\n\\tlet focus = false;\\n\\n<\/script>\\n\\n<main>\\n\\t\\n\\t<div class=\\"searchBar\\">\\n\\t\\t<p class=\\"searchDescription\\">\\n\\t\\t\\t\u0417\u0434\u0435\u0441\u044C \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0442\u043E\u043A\u043E\u043B\u0430 \u0438\u043B\u0438 \u0434\u0438\u0430\u0433\u043D\u043E\u0437:\\n\\t\\t</p>\\n\\t\\t<div class=\\"inputContainer\\">\\n\\t\\t\\t<div class=\\"searchArray\\">\\n\\t\\t\\t\\t{#each searchPropsArray as elem, i}\\n\\t\\t\\t\\t\\t<div transition:scale=\\"{{duration: 200, delay: 0, opacity: 0.25, start: 0.25, easing: quintOut}}\\" class=\\"searchArraySpan\\">{elem}\\n\\t\\t\\t\\t\\t\\t<div on:click={() => removeDiv(i)} class=\\"removeSearchArraySpan\\">\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t{/each}\\n\\t\\t\\t</div>\\n\\t\\t\\t<input autocomplete=\\"off\\" \\n\\t\\t\\tplaceholder=\\"\u0420\u0430\u043A \u043B\u0435\u0433\u043A\u0438\u0445, \u0440\u0430\u043A \u043C\u043E\u0437\u0433\u0430\\" \\n\\t\\t\\tonfocus=\\"placeholder=''\\"\\n\\t\\t\\ttype=\\"text\\" \\n\\t\\t\\tbind:value={searchTerm} \\n\\t\\t\\ton:keydown={chooseSearchTipWithKeys} \\n\\t\\t\\ton:keypress={onKeyPress} \\n\\t\\t\\ton:click={defocusAndDeclick} \\n\\t\\t\\ton:input={defocusAndDeclick} \\n\\t\\t\\ton:focus={() => {focus = true}} \\n\\t\\t\\ton:blur={() => {focus = false}}>\\n\\t\\t</div>\\n\\t<!-- <button class=\\"searchButton\\" on:click={passSearchTerm}>\u0418\u0441\u043A\u0430\u0442\u044C</button> -->\\n\\t</div>\\n\\n\\t{#if searchTerm.length && !searchButtonClicked && focus == true}\\n\\t\\t<div transition:fly={{ y: 20, duration: 125 }} class=\\"visibleSearchTipsContainer\\">\\n\\t\\t{#each visibleSearchTips as tips}\\n\\t\\t\\t<div class=\\"visibleSearchTips\\">\\n\\t\\t\\t\\t<button id=\\"tipsButton\\" class=\\"focused\\" bind:this={searchButton} on:click={chooseSearchTip}>{tips}</button>\\n\\t\\t\\t</div>\\n\\t\\t{:else}\\n\\t\\t\\t<p>\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C. \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441</p>\\n\\t\\t{/each}\\n\\t\\t</div>\\n\\t{/if}\\n\\n</main>\\n\\n<style lang=\\"scss\\">p {\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  height: auto;\\n  width: auto;\\n  margin: 4px;\\n  padding: 4px;\\n  border-radius: 4px;\\n  max-width: 280px;\\n}\\n\\nmain {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  max-height: 500px;\\n  font-family: sans-serif;\\n  padding: 4px 20px 20px 20px;\\n}\\n\\n.searchBar {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  align-items: center;\\n}\\n\\n.visibleSearchTipsContainer {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  flex-flow: column;\\n  position: sticky;\\n  min-width: fit-content;\\n  max-width: 240px;\\n  max-height: fit-content;\\n  background: #ffffff;\\n  box-shadow: rgba(100, 100, 110, 0.08) 0px 2px 29px 0px;\\n  border-radius: 12px;\\n  overflow: hidden;\\n  overflow-y: scroll;\\n}\\n@media (max-width: 550px) {\\n  .visibleSearchTipsContainer {\\n    max-width: 85%;\\n  }\\n}\\n.visibleSearchTipsContainer button {\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  height: auto;\\n  width: auto;\\n  margin: 4px;\\n  padding: 8px;\\n  border-radius: 4px;\\n  min-width: fit-content;\\n  max-width: 360px;\\n  text-align: center;\\n}\\n@media (max-width: 550px) {\\n  .visibleSearchTipsContainer button {\\n    min-width: fit-content;\\n  }\\n}\\n.visibleSearchTipsContainer button:hover {\\n  background-color: #fcfcfc;\\n  cursor: pointer;\\n}\\n\\n.searchButton {\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  height: 40px;\\n  width: auto;\\n  margin: auto;\\n  padding: 4px;\\n  background: #24b2ff;\\n  color: #ffffff;\\n  cursor: pointer;\\n  min-width: 40px;\\n  border-radius: 4px;\\n  margin-top: 16px;\\n}\\n@media (max-width: 550px) {\\n  .searchButton {\\n    min-width: 100%;\\n  }\\n}\\n.searchButton:hover {\\n  background: #5cc6ff;\\n}\\n\\n.searchDescription {\\n  font-family: sans-serif;\\n  font-size: 12px;\\n  font-weight: 600;\\n  color: #24b2ff;\\n  padding: 8px;\\n}\\n\\n.searchArray {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n}\\n\\n.searchArraySpan {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: nowrap;\\n  max-height: fit-content;\\n  padding: 4px;\\n  margin: 2px 2px 2px 2px;\\n  background: lightGrey;\\n  color: color;\\n  border-radius: 6px;\\n}\\n\\n.removeSearchArraySpan {\\n  max-height: 10px;\\n  font-size: 14px;\\n  margin: 2px;\\n  padding: 4px;\\n  cursor: pointer;\\n  border-radius: 4px;\\n  background: darkgrey;\\n}\\n.removeSearchArraySpan:hover {\\n  background: #fcfcfc;\\n}\\n\\n.inputContainer {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  height: auto;\\n  width: auto;\\n  margin: 6px;\\n  padding: 4px;\\n  border: 1px #ebebeb solid;\\n  border-radius: 10px;\\n  min-height: 30px;\\n  min-width: 260px;\\n  max-width: 360px;\\n}\\n@media (max-width: 550px) {\\n  .inputContainer {\\n    width: auto;\\n    min-width: 260px;\\n  }\\n}\\n\\ninput {\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  height: 30px;\\n  width: auto;\\n  margin: auto;\\n  padding: 4px;\\n  font-family: sans-serif;\\n  font-size: 16px;\\n  font-weight: auto;\\n  min-width: 200px;\\n}\\n@media (max-width: 550px) {\\n  input {\\n    width: auto;\\n    min-width: 260px;\\n  }\\n}\\n\\n.focused {\\n  background: #fcfcfc !important;\\n}</style>"],"names":[],"mappings":"AA4ImB,CAAC,8BAAC,CAAC,AACpB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,IAAI,CACrB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,CACZ,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,IAAI,8BAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,KAAK,CACjB,WAAW,CAAE,UAAU,CACvB,OAAO,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,AAC7B,CAAC,AAED,UAAU,8BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,2BAA2B,8BAAC,CAAC,AAC3B,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,MAAM,CACjB,QAAQ,CAAE,MAAM,CAChB,SAAS,CAAE,WAAW,CACtB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,WAAW,CACvB,UAAU,CAAE,OAAO,CACnB,UAAU,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CACtD,aAAa,CAAE,IAAI,CACnB,QAAQ,CAAE,MAAM,CAChB,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,2BAA2B,8BAAC,CAAC,AAC3B,SAAS,CAAE,GAAG,AAChB,CAAC,AACH,CAAC,AACD,0CAA2B,CAAC,MAAM,eAAC,CAAC,AAClC,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,IAAI,CACrB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,CACZ,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,WAAW,CACtB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,0CAA2B,CAAC,MAAM,eAAC,CAAC,AAClC,SAAS,CAAE,WAAW,AACxB,CAAC,AACH,CAAC,AACD,0CAA2B,CAAC,qBAAM,MAAM,AAAC,CAAC,AACxC,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,OAAO,AACjB,CAAC,AAoBD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAI3B,CAAC,AAKD,kBAAkB,8BAAC,CAAC,AAClB,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,GAAG,AACd,CAAC,AAED,YAAY,8BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,AACjB,CAAC,AAED,gBAAgB,8BAAC,CAAC,AAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,MAAM,CACjB,UAAU,CAAE,WAAW,CACvB,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CACvB,UAAU,CAAE,SAAS,CACrB,KAAK,CAAE,KAAK,CACZ,aAAa,CAAE,GAAG,AACpB,CAAC,AAED,sBAAsB,8BAAC,CAAC,AACtB,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,OAAO,CACf,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,QAAQ,AACtB,CAAC,AACD,oDAAsB,MAAM,AAAC,CAAC,AAC5B,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,eAAe,8BAAC,CAAC,AACf,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CAAC,OAAO,CAAC,KAAK,CACzB,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,KAAK,AAClB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,eAAe,8BAAC,CAAC,AACf,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,KAAK,AAClB,CAAC,AACH,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,IAAI,CACrB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,GAAG,CACZ,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,IAAI,CACjB,SAAS,CAAE,KAAK,AAClB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,KAAK,8BAAC,CAAC,AACL,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,KAAK,AAClB,CAAC,AACH,CAAC,AAED,QAAQ,8BAAC,CAAC,AACR,UAAU,CAAE,OAAO,CAAC,UAAU,AAChC,CAAC"}`
};
var ConditionSearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let uniqueSearchTips;
  let visibleSearchTips;
  let $searchTerms, $$unsubscribe_searchTerms;
  $$unsubscribe_searchTerms = subscribe(searchTerms, (value) => $searchTerms = value);
  let { searchTips } = $$props;
  let { searchPropsArray = [] } = $$props;
  let { searchTerm = "" } = $$props;
  let { searchButton = "Text" } = $$props;
  let { searchButtonClicked = false } = $$props;
  let { chosenElement = -1 } = $$props;
  createEventDispatcher();
  let focus = false;
  if ($$props.searchTips === void 0 && $$bindings.searchTips && searchTips !== void 0)
    $$bindings.searchTips(searchTips);
  if ($$props.searchPropsArray === void 0 && $$bindings.searchPropsArray && searchPropsArray !== void 0)
    $$bindings.searchPropsArray(searchPropsArray);
  if ($$props.searchTerm === void 0 && $$bindings.searchTerm && searchTerm !== void 0)
    $$bindings.searchTerm(searchTerm);
  if ($$props.searchButton === void 0 && $$bindings.searchButton && searchButton !== void 0)
    $$bindings.searchButton(searchButton);
  if ($$props.searchButtonClicked === void 0 && $$bindings.searchButtonClicked && searchButtonClicked !== void 0)
    $$bindings.searchButtonClicked(searchButtonClicked);
  if ($$props.chosenElement === void 0 && $$bindings.chosenElement && chosenElement !== void 0)
    $$bindings.chosenElement(chosenElement);
  $$result.css.add(css$5);
  set_store_value(searchTerms, $searchTerms = searchPropsArray, $searchTerms);
  uniqueSearchTips = searchTips.filter(function(item, pos) {
    return searchTips.indexOf(item) == pos;
  });
  visibleSearchTips = uniqueSearchTips.filter((tip) => {
    return tip.toLowerCase().includes(searchTerm.toLowerCase());
  });
  $$unsubscribe_searchTerms();
  return `<main class="${"svelte-1gqnyuq"}"><div class="${"searchBar svelte-1gqnyuq"}"><p class="${"searchDescription svelte-1gqnyuq"}">\u0417\u0434\u0435\u0441\u044C \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0442\u043E\u043A\u043E\u043B\u0430 \u0438\u043B\u0438 \u0434\u0438\u0430\u0433\u043D\u043E\u0437:
		</p>
		<div class="${"inputContainer svelte-1gqnyuq"}"><div class="${"searchArray svelte-1gqnyuq"}">${each(searchPropsArray, (elem, i) => `<div class="${"searchArraySpan svelte-1gqnyuq"}">${escape2(elem)}
						<div class="${"removeSearchArraySpan svelte-1gqnyuq"}"></div>
					</div>`)}</div>
			<input autocomplete="${"off"}" placeholder="${"\u0420\u0430\u043A \u043B\u0435\u0433\u043A\u0438\u0445, \u0440\u0430\u043A \u043C\u043E\u0437\u0433\u0430"}" onfocus="${"placeholder=''"}" type="${"text"}" class="${"svelte-1gqnyuq"}"${add_attribute("value", searchTerm, 0)}></div>
	</div>

	${searchTerm.length && !searchButtonClicked && focus == true ? `<div class="${"visibleSearchTipsContainer svelte-1gqnyuq"}">${visibleSearchTips.length ? each(visibleSearchTips, (tips) => `<div class="${"visibleSearchTips"}"><button id="${"tipsButton"}" class="${"focused svelte-1gqnyuq"}"${add_attribute("this", searchButton, 0)}>${escape2(tips)}</button>
			</div>`) : `<p class="${"svelte-1gqnyuq"}">\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C. \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441</p>`}</div>` : ``}

</main>`;
});
var ConditionSearchBar$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ConditionSearchBar
});
var css$4 = {
  code: "a.svelte-1x6xhsn.svelte-1x6xhsn{color:white;text-decoration:none}.name.svelte-1x6xhsn.svelte-1x6xhsn{max-width:200px;min-width:200px;background:#24b2ff}.name.svelte-1x6xhsn.svelte-1x6xhsn:hover{background:#5cc6ff;cursor:pointer}@media(max-width: 840px){.name.svelte-1x6xhsn.svelte-1x6xhsn{min-height:60px;min-width:300px}}@media(max-width: 500px){.name.svelte-1x6xhsn.svelte-1x6xhsn{width:90%}}.trial.svelte-1x6xhsn.svelte-1x6xhsn{font-family:sans-serif;font-size:12px;display:flex;justify-content:space-between;align-items:center;flex-flow:row;flex-wrap:nowrap;border-radius:10px;background:#fcfcfc;margin:15px;padding:15px;max-width:1440px}@media(max-width: 840px){.trial.svelte-1x6xhsn.svelte-1x6xhsn{flex-wrap:wrap;flex-flow:column;max-width:90%;justify-content:center}}@media(max-width: 500px){.trial.svelte-1x6xhsn.svelte-1x6xhsn{flex-flow:wrap;background:#fcfcfc}}@media(max-width: 840px){.organisation.svelte-1x6xhsn.svelte-1x6xhsn{display:none}}p.svelte-1x6xhsn.svelte-1x6xhsn{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;flex-grow:2;flex-flow:column;padding:4px 20px;border-radius:6px;margin:4px;max-width:90px;text-align:center}p.svelte-1x6xhsn span.svelte-1x6xhsn{display:none;font-weight:600;margin-bottom:4px}@media(max-width: 840px){p.svelte-1x6xhsn span.svelte-1x6xhsn{display:block}}",
  map: '{"version":3,"file":"Trial.svelte","sources":["Trial.svelte"],"sourcesContent":["<script>\\n\\n\\texport let trialsData;\\n\\n<\/script>\\n\\n<div class=\\"trial\\">\\n\\t<a sveltekit:prefetch href={`./trials/${trialsData.id}`}><p class=\\"name\\" >{trialsData.name}</p></a>\\n\\t<p><span>\u{1F912}</span><span>\u0414\u0438\u0430\u0433\u043D\u043E\u0437</span>{trialsData.condition.substring(0, 30)}</p>\\n\\t<p><span>\u{1F48A}</span><span>\u0412\u043C\u0435\u0448\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E</span>{trialsData.interventions.substring(0, 45)}</p>\\n\\t<p><span>\u{1F469}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}</span><span>\u041F\u0430\u0446\u0438\u0435\u043D\u0442\u044B</span>{trialsData.numberOfPatients}</p>\\n\\t<p class=\\"organisation\\"><span>\u{1F3E8}</span><span>\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438</span>{trialsData.organisations.substring(0, 34)}</p>\\n\\t<p><span>\u{1F3D9}</span><span>\u0413\u043E\u0440\u043E\u0434</span>{trialsData.city}</p>\\n</div>\\n\\n<style lang=\\"scss\\">a {\\n  color: white;\\n  text-decoration: none;\\n}\\n\\n.name {\\n  max-width: 200px;\\n  min-width: 200px;\\n  background: #24b2ff;\\n}\\n.name:hover {\\n  background: #5cc6ff;\\n  cursor: pointer;\\n}\\n@media (max-width: 840px) {\\n  .name {\\n    min-height: 60px;\\n    min-width: 300px;\\n  }\\n}\\n@media (max-width: 500px) {\\n  .name {\\n    width: 90%;\\n  }\\n}\\n\\n.trial {\\n  font-family: sans-serif;\\n  font-size: 12px;\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: nowrap;\\n  border-radius: 10px;\\n  background: #fcfcfc;\\n  margin: 15px;\\n  padding: 15px;\\n  max-width: 1440px;\\n}\\n@media (max-width: 840px) {\\n  .trial {\\n    flex-wrap: wrap;\\n    flex-flow: column;\\n    max-width: 90%;\\n    justify-content: center;\\n  }\\n}\\n@media (max-width: 500px) {\\n  .trial {\\n    flex-flow: wrap;\\n    background: #fcfcfc;\\n  }\\n}\\n\\n@media (max-width: 840px) {\\n  .organisation {\\n    display: none;\\n  }\\n}\\n\\np {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  flex-wrap: wrap;\\n  flex-grow: 2;\\n  flex-flow: column;\\n  padding: 4px 20px;\\n  border-radius: 6px;\\n  margin: 4px;\\n  max-width: 90px;\\n  text-align: center;\\n}\\np span {\\n  display: none;\\n  font-weight: 600;\\n  margin-bottom: 4px;\\n}\\n@media (max-width: 840px) {\\n  p span {\\n    display: block;\\n  }\\n}</style>\\t"],"names":[],"mappings":"AAemB,CAAC,8BAAC,CAAC,AACpB,KAAK,CAAE,KAAK,CACZ,eAAe,CAAE,IAAI,AACvB,CAAC,AAED,KAAK,8BAAC,CAAC,AACL,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,OAAO,AACrB,CAAC,AACD,mCAAK,MAAM,AAAC,CAAC,AACX,UAAU,CAAE,OAAO,CACnB,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,KAAK,8BAAC,CAAC,AACL,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,KAAK,AAClB,CAAC,AACH,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,KAAK,8BAAC,CAAC,AACL,KAAK,CAAE,GAAG,AACZ,CAAC,AACH,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,MAAM,CACjB,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,OAAO,CACnB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,8BAAC,CAAC,AACN,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,GAAG,CACd,eAAe,CAAE,MAAM,AACzB,CAAC,AACH,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,8BAAC,CAAC,AACN,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,OAAO,AACrB,CAAC,AACH,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,aAAa,8BAAC,CAAC,AACb,OAAO,CAAE,IAAI,AACf,CAAC,AACH,CAAC,AAED,CAAC,8BAAC,CAAC,AACD,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,CAAC,CACZ,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,GAAG,CACX,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,gBAAC,CAAC,IAAI,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,GAAG,CAChB,aAAa,CAAE,GAAG,AACpB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,gBAAC,CAAC,IAAI,eAAC,CAAC,AACN,OAAO,CAAE,KAAK,AAChB,CAAC,AACH,CAAC"}'
};
var Trial = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { trialsData } = $$props;
  if ($$props.trialsData === void 0 && $$bindings.trialsData && trialsData !== void 0)
    $$bindings.trialsData(trialsData);
  $$result.css.add(css$4);
  return `<div class="${"trial svelte-1x6xhsn"}"><a sveltekit:prefetch${add_attribute("href", `./trials/${trialsData.id}`, 0)} class="${"svelte-1x6xhsn"}"><p class="${"name svelte-1x6xhsn"}">${escape2(trialsData.name)}</p></a>
	<p class="${"svelte-1x6xhsn"}"><span class="${"svelte-1x6xhsn"}">\u{1F912}</span><span class="${"svelte-1x6xhsn"}">\u0414\u0438\u0430\u0433\u043D\u043E\u0437</span>${escape2(trialsData.condition.substring(0, 30))}</p>
	<p class="${"svelte-1x6xhsn"}"><span class="${"svelte-1x6xhsn"}">\u{1F48A}</span><span class="${"svelte-1x6xhsn"}">\u0412\u043C\u0435\u0448\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E</span>${escape2(trialsData.interventions.substring(0, 45))}</p>
	<p class="${"svelte-1x6xhsn"}"><span class="${"svelte-1x6xhsn"}">\u{1F469}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}</span><span class="${"svelte-1x6xhsn"}">\u041F\u0430\u0446\u0438\u0435\u043D\u0442\u044B</span>${escape2(trialsData.numberOfPatients)}</p>
	<p class="${"organisation svelte-1x6xhsn"}"><span class="${"svelte-1x6xhsn"}">\u{1F3E8}</span><span class="${"svelte-1x6xhsn"}">\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438</span>${escape2(trialsData.organisations.substring(0, 34))}</p>
	<p class="${"svelte-1x6xhsn"}"><span class="${"svelte-1x6xhsn"}">\u{1F3D9}</span><span class="${"svelte-1x6xhsn"}">\u0413\u043E\u0440\u043E\u0434</span>${escape2(trialsData.city)}</p>
</div>`;
});
var Trial$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Trial
});
var css$3 = {
  code: "main.svelte-1k78yfp{display:flex;justify-content:center}.tableContainer.svelte-1k78yfp{display:flex;justify-content:space-between;flex-wrap:wrap;max-width:1440px}.trial.svelte-1k78yfp{flex-grow:2;max-width:1460px}.name.svelte-1k78yfp{max-width:200px;min-width:200px}@media(max-width: 550px){.name.svelte-1k78yfp{max-width:fit-content}}.tableTips.svelte-1k78yfp{font-family:sans-serif;font-size:12px;font-weight:800;display:flex;justify-content:space-between;align-items:center;flex-flow:row;flex-wrap:nowrap;border-radius:10px;margin:15px;padding:15px;flex-grow:2}@media(max-width: 840px){.tableTips.svelte-1k78yfp{display:none}}p.svelte-1k78yfp{display:flex;justify-content:center;align-items:center;flex-flow:column;flex-wrap:wrap;flex-grow:2;padding:4px 20px;margin:4px;max-width:90px;border-radius:6px}",
  map: `{"version":3,"file":"SearchResults.svelte","sources":["SearchResults.svelte"],"sourcesContent":["<script>\\n\\n\\timport { fly, fade } from 'svelte/transition'\\n\\timport Trial from \\"./Trial.svelte\\"\\n\\timport { searchResultsFiltered } from \\"../../stores.js\\"\\n\\timport { searchTerms } from \\"../../stores.js\\"\\n\\t\\n\\tlet searchProps = $searchTerms;\\n\\tlet databaseItems = $searchResultsFiltered;\\n\\n<\/script>\\n\\n<main>\\n{#if searchProps != \\"-\\"}\\n\\t{#if databaseItems.length}\\n\\t<div class=\\"tableContainer\\" in:fly={{ y: 60, duration: 325}} out:fade={{duration: 2}} >\\n\\t\\t<div class=\\"tableTips\\">\\n\\t\\t\\t<p class=\\"name\\"><span>\u{1F3E5}</span>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F</p>\\n\\t\\t\\t<p><span>\u{1F912}</span>\u0414\u0438\u0430\u0433\u043D\u043E\u0437</p>\\n\\t\\t\\t<p><span>\u{1F48A}</span>\u0412\u043C\u0435\u0448\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E</p>\\n\\t\\t\\t<p><span>\u{1F469}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}</span>\u041F\u0430\u0446\u0438\u0435\u043D\u0442\u044B</p>\\n\\t\\t\\t<p><span>\u{1F3E8}</span>\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F</p>\\n\\t\\t\\t<p><span>\u{1F3D9}</span>\u0413\u043E\u0440\u043E\u0434</p>\\n\\t\\t</div>\\n\\t\\t{#each databaseItems as trials}\\n\\t\\t<div class=\\"trial\\">\\n\\t\\t\\t<Trial trialsData={trials}/>\\n\\t\\t</div>\\n\\t\\t{/each}\\n\\t</div>\\n\\t{:else}\\n\\t<p class=\\"tableTips\\">\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</p>\\n\\t{/if}\\n{/if}\\n</main>\\n\\n<style lang=\\"scss\\">main {\\n  display: flex;\\n  justify-content: center;\\n}\\n\\n.tableContainer {\\n  display: flex;\\n  justify-content: space-between;\\n  flex-wrap: wrap;\\n  max-width: 1440px;\\n}\\n\\n.trial {\\n  flex-grow: 2;\\n  max-width: 1460px;\\n}\\n\\n.name {\\n  max-width: 200px;\\n  min-width: 200px;\\n}\\n@media (max-width: 550px) {\\n  .name {\\n    max-width: fit-content;\\n  }\\n}\\n\\n.tableTips {\\n  font-family: sans-serif;\\n  font-size: 12px;\\n  font-weight: 800;\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: nowrap;\\n  border-radius: 10px;\\n  margin: 15px;\\n  padding: 15px;\\n  flex-grow: 2;\\n}\\n@media (max-width: 840px) {\\n  .tableTips {\\n    display: none;\\n  }\\n}\\n\\np {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  flex-grow: 2;\\n  padding: 4px 20px;\\n  margin: 4px;\\n  max-width: 90px;\\n  border-radius: 6px;\\n}</style>\\n"],"names":[],"mappings":"AAoCmB,IAAI,eAAC,CAAC,AACvB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,AACzB,CAAC,AAED,eAAe,eAAC,CAAC,AACf,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,MAAM,AACnB,CAAC,AAED,MAAM,eAAC,CAAC,AACN,SAAS,CAAE,CAAC,CACZ,SAAS,CAAE,MAAM,AACnB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,KAAK,AAClB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,KAAK,eAAC,CAAC,AACL,SAAS,CAAE,WAAW,AACxB,CAAC,AACH,CAAC,AAED,UAAU,eAAC,CAAC,AACV,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,MAAM,CACjB,aAAa,CAAE,IAAI,CACnB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,CAAC,AACd,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,UAAU,eAAC,CAAC,AACV,OAAO,CAAE,IAAI,AACf,CAAC,AACH,CAAC,AAED,CAAC,eAAC,CAAC,AACD,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,CAAC,CACZ,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,GAAG,CACX,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,GAAG,AACpB,CAAC"}`
};
var SearchResults = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $searchResultsFiltered, $$unsubscribe_searchResultsFiltered;
  let $searchTerms, $$unsubscribe_searchTerms;
  $$unsubscribe_searchResultsFiltered = subscribe(searchResultsFiltered, (value) => $searchResultsFiltered = value);
  $$unsubscribe_searchTerms = subscribe(searchTerms, (value) => $searchTerms = value);
  let searchProps = $searchTerms;
  let databaseItems = $searchResultsFiltered;
  $$result.css.add(css$3);
  $$unsubscribe_searchResultsFiltered();
  $$unsubscribe_searchTerms();
  return `<main class="${"svelte-1k78yfp"}">${searchProps != "-" ? `${databaseItems.length ? `<div class="${"tableContainer svelte-1k78yfp"}"><div class="${"tableTips svelte-1k78yfp"}"><p class="${"name svelte-1k78yfp"}"><span>\u{1F3E5}</span>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F</p>
			<p class="${"svelte-1k78yfp"}"><span>\u{1F912}</span>\u0414\u0438\u0430\u0433\u043D\u043E\u0437</p>
			<p class="${"svelte-1k78yfp"}"><span>\u{1F48A}</span>\u0412\u043C\u0435\u0448\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E</p>
			<p class="${"svelte-1k78yfp"}"><span>\u{1F469}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}</span>\u041F\u0430\u0446\u0438\u0435\u043D\u0442\u044B</p>
			<p class="${"svelte-1k78yfp"}"><span>\u{1F3E8}</span>\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F</p>
			<p class="${"svelte-1k78yfp"}"><span>\u{1F3D9}</span>\u0413\u043E\u0440\u043E\u0434</p></div>
		${each(databaseItems, (trials) => `<div class="${"trial svelte-1k78yfp"}">${validate_component(Trial, "Trial").$$render($$result, { trialsData: trials }, {}, {})}
		</div>`)}</div>` : `<p class="${"tableTips svelte-1k78yfp"}">\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</p>`}` : ``}
</main>`;
});
var SearchResults$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": SearchResults
});
var css$2 = {
  code: "main.svelte-mbs8aj.svelte-mbs8aj{display:flex;justify-content:flex-start;align-items:center;flex-flow:column;flex-wrap:wrap;font-family:sans-serif;padding:4px 20px 20px 20px;margin:10px;border-radius:8px;filter:grayscale(100%);background:#fcfcfc;pointer-events:none}.searchBar.svelte-mbs8aj.svelte-mbs8aj{display:flex;justify-content:center;align-items:center;flex-flow:column;flex-wrap:wrap;align-items:flex-start}.searchDescription.svelte-mbs8aj.svelte-mbs8aj{font-family:sans-serif;font-size:12px;font-weight:600;max-width:260px;color:#24b2ff;padding:8px}.inputContainer.svelte-mbs8aj.svelte-mbs8aj{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:wrap;height:auto;width:auto;margin:6px;padding:4px;border:1px #ebebeb solid;border-radius:10px;min-height:30px;min-width:260px;max-width:360px}@media(max-width: 550px){.inputContainer.svelte-mbs8aj.svelte-mbs8aj{width:auto;min-width:260px}}.input.svelte-mbs8aj.svelte-mbs8aj{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:wrap;border:none;outline:none;background:none;color:none;text-decoration:none;list-style-type:none;height:30px;width:auto;margin:auto;padding:4px;font-family:sans-serif;font-size:16px;font-weight:auto;min-height:20px;min-width:200px}@media(max-width: 550px){.input.svelte-mbs8aj.svelte-mbs8aj{width:auto;min-width:260px}}.searchArray.svelte-mbs8aj.svelte-mbs8aj{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:wrap}.searchArraySpan.svelte-mbs8aj.svelte-mbs8aj{display:flex;justify-content:flex-start;align-items:center;flex-flow:row;flex-wrap:nowrap;max-height:20px;padding:4px;margin:2px 2px 2px 2px;background:lightGrey;color:color;border-radius:6px}.removeSearchArraySpan.svelte-mbs8aj.svelte-mbs8aj{max-height:10px;font-size:12px;margin:2px;padding:4px;cursor:pointer;border-radius:4px;background:darkgrey}.removeSearchArraySpan.svelte-mbs8aj.svelte-mbs8aj:hover{background:#fcfcfc}.visibleSearchTipsContainer.svelte-mbs8aj.svelte-mbs8aj{display:flex;justify-content:center;align-items:center;flex-flow:row;flex-wrap:wrap;position:relative;width:380px;background:#ffffff;box-shadow:rgba(100, 100, 110, 0.08) 0px 2px 29px 0px;border-radius:12px}.visibleSearchTipsContainer.svelte-mbs8aj button.svelte-mbs8aj{border:none;outline:none;background:none;color:none;text-decoration:none;list-style-type:none;height:auto;width:auto;margin:4px;padding:8px;border-radius:4px;min-width:340px;text-align:left}.visibleSearchTipsContainer.svelte-mbs8aj button.svelte-mbs8aj:hover{background-color:#fcfcfc;cursor:pointer}",
  map: `{"version":3,"file":"TagsSearchBar.svelte","sources":["TagsSearchBar.svelte"],"sourcesContent":["<script>\\n\\nimport { scale, fly } from 'svelte/transition';\\nimport { quintOut } from 'svelte/easing';\\n\\nlet searchProps = [];\\nlet searchTerm = \\"\\";\\nexport let searchTags;\\n\\n$ :visibleSearchTips = searchTags.filter((tag) => {\\n\\t\\treturn tag.toLowerCase().includes(searchTerm.toLowerCase());\\n\\t})\\n\\nfunction removeDiv (e) {\\n    e.target.parentNode.remove();\\n}\\n\\nfunction onKeyPress (e) {\\n        if (e.charCode == 13) {\\n\\t\\t\\te.preventDefault();\\n            if (searchTerm.length) {\\n            searchProps.push(searchTerm);\\n            searchProps = searchProps;\\n            searchTerm = \\"\\";\\n            } else {\\n                return;\\n            }\\n\\t\\t}\\n    }\\n\\n<\/script>\\n\\n<main>\\n    <div class=\\"searchBar\\">\\n        <p class=\\"searchDescription\\">\\n\\t\\t\\t\u0417\u0434\u0435\u0441\u044C \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u0432\u0438\u0434 \u0442\u0435\u0440\u0430\u043F\u0438\u0438, \u0433\u043E\u0440\u043E\u0434 \u0438\u043B\u0438 \u0441\u0442\u0430\u0442\u0443\u0441 \u043D\u0430\u0431\u043E\u0440\u0430 \u043F\u0430\u0446\u0438\u0435\u043D\u0442\u043E\u0432:\\n\\t\\t</p>\\n        <div class=\\"inputContainer\\">\\n            <div class=\\"searchArray\\">\\n                {#each searchProps as elem}\\n                    <div transition:scale=\\"{{duration: 200, delay: 0, opacity: 0.25, start: 0.25, easing: quintOut}}\\" class=\\"searchArraySpan\\">{elem}\\n                        <div on:click={removeDiv} class=\\"removeSearchArraySpan\\">\\n                        </div>\\n                    </div>\\n                {/each}\\n            </div>\\n            <input autocomplete=\\"off\\" placeholder=\\"\u041C\u043E\u0441\u043A\u0432\u0430, \u0432\u0435\u0434\u0435\u0442\u0441\u044F \u043D\u0430\u0431\u043E\u0440, \u0445\u0438\u043C\u0438\u043E\u0442\u0435\u0440\u0430\u043F\u0438\u044F\\" onfocus=\\"placeholder=''\\" on:keypress={onKeyPress} bind:value={searchTerm} class=\\"input\\">\\n        </div>\\n    </div>\\n\\t{#if searchTerm.length}\\n    <div transition:fly={{ y: 20, duration: 125 }} class=\\"visibleSearchTipsContainer\\">\\n    {#each visibleSearchTips as tips}\\n        <div class=\\"visibleSearchTips\\">\\n            <button id=\\"tipsButton\\" class=\\"focused\\">{tips}</button>\\n        </div>\\n    {:else}\\n        <p>\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C. \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441</p>\\n    {/each}\\n    </div>\\n    {/if}\\n</main>\\n\\n<style lang='scss'>main {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  font-family: sans-serif;\\n  padding: 4px 20px 20px 20px;\\n  margin: 10px;\\n  border-radius: 8px;\\n  filter: grayscale(100%);\\n  background: #fcfcfc;\\n  pointer-events: none;\\n}\\n\\n.searchBar {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  align-items: flex-start;\\n}\\n\\n.searchDescription {\\n  font-family: sans-serif;\\n  font-size: 12px;\\n  font-weight: 600;\\n  max-width: 260px;\\n  color: #24b2ff;\\n  padding: 8px;\\n}\\n\\n.inputContainer {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  height: auto;\\n  width: auto;\\n  margin: 6px;\\n  padding: 4px;\\n  border: 1px #ebebeb solid;\\n  border-radius: 10px;\\n  min-height: 30px;\\n  min-width: 260px;\\n  max-width: 360px;\\n}\\n@media (max-width: 550px) {\\n  .inputContainer {\\n    width: auto;\\n    min-width: 260px;\\n  }\\n}\\n\\n.input {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  height: 30px;\\n  width: auto;\\n  margin: auto;\\n  padding: 4px;\\n  font-family: sans-serif;\\n  font-size: 16px;\\n  font-weight: auto;\\n  min-height: 20px;\\n  min-width: 200px;\\n}\\n@media (max-width: 550px) {\\n  .input {\\n    width: auto;\\n    min-width: 260px;\\n  }\\n}\\n\\n.searchArray {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n}\\n\\n.searchArraySpan {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: nowrap;\\n  max-height: 20px;\\n  padding: 4px;\\n  margin: 2px 2px 2px 2px;\\n  background: lightGrey;\\n  color: color;\\n  border-radius: 6px;\\n}\\n\\n.removeSearchArraySpan {\\n  max-height: 10px;\\n  font-size: 12px;\\n  margin: 2px;\\n  padding: 4px;\\n  cursor: pointer;\\n  border-radius: 4px;\\n  background: darkgrey;\\n}\\n.removeSearchArraySpan:hover {\\n  background: #fcfcfc;\\n}\\n\\n.visibleSearchTipsContainer {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  position: relative;\\n  width: 380px;\\n  background: #ffffff;\\n  box-shadow: rgba(100, 100, 110, 0.08) 0px 2px 29px 0px;\\n  border-radius: 12px;\\n}\\n.visibleSearchTipsContainer button {\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  height: auto;\\n  width: auto;\\n  margin: 4px;\\n  padding: 8px;\\n  border-radius: 4px;\\n  min-width: 340px;\\n  text-align: left;\\n}\\n.visibleSearchTipsContainer button:hover {\\n  background-color: #fcfcfc;\\n  cursor: pointer;\\n}</style>"],"names":[],"mappings":"AA8DmB,IAAI,4BAAC,CAAC,AACvB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,UAAU,CACvB,OAAO,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CAC3B,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,UAAU,IAAI,CAAC,CACvB,UAAU,CAAE,OAAO,CACnB,cAAc,CAAE,IAAI,AACtB,CAAC,AAED,UAAU,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,UAAU,AACzB,CAAC,AAED,kBAAkB,4BAAC,CAAC,AAClB,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,KAAK,CAChB,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,GAAG,AACd,CAAC,AAED,eAAe,4BAAC,CAAC,AACf,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CAAC,OAAO,CAAC,KAAK,CACzB,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,KAAK,AAClB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,eAAe,4BAAC,CAAC,AACf,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,KAAK,AAClB,CAAC,AACH,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,IAAI,CACrB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,GAAG,CACZ,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,KAAK,AAClB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,4BAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,KAAK,AAClB,CAAC,AACH,CAAC,AAED,YAAY,4BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,AACjB,CAAC,AAED,gBAAgB,4BAAC,CAAC,AAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,MAAM,CACjB,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CACvB,UAAU,CAAE,SAAS,CACrB,KAAK,CAAE,KAAK,CACZ,aAAa,CAAE,GAAG,AACpB,CAAC,AAED,sBAAsB,4BAAC,CAAC,AACtB,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,OAAO,CACf,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,QAAQ,AACtB,CAAC,AACD,kDAAsB,MAAM,AAAC,CAAC,AAC5B,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,2BAA2B,4BAAC,CAAC,AAC3B,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,OAAO,CACnB,UAAU,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CACtD,aAAa,CAAE,IAAI,AACrB,CAAC,AACD,yCAA2B,CAAC,MAAM,cAAC,CAAC,AAClC,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,IAAI,CACrB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,CACZ,aAAa,CAAE,GAAG,CAClB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,yCAA2B,CAAC,oBAAM,MAAM,AAAC,CAAC,AACxC,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,OAAO,AACjB,CAAC"}`
};
var TagsSearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let visibleSearchTips;
  let searchProps = [];
  let searchTerm = "";
  let { searchTags } = $$props;
  if ($$props.searchTags === void 0 && $$bindings.searchTags && searchTags !== void 0)
    $$bindings.searchTags(searchTags);
  $$result.css.add(css$2);
  visibleSearchTips = searchTags.filter((tag) => {
    return tag.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return `<main class="${"svelte-mbs8aj"}"><div class="${"searchBar svelte-mbs8aj"}"><p class="${"searchDescription svelte-mbs8aj"}">\u0417\u0434\u0435\u0441\u044C \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u0432\u0438\u0434 \u0442\u0435\u0440\u0430\u043F\u0438\u0438, \u0433\u043E\u0440\u043E\u0434 \u0438\u043B\u0438 \u0441\u0442\u0430\u0442\u0443\u0441 \u043D\u0430\u0431\u043E\u0440\u0430 \u043F\u0430\u0446\u0438\u0435\u043D\u0442\u043E\u0432:
		</p>
        <div class="${"inputContainer svelte-mbs8aj"}"><div class="${"searchArray svelte-mbs8aj"}">${each(searchProps, (elem) => `<div class="${"searchArraySpan svelte-mbs8aj"}">${escape2(elem)}
                        <div class="${"removeSearchArraySpan svelte-mbs8aj"}"></div>
                    </div>`)}</div>
            <input autocomplete="${"off"}" placeholder="${"\u041C\u043E\u0441\u043A\u0432\u0430, \u0432\u0435\u0434\u0435\u0442\u0441\u044F \u043D\u0430\u0431\u043E\u0440, \u0445\u0438\u043C\u0438\u043E\u0442\u0435\u0440\u0430\u043F\u0438\u044F"}" onfocus="${"placeholder=''"}" class="${"input svelte-mbs8aj"}"${add_attribute("value", searchTerm, 0)}></div></div>
	${searchTerm.length ? `<div class="${"visibleSearchTipsContainer svelte-mbs8aj"}">${visibleSearchTips.length ? each(visibleSearchTips, (tips) => `<div class="${"visibleSearchTips"}"><button id="${"tipsButton"}" class="${"focused svelte-mbs8aj"}">${escape2(tips)}</button>
        </div>`) : `<p>\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C. \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441</p>`}</div>` : ``}
</main>`;
});
var TagsSearchBar$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": TagsSearchBar
});
var css$1 = {
  code: "main.svelte-6oeatg{display:flex;justify-content:center;align-items:center;flex-flow:column;flex-wrap:wrap;transition:0.4s}h1.svelte-6oeatg{max-width:80%;text-align:center}.searchWindow.svelte-6oeatg{display:flex;justify-content:center;align-items:center;flex-flow:column;flex-wrap:wrap;border-radius:16px;max-width:537px;box-shadow:rgba(100, 100, 111, 0.14) 0px 8px 24px 0px}.searchButton.svelte-6oeatg{border:none;outline:none;background:none;color:none;text-decoration:none;list-style-type:none;height:40px;width:auto;margin:auto;padding:4px;background:#24b2ff;color:#ffffff;cursor:pointer;min-width:40px;border-radius:8px;margin-top:16px}@media(max-width: 550px){.searchButton.svelte-6oeatg{min-width:100%}}.searchButton.svelte-6oeatg:hover{background:#5cc6ff}",
  map: `{"version":3,"file":"searchPage.svelte","sources":["searchPage.svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\texport const load = async({ fetch }) => {\\n\\t\\tconst resDB = await fetch(\\"https://demo-db-server-master.herokuapp.com/cancers\\");\\n\\t\\tconst DB = await resDB.json();\\n\\t\\treturn {\\n\\t\\t\\tprops: {\\n\\t\\t\\t\\tDB\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n<\/script>\\n\\n<script>\\n\\n\\timport { fly, fade } from 'svelte/transition'\\n\\timport ConditionSearchBar from './ConditionSearchBar.svelte'\\n\\timport SearchResults from './SearchResults.svelte'\\n\\timport TagsSearchBar from './TagsSearchBar.svelte'\\n\\timport { searchTerms } from '../../stores.js'\\n\\n//searchProps is the data that is passed from dispatched props of SearchBar and reassigned as soon as searchTermPassed\\n\\n\\texport let searchProps;\\n\\texport let DB;\\n\\texport let searchTips = [];\\n\\texport let searchTags = [];\\n\\n\\tDB.forEach(item => {searchTips.push(item.condition)})\\n\\tDB.forEach(item => {searchTags.push(item.interventions, item.city, item.phase)})\\n\\t\\n\\texport let spreadedProps = {\\n\\t\\tsearchProps: searchProps,\\n\\t\\tDB: DB,\\n\\t}\\n\\n\\tfunction reassignSearchProps (e) {\\n\\t\\tspreadedProps.searchProps = e.detail.passedSearchTerm;\\n\\t}\\n\\n\\tfunction passSearchProps () {\\n\\t\\t$searchTerms = searchPropsArray;\\n\\t}\\n\\n<\/script>\\n\\n\\n\\t<main in:fly={{ y: 40, duration: 325 }} out:fade={{duration: 0}}>\\n\\t\\t<h1>\u041F\u043E\u0438\u0441\u043A \u0420\u041A\u0418</h1>\\n\\t\\t<div class=\\"searchWindow\\">\\n\\t\\t<ConditionSearchBar searchTips={searchTips} on:searchTermPassed={reassignSearchProps} />\\n\\t\\t<TagsSearchBar searchTags={searchTags} />\\n\\t\\t</div>\\n\\t\\t<a href={\`./\${$searchTerms}\`}><button class=\\"searchButton\\">\u0418\u0441\u043A\u0430\u0442\u044C</button></a>\\n\\t</main>\\n\\n<style lang=\\"scss\\">main {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  transition: 0.4s;\\n}\\n\\nh1 {\\n  max-width: 80%;\\n  text-align: center;\\n}\\n\\n.searchWindow {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  border-radius: 16px;\\n  max-width: 537px;\\n  box-shadow: rgba(100, 100, 111, 0.14) 0px 8px 24px 0px;\\n}\\n\\n.searchButton {\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  height: 40px;\\n  width: auto;\\n  margin: auto;\\n  padding: 4px;\\n  background: #24b2ff;\\n  color: #ffffff;\\n  cursor: pointer;\\n  min-width: 40px;\\n  border-radius: 8px;\\n  margin-top: 16px;\\n}\\n.searchButton a {\\n  border: none;\\n  outline: none;\\n  background: none;\\n  color: none;\\n  text-decoration: none;\\n  list-style-type: none;\\n  color: white;\\n}\\n@media (max-width: 550px) {\\n  .searchButton {\\n    min-width: 100%;\\n  }\\n}\\n.searchButton:hover {\\n  background: #5cc6ff;\\n}</style>\\n"],"names":[],"mappings":"AAuDmB,IAAI,cAAC,CAAC,AACvB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,SAAS,CAAE,GAAG,CACd,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,aAAa,cAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,IAAI,CACnB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,AACxD,CAAC,AAED,aAAa,cAAC,CAAC,AACb,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,IAAI,CACrB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,GAAG,CACZ,UAAU,CAAE,OAAO,CACnB,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,OAAO,CACf,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,IAAI,AAClB,CAAC,AAUD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,aAAa,cAAC,CAAC,AACb,SAAS,CAAE,IAAI,AACjB,CAAC,AACH,CAAC,AACD,2BAAa,MAAM,AAAC,CAAC,AACnB,UAAU,CAAE,OAAO,AACrB,CAAC"}`
};
var load$2 = async ({ fetch: fetch2 }) => {
  const resDB = await fetch2("https://demo-db-server-master.herokuapp.com/cancers");
  const DB = await resDB.json();
  return { props: { DB } };
};
var SearchPage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $searchTerms, $$unsubscribe_searchTerms;
  $$unsubscribe_searchTerms = subscribe(searchTerms, (value) => $searchTerms = value);
  let { searchProps } = $$props;
  let { DB } = $$props;
  let { searchTips = [] } = $$props;
  let { searchTags = [] } = $$props;
  DB.forEach((item) => {
    searchTips.push(item.condition);
  });
  DB.forEach((item) => {
    searchTags.push(item.interventions, item.city, item.phase);
  });
  let { spreadedProps = { searchProps, DB } } = $$props;
  if ($$props.searchProps === void 0 && $$bindings.searchProps && searchProps !== void 0)
    $$bindings.searchProps(searchProps);
  if ($$props.DB === void 0 && $$bindings.DB && DB !== void 0)
    $$bindings.DB(DB);
  if ($$props.searchTips === void 0 && $$bindings.searchTips && searchTips !== void 0)
    $$bindings.searchTips(searchTips);
  if ($$props.searchTags === void 0 && $$bindings.searchTags && searchTags !== void 0)
    $$bindings.searchTags(searchTags);
  if ($$props.spreadedProps === void 0 && $$bindings.spreadedProps && spreadedProps !== void 0)
    $$bindings.spreadedProps(spreadedProps);
  $$result.css.add(css$1);
  $$unsubscribe_searchTerms();
  return `<main class="${"svelte-6oeatg"}"><h1 class="${"svelte-6oeatg"}">\u041F\u043E\u0438\u0441\u043A \u0420\u041A\u0418</h1>
		<div class="${"searchWindow svelte-6oeatg"}">${validate_component(ConditionSearchBar, "ConditionSearchBar").$$render($$result, { searchTips }, {}, {})}
		${validate_component(TagsSearchBar, "TagsSearchBar").$$render($$result, { searchTags }, {}, {})}</div>
		<a${add_attribute("href", `./${$searchTerms}`, 0)}><button class="${"searchButton svelte-6oeatg"}">\u0418\u0441\u043A\u0430\u0442\u044C</button></a>
	</main>`;
});
var searchPage = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": SearchPage,
  load: load$2
});
var css = {
  code: "main.svelte-wvgor3{display:flex;justify-content:center;align-items:center;flex-flow:row;flex-wrap:wrap;min-height:90vh}.listsContainer.svelte-wvgor3{display:flex;max-width:1440px}@media(max-width: 840px){.listsContainer.svelte-wvgor3{flex-wrap:wrap;justify-content:center}}.listOfOrganisations.svelte-wvgor3{display:flex;justify-content:flex-start;align-items:center;flex-flow:column;flex-wrap:wrap;text-align:center}.organisation.svelte-wvgor3{height:auto;width:auto;margin:10px;padding:12px;background:#24b2ff;color:#ffffff;border-radius:12px;max-width:260px}@media(max-width: 840px){.organisation.svelte-wvgor3{min-width:65%}}.valueOfListItem.svelte-wvgor3{height:auto;width:auto;margin:0px 20px;padding:8px;font-family:sans-serif;font-size:auto;font-weight:200;background:#fcfcfc;border-radius:10px;flex-basis:34%;text-align:center}img.svelte-wvgor3{height:50px;width:50px;margin:auto;padding:auto;border-radius:40px}li.svelte-wvgor3{display:flex;justify-content:space-between;align-items:center;flex-flow:row;flex-wrap:wrap;margin:12px 12px 12px 0px;list-style-type:none}@media(max-width: 550px){li.svelte-wvgor3{margin-right:34px;flex-flow:column}}a.svelte-wvgor3{text-decoration:none;color:white;padding:6px;border-radius:8px}a.svelte-wvgor3:hover{background:#5cc6ff}",
  map: '{"version":3,"file":"[trial].svelte","sources":["[trial].svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\n\\texport const load = async ({ page, fetch }) => {\\n\\t\\tconst id = page.params.trial;\\n\\t\\tconst res = await fetch(`https://demo-db-server-master.herokuapp.com/cancers/${id}`);\\n\\t\\tconst trialPage = await res.json();\\n\\t\\treturn {\\n\\t\\t\\tprops: {\\n\\t\\t\\t\\ttrialPage,\\n\\t\\t\\t}\\n\\t\\t}\\n\\t}\\n\\n<\/script>\\n\\n<script>\\n\\texport let trialPage;\\n\\tlet arrayOfOrganisations = trialPage.clinicalCentres\\n<\/script>\\n\\n<main>\\n\\t<div class=\\"listsContainer\\">\\n\\t\\t<div class=\\"listOfProperties\\">\\n\\t\\t\\t<ul>\\n\\t\\t\\t\\t<li><b>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class=\\"valueOfListItem\\">{trialPage.name}</span></li>\\n\\t\\t\\t\\t<li><b>\u0414\u0438\u0430\u0433\u043D\u043E\u0437:</b> <span class=\\"valueOfListItem\\">{trialPage.condition}</span></li>\\n\\t\\t\\t\\t<li><b>\u0412\u0438\u0434\u044B \u0432\u043C\u0435\u0448\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0430:</b> <span class=\\"valueOfListItem\\">{trialPage.interventions}</span></li>\\n\\t\\t\\t\\t<li><b>\u0421\u0442\u0430\u0442\u0443\u0441:</b> <span class=\\"valueOfListItem\\">{trialPage.status}</span></li>\\n\\t\\t\\t\\t<li><b>\u0414\u0430\u0442\u0430 \u043D\u0430\u0447\u0430\u043B\u0430:</b> <span class=\\"valueOfListItem\\">{trialPage.start}</span></li>\\n\\t\\t\\t\\t<li><b>\u0414\u0430\u0442\u0430 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F:</b> <span class=\\"valueOfListItem\\">{trialPage.finish}</span></li>\\n\\t\\t\\t\\t<li><b>\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F, \u043F\u0440\u043E\u0432\u043E\u0434\u044F\u0449\u0430\u044F \u041A\u0418:</b> <span class=\\"valueOfListItem\\">{trialPage.organisations}</span></li>\\n\\t\\t\\t\\t<li><b>\u0424\u0430\u0437\u0430:</b> <span class=\\"valueOfListItem\\">{trialPage.phase}</span></li>\\n\\t\\t\\t\\t<li><b>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043F\u0430\u0446\u0438\u0435\u043D\u0442\u043E\u0432:</b> <span class=\\"valueOfListItem\\">{trialPage.numberOfPatients}</span></li>\\n\\t\\t\\t\\t<li><b>\u0422\u0438\u043F \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class=\\"valueOfListItem\\">{trialPage.type}</span></li>\\n\\t\\t\\t\\t<li><b>\u0426\u0435\u043B\u044C \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class=\\"valueOfListItem\\">{trialPage.aim}</span></li>\\n\\t\\t\\t\\t<li><b>\u0413\u043E\u0440\u043E\u0434(\u0430), \u0433\u0434\u0435 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class=\\"valueOfListItem\\">{trialPage.city}</span></li>\\n\\t\\t\\t\\t<li><b>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043A\u043B\u0438\u043D\u0438\u043A, \u0443\u0447\u0430\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0445 \u0432 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0438:</b> <span class=\\"valueOfListItem\\">{trialPage.numberOfClinics}</span></li>\\n\\t\\t\\t</ul>\\n\\t\\t</div>\\n\\t\\t<div class=\\"listOfOrganisations\\">\\n\\t\\t\\t{#if arrayOfOrganisations.length}\\n\\t\\t\\t<h1>\u0426\u0435\u043D\u0442\u0440\u044B, \u0432 \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435</h1>\\n\\t\\t\\t{#each arrayOfOrganisations as item}\\n\\t\\t\\t<div class=\\"organisation\\">\\n\\t\\t\\t\\t<img src=\\"{item.image}\\" alt=\\"\u041B\u043E\u0433\u043E\u0442\u0438\u043F \u0446\u0435\u043D\u0442\u0440\u0430\\">\\n\\t\\t\\t\\t<p>{item.name}</p>\\n\\t\\t\\t\\t<p><a href=\\"tel:{item.number}\\">{item.number}</a></p>\\n\\t\\t\\t\\t<p><a href=\\"mailto:{item.email}\\">{item.email}</a></p>\\n\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n</main>\\n\\n<style lang=\\"scss\\">main {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  min-height: 90vh;\\n}\\n\\n.listsContainer {\\n  display: flex;\\n  max-width: 1440px;\\n}\\n@media (max-width: 840px) {\\n  .listsContainer {\\n    flex-wrap: wrap;\\n    justify-content: center;\\n  }\\n}\\n\\n.listOfOrganisations {\\n  display: flex;\\n  justify-content: flex-start;\\n  align-items: center;\\n  flex-flow: column;\\n  flex-wrap: wrap;\\n  text-align: center;\\n}\\n\\n.organisation {\\n  height: auto;\\n  width: auto;\\n  margin: 10px;\\n  padding: 12px;\\n  background: #24b2ff;\\n  color: #ffffff;\\n  border-radius: 12px;\\n  max-width: 260px;\\n}\\n@media (max-width: 840px) {\\n  .organisation {\\n    min-width: 65%;\\n  }\\n}\\n\\n.valueOfListItem {\\n  height: auto;\\n  width: auto;\\n  margin: 0px 20px;\\n  padding: 8px;\\n  font-family: sans-serif;\\n  font-size: auto;\\n  font-weight: 200;\\n  background: #fcfcfc;\\n  border-radius: 10px;\\n  flex-basis: 34%;\\n  text-align: center;\\n}\\n\\nimg {\\n  height: 50px;\\n  width: 50px;\\n  margin: auto;\\n  padding: auto;\\n  border-radius: 40px;\\n}\\n\\nli {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  flex-flow: row;\\n  flex-wrap: wrap;\\n  margin: 12px 12px 12px 0px;\\n  list-style-type: none;\\n}\\n@media (max-width: 550px) {\\n  li {\\n    margin-right: 34px;\\n    flex-flow: column;\\n  }\\n}\\n\\na {\\n  text-decoration: none;\\n  color: white;\\n  padding: 6px;\\n  border-radius: 8px;\\n}\\na:hover {\\n  background: #5cc6ff;\\n}</style>\\n\\n"],"names":[],"mappings":"AAuDmB,IAAI,cAAC,CAAC,AACvB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,eAAe,cAAC,CAAC,AACf,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,eAAe,cAAC,CAAC,AACf,SAAS,CAAE,IAAI,CACf,eAAe,CAAE,MAAM,AACzB,CAAC,AACH,CAAC,AAED,oBAAoB,cAAC,CAAC,AACpB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,aAAa,cAAC,CAAC,AACb,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,OAAO,CACnB,KAAK,CAAE,OAAO,CACd,aAAa,CAAE,IAAI,CACnB,SAAS,CAAE,KAAK,AAClB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,aAAa,cAAC,CAAC,AACb,SAAS,CAAE,GAAG,AAChB,CAAC,AACH,CAAC,AAED,gBAAgB,cAAC,CAAC,AAChB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CAAC,IAAI,CAChB,OAAO,CAAE,GAAG,CACZ,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,CAChB,UAAU,CAAE,OAAO,CACnB,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,GAAG,CACf,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,GAAG,cAAC,CAAC,AACH,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,IAAI,AACrB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,GAAG,CACd,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,GAAG,CAC1B,eAAe,CAAE,IAAI,AACvB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,EAAE,cAAC,CAAC,AACF,YAAY,CAAE,IAAI,CAClB,SAAS,CAAE,MAAM,AACnB,CAAC,AACH,CAAC,AAED,CAAC,cAAC,CAAC,AACD,eAAe,CAAE,IAAI,CACrB,KAAK,CAAE,KAAK,CACZ,OAAO,CAAE,GAAG,CACZ,aAAa,CAAE,GAAG,AACpB,CAAC,AACD,eAAC,MAAM,AAAC,CAAC,AACP,UAAU,CAAE,OAAO,AACrB,CAAC"}'
};
var load$1 = async ({ page, fetch: fetch2 }) => {
  const id = page.params.trial;
  const res = await fetch2(`https://demo-db-server-master.herokuapp.com/cancers/${id}`);
  const trialPage = await res.json();
  return { props: { trialPage } };
};
var U5Btrialu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { trialPage } = $$props;
  let arrayOfOrganisations = trialPage.clinicalCentres;
  if ($$props.trialPage === void 0 && $$bindings.trialPage && trialPage !== void 0)
    $$bindings.trialPage(trialPage);
  $$result.css.add(css);
  return `<main class="${"svelte-wvgor3"}"><div class="${"listsContainer svelte-wvgor3"}"><div class="${"listOfProperties"}"><ul><li class="${"svelte-wvgor3"}"><b>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.name)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0414\u0438\u0430\u0433\u043D\u043E\u0437:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.condition)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0412\u0438\u0434\u044B \u0432\u043C\u0435\u0448\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0430:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.interventions)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0421\u0442\u0430\u0442\u0443\u0441:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.status)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0414\u0430\u0442\u0430 \u043D\u0430\u0447\u0430\u043B\u0430:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.start)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0414\u0430\u0442\u0430 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.finish)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F, \u043F\u0440\u043E\u0432\u043E\u0434\u044F\u0449\u0430\u044F \u041A\u0418:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.organisations)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0424\u0430\u0437\u0430:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.phase)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043F\u0430\u0446\u0438\u0435\u043D\u0442\u043E\u0432:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.numberOfPatients)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0422\u0438\u043F \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.type)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0426\u0435\u043B\u044C \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.aim)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u0413\u043E\u0440\u043E\u0434(\u0430), \u0433\u0434\u0435 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.city)}</span></li>
				<li class="${"svelte-wvgor3"}"><b>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043A\u043B\u0438\u043D\u0438\u043A, \u0443\u0447\u0430\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0445 \u0432 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0438:</b> <span class="${"valueOfListItem svelte-wvgor3"}">${escape2(trialPage.numberOfClinics)}</span></li></ul></div>
		<div class="${"listOfOrganisations svelte-wvgor3"}">${arrayOfOrganisations.length ? `<h1>\u0426\u0435\u043D\u0442\u0440\u044B, \u0432 \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435</h1>
			${each(arrayOfOrganisations, (item) => `<div class="${"organisation svelte-wvgor3"}"><img${add_attribute("src", item.image, 0)} alt="${"\u041B\u043E\u0433\u043E\u0442\u0438\u043F \u0446\u0435\u043D\u0442\u0440\u0430"}" class="${"svelte-wvgor3"}">
				<p>${escape2(item.name)}</p>
				<p><a href="${"tel:" + escape2(item.number)}" class="${"svelte-wvgor3"}">${escape2(item.number)}</a></p>
				<p><a href="${"mailto:" + escape2(item.email)}" class="${"svelte-wvgor3"}">${escape2(item.email)}</a></p>
			</div>`)}` : ``}</div></div>
</main>`;
});
var _trial_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Btrialu5D,
  load: load$1
});
var load = async ({ fetch: fetch2 }) => {
  const resDB = await fetch2("https://demo-db-server-master.herokuapp.com/cancers");
  const DB = await resDB.json();
  return { props: { DB } };
};
var U5BsearchResultsPageu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $searchResultsFiltered, $$unsubscribe_searchResultsFiltered;
  let $searchTerms, $$unsubscribe_searchTerms;
  $$unsubscribe_searchResultsFiltered = subscribe(searchResultsFiltered, (value) => $searchResultsFiltered = value);
  $$unsubscribe_searchTerms = subscribe(searchTerms, (value) => $searchTerms = value);
  let { DB } = $$props;
  let { result = DB.filter((item) => {
    return $searchTerms.some((i) => {
      const condition = item.condition.toLowerCase();
      const interventions = item.interventions.toLowerCase();
      const city = item.city.toLowerCase();
      const phase = item.phase.toLowerCase();
      i = i.toLowerCase();
      return condition.includes(i) || city.includes(i) || interventions.includes(i) || phase.includes(i);
    });
  }) } = $$props;
  set_store_value(searchResultsFiltered, $searchResultsFiltered = result, $searchResultsFiltered);
  if ($$props.DB === void 0 && $$bindings.DB && DB !== void 0)
    $$bindings.DB(DB);
  if ($$props.result === void 0 && $$bindings.result && result !== void 0)
    $$bindings.result(result);
  $$unsubscribe_searchResultsFiltered();
  $$unsubscribe_searchTerms();
  return `${validate_component(SearchResults, "SearchResults").$$render($$result, {}, {}, {})}`;
});
var _searchResultsPage_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5BsearchResultsPageu5D,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
