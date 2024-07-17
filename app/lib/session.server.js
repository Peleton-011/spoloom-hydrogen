import {createCookieSessionStorage} from '@shopify/remix-oxygen';

export class AppSession {
  isPending = false;
  #sessionStorage;
  #session;

  constructor(sessionStorage, session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    });

    const session = await storage
      .getSession(request.headers.get('Cookie'))
      .catch(() => storage.getSession());

    return new this(storage, session);
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return (key) => {
      const value = this.#session.get(key);
      if (key.startsWith('course_') && key.endsWith('_access')) {
        if (value && value.granted) {
          // Check if access has expired
          if (Date.now() - value.grantedAt < 30 * 24 * 60 * 60 * 1000) {
            return value;
          } else {
            this.unset(key);
            return undefined;
          }
        }
      }
      return value;
    };
  }

  get flash() {
    return this.#session.flash;
  }

  get unset() {
    this.isPending = true;
    return this.#session.unset;
  }

  get set() {
    this.isPending = true;
    return (key, value) => {
      if (key.startsWith('course_') && key.endsWith('_access')) {
        value = {
          granted: value,
          grantedAt: Date.now()
        };
      }
      return this.#session.set(key, value);
    };
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  commit() {
    this.isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }

  grantCourseAccess(courseId) {
    this.set(`course_${courseId}_access`, true);
  }

  revokeCourseAccess(courseId) {
    this.unset(`course_${courseId}_access`);
  }

  hasCourseAccess(courseId) {
    const accessData = this.get(`course_${courseId}_access`);
    return accessData?.granted && (Date.now() - accessData.grantedAt < 30 * 24 * 60 * 60 * 1000);
  }

  getAccessibleCourses(allCourses) {
    return allCourses.filter(course => this.hasCourseAccess(course.id));
  }
}

/** @typedef {import('@shopify/hydrogen').HydrogenSession} HydrogenSession */
/** @typedef {import('@shopify/remix-oxygen').SessionStorage} SessionStorage */
/** @typedef {import('@shopify/remix-oxygen').Session} Session */