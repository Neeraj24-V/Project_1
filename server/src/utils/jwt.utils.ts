import jwt from "jsonwebtoken";

function signJWT(
  object: Object,
  key: string,
  options?: jwt.SignOptions | undefined
) {
  try {
    return jwt.sign(object, key, {
      ...options,
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
}

function verifyJWT(token: string, key: string) {
  try {
    const decoded = jwt.verify(token, key);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: true,
      decoded: null,
    };
  }
}

export { signJWT, verifyJWT };
