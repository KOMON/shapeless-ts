import { Option, fromPredicate, match } from "fp-ts/Option";
import { Refinement } from "fp-ts/Refinement";
import { constant, flow, pipe, unsafeCoerce } from "fp-ts/function";

export interface Typeable<A> {
  readonly is: Refinement<unknown, A>;
  readonly cast: <B>(tb: Typeable<B>) => (a: A) => Option<B>;
}

export const URI = "Typeable";

export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: Typeable<A>;
  }
}

export const cast = <A, B>(ta: Typeable<A>, tb: Typeable<B>) => ta.cast(tb);

export const getTypeable = <A>(is: Refinement<unknown, A>): Typeable<A> => ({
  is,
  cast: <B>(tb: Typeable<B>) => fromPredicate(tb.is),
});

export const mkT = <A, B>(ta: Typeable<A>, tb: Typeable<B>) => (
  f: (b: B) => B
) => (a: A) =>
  pipe(
    a,
    ta.cast(tb),
    // when the cast to B succeeds, we know that B === A, but we need unsafeCoerce to convince TS
    match<B, A>(constant(a), flow<[B], B, A>(f, unsafeCoerce))
  );

type Tagged = { readonly _tag: string };
export const tagMatches = <A extends Tagged>(tag: A["_tag"]) => (
  u: unknown
): u is A => {
  return (
    typeof u === "object" &&
    u !== null &&
    u !== undefined &&
    "_tag" in u &&
    (u as any)._tag === tag
  );
};

export const getTaggedTypeable = <A extends Tagged>(tag: A["_tag"]) =>
  getTypeable<A>(tagMatches(tag));
